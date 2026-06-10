// scan-rules.mjs — 정적 스캔 규칙 (의존성 0)
import fs from "node:fs";
import path from "node:path";
import { hexRe, pxRe, twColorRe, colorFnRe, disallowedNeutralRe } from "../../.claude/hooks/_shared.mjs";

function walk(dir, exts) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(p);
  }
  return out;
}

export function noHardcoding(root) {
  const files = walk(path.join(root, "src/components"), [".tsx", ".ts", ".jsx", ".css"])
    .filter((f) => !f.includes(`${path.sep}ui${path.sep}`));
  const violations = [];
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const rel = path.relative(root, f);
    for (const [re, label] of [[hexRe(), "raw-hex"], [pxRe(), "px-unit"], [twColorRe(), "tailwind-color-class"], [colorFnRe(), "color-fn-literal"]]) {
      const m = src.match(re);
      if (m) violations.push({ file: rel, type: label, samples: [...new Set(m)].slice(0, 3) });
    }
  }
  return { rule: "no-hardcoding", violations, count: violations.length };
}

export function usesSemanticAlias(root) {
  const files = walk(path.join(root, "src/components"), [".tsx", ".ts", ".css"])
    .filter((f) => !f.includes(`${path.sep}ui${path.sep}`));
  const violations = [];
  const rawScaleRe = /var\(--color-(brand|success|warning|danger|info|accent|primary|secondary|red|blue|green)-(50|100|200|300|400|500|600|700|800|900|950)\)/g;
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const m = src.match(rawScaleRe);
    if (m) violations.push({ file: path.relative(root, f), type: "raw-scale-reference", samples: [...new Set(m)].slice(0, 3) });
  }
  return { rule: "uses-semantic-alias", violations, count: violations.length };
}

export function wireframeGrayscale(root) {
  const files = walk(path.join(root, "src/wireframes"), [".tsx", ".ts", ".css"]);
  const violations = [];
  const colorRe = /var\(--color-(brand|primary|danger|success|warning|info|accent)[a-z0-9-]*\)/g;
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    for (const [re, label] of [[colorRe, "color-in-wireframe"], [colorFnRe(), "color-fn-literal"], [disallowedNeutralRe(), "neutral-step-not-allowed"]]) {
      const m = src.match(re);
      if (m) violations.push({ file: path.relative(root, f), type: label, samples: [...new Set(m)].slice(0, 3) });
    }
  }
  return { rule: "wireframe-grayscale", violations, count: violations.length };
}

export function a11yAttrs(root) {
  const files = walk(path.join(root, "src/components"), [".tsx", ".jsx"])
    .filter((f) => !f.includes(`${path.sep}ui${path.sep}`));
  const violations = [];
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const rel = path.relative(root, f);
    for (const m of src.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)) {
      violations.push({ file: rel, type: "img-without-alt", samples: [m[0].slice(0, 60)] });
    }
  }
  return { rule: "a11y-attrs", violations, count: violations.length };
}

export const SCAN_RULES = { noHardcoding, usesSemanticAlias, wireframeGrayscale, a11yAttrs };