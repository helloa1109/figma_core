#!/usr/bin/env node
/**
 * hook-regression.mjs — 훅을 실제 Claude Code 입력 shape로 먹여보는 회귀 테스트.
 */

import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOOKS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".claude", "hooks");

function runHookCaptureErr(file, payload) {
  const r = spawnSync("node", [path.join(HOOKS, file)], {
    input: JSON.stringify(payload), encoding: "utf8",
  });
  return { exit: r.status ?? 0, out: r.stdout || "", err: r.stderr || "" };
}

const denied = (r) => /"permissionDecision"\s*:\s*"deny"/.test(r.out);
const warned = (r) => /a11y 경고/.test(r.err);
const warnedStory = (r) => /스토리 경고/.test(r.err);

const shapes = (file, content) => [
  { name: "Write(content)", payload: { tool_name: "Write", tool_input: { file_path: file, content } } },
  { name: "Edit(new_string)", payload: { tool_name: "Edit", tool_input: { file_path: file, new_string: content } } },
  { name: "MultiEdit(edits)", payload: { tool_name: "MultiEdit", tool_input: { file_path: file, edits: [{ new_string: content }] } } },
];

const cases = [];

for (const s of shapes("src/components/B/B.tsx", "className=\"bg-[#ff0000]\"")) {
  cases.push({ hook: "detect-hardcoded.mjs", ...s, expect: "deny" });
}
cases.push({
  hook: "detect-hardcoded.mjs", name: "정상(토큰)",
  payload: { tool_name: "Edit", tool_input: { file_path: "src/components/B/B.tsx", new_string: "bg-[var(--color-primary)]" } },
  expect: "pass",
});
for (const s of shapes("src/wireframes/L/L.tsx", "bg-[var(--color-brand-500)]")) {
  cases.push({ hook: "enforce-grayscale.mjs", ...s, expect: "deny" });
}
cases.push({
  hook: "enforce-grayscale.mjs", name: "정상(neutral)",
  payload: { tool_name: "Edit", tool_input: { file_path: "src/wireframes/L/L.tsx", new_string: "bg-[var(--color-neutral-0)]" } },
  expect: "pass",
});
// v0.6.1: 함수형 색 + 회색 단계 우회 케이스 (3중 가드를 뚫던 구멍의 재발 방지)
for (const s of shapes("src/wireframes/L/L.tsx", "style={{background:'rgb(255,0,0)'}}")) {
  cases.push({ hook: "enforce-grayscale.mjs", ...s, expect: "deny" });
}
cases.push({ hook: "enforce-grayscale.mjs", name: "oklch 유채 리터럴",
  payload: { tool_name: "Edit", tool_input: { file_path: "src/wireframes/L/L.tsx", new_string: "oklch(0.5 0.2 260)" } }, expect: "deny" });
cases.push({ hook: "enforce-grayscale.mjs", name: "허용 외 회색(neutral-700)",
  payload: { tool_name: "Edit", tool_input: { file_path: "src/wireframes/L/L.tsx", new_string: "bg-[var(--color-neutral-700)]" } }, expect: "deny" });
cases.push({ hook: "enforce-grayscale.mjs", name: "허용 회색(neutral-300) 통과",
  payload: { tool_name: "Edit", tool_input: { file_path: "src/wireframes/L/L.tsx", new_string: "border-[var(--color-neutral-300)]" } }, expect: "pass" });
// v0.8: src/screens/ 가드 확장 (새 폴더 무방비 지대 방지)
cases.push({ hook: "detect-hardcoded.mjs", name: "screens hex 차단",
  payload: { tool_name: "Write", tool_input: { file_path: "src/screens/Main/Main.tsx", content: "bg-[#ff0000]" } }, expect: "deny" });
cases.push({ hook: "detect-hardcoded.mjs", name: "screens 토큰 통과",
  payload: { tool_name: "Edit", tool_input: { file_path: "src/screens/Main/Main.tsx", new_string: "bg-[var(--color-primary)]" } }, expect: "pass" });
cases.push({ hook: "check-story-exists.mjs", name: "screens 스토리 누락 경고",
  payload: { tool_name: "Write", tool_input: { file_path: "src/screens/Main/Main.tsx", content: "x" } }, expect: "warn-story" });
cases.push({ hook: "enforce-grayscale.mjs", name: "screens는 grayscale 비대상(색 허용)",
  payload: { tool_name: "Write", tool_input: { file_path: "src/screens/Main/Main.tsx", content: "bg-[var(--color-brand-500)]" } }, expect: "pass" });
cases.push({ hook: "detect-hardcoded.mjs", name: "컴포넌트 rgb 리터럴",
  payload: { tool_name: "Edit", tool_input: { file_path: "src/components/B/B.tsx", new_string: "style={{color:'rgb(255,0,0)'}}" } }, expect: "deny" });
cases.push({ hook: "protect-files.mjs", name: "src/tokens/ 차단",
  payload: { tool_name: "Write", tool_input: { file_path: "src/tokens/colors.css" } }, expect: "deny" });
cases.push({ hook: "protect-files.mjs", name: "tokens-backup 오탐없음",
  payload: { tool_name: "Write", tool_input: { file_path: "src/tokens-backup/x.css" } }, expect: "pass" });
cases.push({ hook: "protect-files.mjs", name: "docs/src/tokens 오탐없음",
  payload: { tool_name: "Write", tool_input: { file_path: "docs/src/tokens/x.md" } }, expect: "pass" });
for (const s of shapes("src/components/B/B.tsx", "<img src=\"x.png\" />")) {
  cases.push({ hook: "check-a11y-attrs.mjs", ...s, expect: "warn" });
}

// v0.7.1: check-story-exists (스토리 누락 경고 — 세미나 하네스 포팅)
for (const s of shapes("src/components/NoStory/NoStory.tsx", "export function NoStory(){return null}")) {
  cases.push({ hook: "check-story-exists.mjs", ...s, expect: "warn-story" });
}
const TMP_COMP = "src/components/__HookTest__";
mkdirSync(TMP_COMP, { recursive: true });
writeFileSync(`${TMP_COMP}/__HookTest__.stories.tsx`, "// regression fixture");
cases.push({ hook: "check-story-exists.mjs", name: "스토리 있으면 통과",
  payload: { tool_name: "Write", tool_input: { file_path: `${TMP_COMP}/__HookTest__.tsx`, content: "x" } }, expect: "pass" });
cases.push({ hook: "check-story-exists.mjs", name: "스토리 파일 자체는 검사 제외",
  payload: { tool_name: "Write", tool_input: { file_path: "src/components/NoStory/NoStory.stories.tsx", content: "x" } }, expect: "pass" });
cases.push({ hook: "check-story-exists.mjs", name: "ui/ 제외",
  payload: { tool_name: "Write", tool_input: { file_path: "src/components/ui/button.tsx", content: "x" } }, expect: "pass" });

let pass = 0, fail = 0;
const fails = [];
for (const c of cases) {
  const r = runHookCaptureErr(c.hook, c.payload);
  let ok;
  if (c.expect === "deny") ok = denied(r);
  else if (c.expect === "warn") ok = warned(r);
  else if (c.expect === "warn-story") ok = warnedStory(r);
  else ok = !denied(r) && !warned(r) && !warnedStory(r);
  if (ok) pass++;
  else { fail++; fails.push(`${c.hook} [${c.name}] expect=${c.expect}`); }
}

rmSync(TMP_COMP, { recursive: true, force: true });

const WRITE_TOOLS = ["Write", "Edit", "MultiEdit"];
const WRITE_EDIT_HOOKS = [
  "protect-files.mjs", "detect-hardcoded.mjs", "enforce-grayscale.mjs", "check-a11y-attrs.mjs", "check-story-exists.mjs",
];
try {
  const settings = JSON.parse(readFileSync(path.join(HOOKS, "..", "settings.json"), "utf8"));
  for (const event of ["PreToolUse", "PostToolUse"]) {
    for (const entry of settings.hooks?.[event] || []) {
      const re = new RegExp(entry.matcher || ".*");
      for (const h of entry.hooks || []) {
        const file = (h.command || "").split("/").pop();
        if (!WRITE_EDIT_HOOKS.includes(file)) continue;
        for (const tool of WRITE_TOOLS) {
          if (re.test(tool)) pass++;
          else { fail++; fails.push(`settings ${event} matcher "${entry.matcher}" 가 ${tool}를 안 잡음 → ${file} 무력화`); }
        }
      }
    }
  }
} catch (err) {
  fail++; fails.push(`settings.json 배선 검증 실패: ${err.message}`);
}

console.log(`\n  hook-regression: ${pass} pass, ${fail} fail`);
for (const f of fails) console.log(`   ❌ ${f}`);
console.log("");
process.exit(fail > 0 ? 1 : 0);s