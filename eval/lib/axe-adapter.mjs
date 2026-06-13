// axe-adapter.mjs — 동적 a11y(axe) 결과를 Eval에 위임 (T6, v0.7)
//
// contrast-adapter와 같은 철학: Eval은 검사를 재구현하지 않는다.
// 검사는 axe-runner(pnpm test:a11y)가 하고, Eval은 그 JSON 결과만 채점한다.
//
// 채점 기준:
//   - critical / serious  → 위반 (T6 FAIL)
//   - moderate / minor    → 리포트만 (차단 안 함 — axe 권고 수준)
//   - 결과 파일 없음/오래됨/파싱 실패 → SKIP (조용히 PASS 처리하지 않음)

import fs from "node:fs";
import path from "node:path";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7일 — 오래된 결과는 신뢰하지 않음

export function axeDynamic(root) {
  const file = path.join(root, "eval", "results", "a11y-latest.json");

  if (!fs.existsSync(file)) {
    return {
      rule: "axe-dynamic", violations: [], count: 0, checked: 0,
      skipped: "동적 a11y 결과 없음 — pnpm test:a11y 먼저 실행 (Storybook + axe)",
    };
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {
      rule: "axe-dynamic", violations: [], count: 0, checked: 0,
      skipped: "a11y-latest.json 파싱 실패 — pnpm test:a11y 재실행",
    };
  }

  const age = Date.now() - Date.parse(data.timestamp || "");
  if (!Number.isFinite(age) || age > MAX_AGE_MS) {
    return {
      rule: "axe-dynamic", violations: [], count: 0, checked: 0,
      skipped: "a11y 결과가 7일 초과(또는 timestamp 없음) — pnpm test:a11y 재실행",
    };
  }

  const violations = [];
  for (const st of data.stories || []) {
    for (const v of st.violations || []) {
      if (v.impact === "critical" || v.impact === "serious") {
        violations.push({
          file: st.storyId,
          type: `axe:${v.id} (${v.impact})`,
          samples: [v.help],
        });
      }
    }
  }

  return {
    rule: "axe-dynamic",
    violations,
    count: violations.length,
    checked: data.storiesChecked || 0,
  };
}