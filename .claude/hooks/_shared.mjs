// _shared.mjs — 훅과 Eval이 공유하는 단일 진실 공급원.
export const TW_COLORS = [
  "red", "blue", "green", "gray", "grey", "slate", "zinc", "neutral", "stone",
  "orange", "amber", "yellow", "lime", "emerald", "teal", "cyan", "sky",
  "indigo", "violet", "purple", "fuchsia", "pink", "rose",
];

export const TW_CHROMATIC = TW_COLORS.filter(
  (c) => !["gray", "grey", "slate", "zinc", "neutral", "stone"].includes(c),
);

const COLOR_UTILS = "(bg|text|border|ring|from|to|via|fill|stroke|outline|divide|placeholder|caret|accent|decoration|shadow)";

export function hexRe() { return /#[0-9a-fA-F]{3,8}\b/g; }
export function twColorRe() {
  return new RegExp(`\\b${COLOR_UTILS}-(${TW_COLORS.join("|")})-\\d{2,3}\\b`, "g");
}
export function twChromaticRe() {
  return new RegExp(`\\b${COLOR_UTILS}-(${TW_CHROMATIC.join("|")})-\\d{2,3}\\b`, "g");
}
export function twFontSizeRe() {
  return /\b(text|leading)-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g;
}
export function pxRe() { return /\b\d+(\.\d+)?px\b/g; }

export function semanticTokenRe() {
  return /--color-(brand|primary|secondary|accent|success|warning|danger|error|info)\b/i;
}

export function extractContent(toolInput = {}) {
  const parts = [];
  if (typeof toolInput.content === "string") parts.push(toolInput.content);
  if (typeof toolInput.new_string === "string") parts.push(toolInput.new_string);
  if (typeof toolInput.new_str === "string") parts.push(toolInput.new_str);
  if (typeof toolInput.file_text === "string") parts.push(toolInput.file_text);
  if (Array.isArray(toolInput.edits)) {
    for (const e of toolInput.edits) {
      if (e && typeof e.new_string === "string") parts.push(e.new_string);
      if (e && typeof e.new_str === "string") parts.push(e.new_str);
    }
  }
  return parts.join("\n");
}

export function extractPath(toolInput = {}) {
  return toolInput.file_path || toolInput.path || "";
}

export function blockDecision(reason) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

export function isWriteEdit(toolName) {
  return ["Write", "Edit", "MultiEdit"].includes(toolName);
}

// ── v0.6.1 추가: 함수형 색 리터럴 + 회색 단계 강제 ──
// 왜: rgb()/hsl()/oklch() 리터럴이 훅·eval·QA grep 3중 가드를 전부 우회했다
// (2026-06-10 검증에서 발견). 회색이라도 리터럴 금지 — 색은 오직 토큰으로.
export function colorFnRe() {
  return /\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/gi;
}

// 와이어프레임 허용 회색 5단계(0/100/300/500/900) 외 neutral 차단.
// 원칙은 wireframe-builder/qa-wireframe 문서에만 있었고 강제 장치가 없었다.
export function disallowedNeutralRe() {
  return /var\(--color-neutral-(?!(?:0|100|300|500|900)\))\d+\)/g;
}