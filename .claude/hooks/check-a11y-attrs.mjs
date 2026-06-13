#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { extractContent, extractPath, isWriteEdit } from "./_shared.mjs";

try {
  const input = JSON.parse(readFileSync(0, "utf-8"));
  const toolName = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const filePath = extractPath(toolInput);

  if (!isWriteEdit(toolName)) process.exit(0);
  if (!filePath.includes("src/components/") && !filePath.includes("src/screens/")) process.exit(0);
  if (filePath.includes("src/components/ui/")) process.exit(0);
  if (filePath.includes(".stories.")) process.exit(0);
  if (filePath.includes(".test.")) process.exit(0);
  if (!filePath.endsWith(".tsx")) process.exit(0);

  const content = extractContent(toolInput);
  if (!content) process.exit(0);

  const warnings = [];

  for (const tag of content.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt\s*=/.test(tag)) warnings.push(`<img> 태그에 alt 속성 누락: "${tag.slice(0, 60)}..."`);
  }

  for (const tag of content.match(/role\s*=\s*["']dialog["'][^>]*>/g) || []) {
    if (!/aria-(labelledby|label)\s*=/.test(tag)) warnings.push(`role="dialog" 에 aria-labelledby/aria-label 누락`);
  }

  for (const _ of content.match(/<div\b[^>]*\bonClick\s*=[^>]*>/g) || []) {
    warnings.push(`<div onClick={...}> 발견 — <button> 사용 권장 (키보드 접근성)`);
  }

  for (const m of content.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g) || []) {
    const attrs = m[1];
    const inner = m[2];
    const hasLabel = /aria-label\s*=|aria-labelledby\s*=|\btitle\s*=/.test(attrs);
    const hasText = /[A-Za-z0-9가-힣]/.test(inner.replace(/<[^>]*>/g, ""));
    if (!hasLabel && !hasText) {
      warnings.push(`<button> 에 텍스트/aria-label/title 누락 (아이콘 전용 버튼?) — 접근 이름 필요`);
    }
  }

  if (warnings.length > 0) {
    console.error(
      `\n♿ [a11y 경고 — 차단하지 않음, 검토 권장]\n${warnings.map((w, i) => `   ${i + 1}. ${w}`).join("\n")}\n`,
    );
  }
  process.exit(0);
} catch (err) {
  console.error(`[check-a11y-attrs] hook error: ${err.message}`);
  process.exit(0);
}