#!/usr/bin/env node
/**
 * PostToolUse 훅: 컴포넌트 스토리 누락 경고 (차단 X, stderr 경고만) — v0.7.1
 *
 * 출처: 피그마피디아 세미나 하네스의 check-story-exists 포팅 (2026-06-11 비교 분석).
 * 왜: 스토리 생성은 ds-component-implementer 절차(5단계)에만 있었고 강제 장치가 없었다.
 *     에이전트가 절차를 건너뛰거나 사람이 손으로 컴포넌트를 추가하면 잡을 수 없는,
 *     "문서엔 있는데 가드가 없는" silent no-op 유형의 마지막 잔여.
 *
 * 검사: src/components/{Name}/{Name}.tsx 저장 시 같은 폴더에 {Name}.stories.tsx 존재 여부.
 *       (ui/·.stories.·.test.·비-tsx 제외 — check-a11y-attrs와 동일 필터)
 * 동작: 없으면 경고만. 정상 작업 순서(tsx 먼저 → 스토리 나중)에서도 한 번 뜨는 게
 *       정상이며, 마무리 전 리마인더 역할이다. 차단하지 않는다.
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { extractPath, isWriteEdit } from "./_shared.mjs";

try {
  const input = JSON.parse(readFileSync(0, "utf-8"));
  const toolName = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const filePath = extractPath(toolInput);

  if (!isWriteEdit(toolName)) process.exit(0);
  if (!filePath.includes("src/components/") && !filePath.includes("src/screens/")) process.exit(0);
  if (filePath.includes("src/components/ui/")) process.exit(0);
  if (!filePath.endsWith(".tsx")) process.exit(0);
  if (filePath.includes(".stories.")) process.exit(0);
  if (filePath.includes(".test.")) process.exit(0);

  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ".tsx");
  const storyPath = path.join(dir, `${base}.stories.tsx`);

  if (!existsSync(storyPath)) {
    console.error(
      `\n📘 [스토리 경고 — 차단하지 않음] ${base}.stories.tsx 가 아직 없습니다.\n` +
      `   컴포넌트 마무리 전에 스토리(Default·Variants·Sizes·States)를 생성하세요.\n` +
      `   (shadcn-wrapper 스킬 / ds-component 절차 5단계 — autodocs 태그 포함)\n`,
    );
  }
  process.exit(0);
} catch (err) {
  console.error(`[check-story-exists] hook error: ${err.message}`);
  process.exit(0);
}