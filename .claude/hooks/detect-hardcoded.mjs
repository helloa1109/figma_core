#!/usr/bin/env node
import { readFileSync } from "node:fs";
import {
  extractContent, extractPath, isWriteEdit, blockDecision,
  hexRe, twColorRe, twFontSizeRe, pxRe, colorFnRe,
} from "./_shared.mjs";

const PATTERNS = [
  { re: hexRe(), msg: "헥스 컬러 직접 사용 금지", hint: "→ var(--color-*) 토큰 사용" },
  { re: twColorRe(), msg: "Tailwind 색상 단축 클래스 금지", hint: "→ bg-[var(--color-*)] 형식 사용" },
  { re: twFontSizeRe(), msg: "Tailwind 폰트 사이즈 단축 클래스 금지", hint: "→ text-[length:var(--font-size-*)] 사용" },
  { re: pxRe(), msg: "px 단위 직접 사용 금지", hint: "→ var(--space-*) 또는 var(--radius-*) 토큰 사용" },
  { re: colorFnRe(), msg: "함수형 색 리터럴(rgb/hsl/oklch 등) 직접 사용 금지", hint: "→ var(--color-*) 토큰 사용" },
];

try {
  const input = JSON.parse(readFileSync(0, "utf-8"));
  const toolName = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const filePath = extractPath(toolInput);

  if (!isWriteEdit(toolName)) process.exit(0);
  // v0.8: src/screens/(디자인 화면)도 동일 가드 — 새 폴더가 무방비 지대가 되는 것 방지
  if (!filePath.includes("src/components/") && !filePath.includes("src/screens/")) process.exit(0);
  if (filePath.includes("src/components/ui/")) process.exit(0);
  if (filePath.includes(".stories.")) process.exit(0);
  if (filePath.includes(".test.")) process.exit(0);

  const content = extractContent(toolInput);
  if (!content) process.exit(0);

  for (const { re, msg, hint } of PATTERNS) {
    re.lastIndex = 0;
    const match = re.exec(content);
    if (match) blockDecision(`🎨 ${msg}\n발견: "${match[0]}"\n${hint}`);
  }
  process.exit(0);
} catch (err) {
  console.error(`[detect-hardcoded] hook error: ${err.message}`);
  process.exit(0);
}