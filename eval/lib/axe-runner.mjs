#!/usr/bin/env node
/**
 * axe-runner.mjs — Storybook 전 스토리 axe-core 동적 a11y 검사 (v0.7)
 *
 * 무엇인가:
 *   check.mjs(토큰 대비)·grep(정적 패턴)이 못 보는 "렌더된 DOM" 층을 검사한다.
 *   ARIA 참조 깨짐, 폼 라벨, heading 구조, opacity 합성 대비 등.
 *   역할 분담: check.mjs = 토큰 설계 시점 게이트 / axe = 렌더 시점 보완 검출.
 *
 * 사용:
 *   pnpm test:a11y                # storybook 빌드 → 전 스토리 axe 검사
 *   pnpm test:a11y --skip-build   # 기존 storybook-static 재사용 (빠름)
 *
 * 출력:
 *   eval/results/a11y-latest.json   ← pnpm eval 의 T6-axe-dynamic 이 채점
 *   exit 0 = critical/serious 0건 · exit 1 = 있음 · exit 2 = 실행 불가(환경)
 *
 * 환경 전제 (없으면 원인 + 해결 명령을 안내하고 exit 2 — 조용히 통과하지 않음):
 *   - 스토리 파일 존재 (src 하위 *.stories.tsx)
 *   - pnpm install 완료 (@playwright/test, axe-core)
 *   - playwright 브라우저: pnpm exec playwright install chromium
 */

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const STATIC_DIR = path.join(ROOT, "storybook-static");
const OUT_DIR = path.join(ROOT, "eval", "results");
const OUT_FILE = path.join(OUT_DIR, "a11y-latest.json");

const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");

function fail(code, msg) {
  console.error(`\n  ❌ ${msg}\n`);
  process.exit(code);
}

// ── 1. storybook-static 준비 ──
if (!skipBuild) {
  console.log("  📦 storybook 빌드 중... (pnpm build-storybook)");
  const r = spawnSync("pnpm", ["build-storybook", "--quiet"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    fail(2, "storybook 빌드 실패 — pnpm install 완료 여부와 스토리 존재 여부를 확인하세요.");
  }
}
if (!fs.existsSync(path.join(STATIC_DIR, "index.json"))) {
  fail(2, "storybook-static/index.json 없음 — pnpm test:a11y (빌드 포함)로 실행하거나 pnpm build-storybook 먼저.");
}

// ── 2. axe-core 소스 로드 ──
let axeSource;
try {
  axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
} catch {
  fail(2, "axe-core 미설치 — pnpm add -D axe-core 후 재실행.");
}

// ── 3. playwright chromium ──
let chromium;
try {
  ({ chromium } = await import("@playwright/test"));
} catch {
  fail(2, "@playwright/test 미설치 — pnpm install 후 재실행.");
}

// ── 4. 정적 서버 (의존성 0 — node http만 사용) ──
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".woff": "font/woff", ".woff2": "font/woff2",
};
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(STATIC_DIR, urlPath === "/" ? "index.html" : urlPath);
  if (!file.startsWith(STATIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}`;

// ── 5. 스토리 목록 ──
const index = JSON.parse(fs.readFileSync(path.join(STATIC_DIR, "index.json"), "utf8"));
const stories = Object.values(index.entries || {}).filter((e) => e.type === "story");
if (stories.length === 0) {
  server.close();
  fail(2, "스토리 0개 — 검사할 대상이 없습니다. 컴포넌트 스토리를 먼저 만드세요 (/ds-component).");
}

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  server.close();
  fail(2, `chromium 실행 불가 — pnpm exec playwright install chromium 후 재실행.\n     (${String(e.message).split("\n")[0]})`);
}

// ── 6. 스토리별 axe 실행 ──
const page = await browser.newPage();
const results = [];
for (const s of stories) {
  await page.goto(`${base}/iframe.html?id=${s.id}&viewMode=story`, { waitUntil: "networkidle" });
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const res = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
      resultTypes: ["violations"],
    });
    return res.violations.map((v) => ({
      id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
    }));
  });
  results.push({ storyId: s.id, title: s.title, name: s.name, violations });
  const blocking = violations.filter((v) => v.impact === "critical" || v.impact === "serious").length;
  console.log(`  ${blocking ? "❌" : "✅"} ${s.id}${violations.length ? ` — 위반 ${violations.length}건` : ""}`);
}
await browser.close();
server.close();

// ── 7. 집계 + 저장 ──
const totals = { critical: 0, serious: 0, moderate: 0, minor: 0 };
for (const st of results) {
  for (const v of st.violations) {
    if (totals[v.impact] != null) totals[v.impact]++;
  }
}
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify({
  engine: "axe-core",
  timestamp: new Date().toISOString(),
  storiesChecked: results.length,
  totals,
  stories: results,
}, null, 2));

const blocking = totals.critical + totals.serious;
console.log(`\n  스토리 ${results.length}개 검사 — critical ${totals.critical} / serious ${totals.serious} / moderate ${totals.moderate} / minor ${totals.minor}`);
console.log(`  결과 저장: eval/results/a11y-latest.json (pnpm eval 의 T6가 이 파일을 채점)\n`);
process.exit(blocking > 0 ? 1 : 0);