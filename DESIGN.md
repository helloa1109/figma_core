# DESIGN.md

> 이 파일은 **에이전트가 자동 갱신**합니다. 직접 편집하지 마세요.
> 컴포넌트 추가 / 토큰 추가 / Figma node ID 변경 시 자동 업데이트.
>
> 마지막 자동 갱신: 2026-06-13 (ds-token-builder v0.3, `/init`)

---

## 0. 프로젝트 메타

- **이름**: Travelnote
- **설명**: 다음 여행을 이어서 계획하고 기록하는 개인 여행 앱
- **플랫폼**: Mobile · **언어**: ko · **사용자**: B2C
- **브랜드 컬러**: `#FF5A5F` (코랄)
- **폰트**: Pretendard
- **다크모드**: 없음 (light only)
- **디자인 방향 키워드**: 여행 잡지 에디토리얼 · 보딩패스 사물성 · 필름 사진 톤

## 1. Figma 파일 (PROJECT.md에서 복사됨)

코드 트랙 전용 — Figma 파일 키 미설정.

## 2. 디자인 토큰 카탈로그

### 2.1 Color — Raw scales (OKLCH)

| Scale | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| brand (#FF5A5F, h=22.4) | 0.970 | 0.930 | 0.850 | 0.760 | 0.670 | 0.580 | 0.500 | 0.420 | 0.330 | 0.250 | 0.150 |
| neutral (chroma 0) | 0.985 | 0.960 | 0.920 | 0.860 | 0.700 | 0.550 | 0.440 | 0.370 | 0.270 | 0.200 | 0.130 |
| success (#10b981, h=162.5) | 0.970 | 0.930 | 0.850 | 0.760 | 0.670 | 0.580 | 0.500 | 0.420 | 0.330 | 0.250 | 0.150 |
| warning (#f59e0b, h=70.1) | 0.970 | 0.930 | 0.850 | 0.760 | 0.670 | 0.580 | 0.500 | 0.420 | 0.330 | 0.250 | 0.150 |
| danger (#ef4444, h=25.3) | 0.970 | 0.930 | 0.850 | 0.760 | 0.670 | 0.580 | 0.500 | 0.420 | 0.330 | 0.250 | 0.150 |
| info (#3b82f6, h=259.8) | 0.970 | 0.930 | 0.850 | 0.760 | 0.670 | 0.580 | 0.500 | 0.420 | 0.330 | 0.250 | 0.150 |

neutral 추가: `--color-neutral-0` (white), `--color-neutral-1000` (black).

### 2.2 Color — Semantic alias (WCAG 2.2 AA 자동 선택)

| Alias | 값 | 텍스트 페어 | 대비비 | 비고 |
|---|---|---|---|---|
| `--color-primary` | `brand-500` | `neutral-0` (흰) | 4.59:1 | 흰 텍스트 패턴 X=500 |
| `--color-primary-hover` | `brand-600` | — | — | hover/active 어둡게 |
| `--color-danger` | `danger-500` | `neutral-0` | 4.69:1 | 흰 텍스트 패턴 X=500 |
| `--color-success` | `success-500` | `neutral-900` (검정) | 5.42:1 | 검정 텍스트 패턴 Z=500 |
| `--color-warning` | `warning-400` | `neutral-900` | 7.36:1 | **Z=400 자동 선택 (500은 4.11:1 미달)** |
| `--color-info` | `info-600` | `neutral-0` | 5.18:1 | 흰 텍스트 패턴 X=600 |
| `--color-text` | `neutral-900` | bg | 16.7:1 | 본문 |
| `--color-text-muted` | `neutral-600` | bg | 6.95:1 | 보조 |
| `--color-text-subtle` | `neutral-500` | bg | 4.85:1 | 회색 처리 |
| `--color-border-decorative` | `neutral-200` | — | — | 카드 분리선 |
| `--color-border-interactive` | oklch(0.620 0 0) | — | 3.04:1 | input/button, 3:1 강제 |
| `--color-border-strong` | `neutral-500` | — | 4.85:1 | 강조 테두리 |
| `--focus-ring-color` | `brand-500` | — | — | 포커스 링 |

**Anti-slop 적용**: 액센트색(brand)은 화면당 1곳 — `--color-primary`는 핵심 CTA·D-day 숫자 등 단일 지점에만.

### 2.3 Typography

- `--font-sans`: Pretendard Variable, Pretendard, system-ui, …
- size: xs(12) · sm(14) · base(16) · lg(18) · xl(20) · 2xl(24) · 3xl(30) · 4xl(36)
- weight: thin(200) · light(300) · normal(400) · medium(500) · semibold(600) · bold(700)
- line-height: none(1) · tight(1.25) · snug(1.375) · normal(1.5) · relaxed(1.625)
- letter-spacing: tight(-0.02em) · normal(0) · wide(0.04em)

### 2.4 Spacing — 4px 그리드

0 · px · 0.5(2) · 1(4) · 1.5(6) · 2(8) · 3(12) · 4(16) · 5(20) · 6(24) · 8(32) · 10(40) · 12(48) · 16(64) · 20(80) · 24(96) · 32(128) — 총 17단계.

### 2.5 Radius — PROJECT.md 규칙 반영

- `--radius-none: 0`
- `--radius-sm: 4px`
- `--radius-md: 8px`
- `--radius-lg: 20px` — **카드 표준 (보딩패스 카드 포함)**
- `--radius-xl: 28px` — 모달/바텀시트 상단
- `--radius-full: 999px` — **버튼 표준**

### 2.6 Motion — 모션 다이얼 3 (절제)

- duration: fast(120ms) · base(200ms) · slow(320ms)
- easing: linear · in · out · in-out

### 2.7 Semantic — Shadow & z-index

Shadow는 **brand hue(22.4)로 틴트된 부드러운 그림자만** (진한 무채색 그림자 금지):
- `--shadow-xs/sm/md/lg/xl` — 알파 0.04~0.12

z-index: base(0) · raised(10) · dropdown(100) · sticky(200) · overlay(300) · modal(400) · toast(500) · tooltip(600)

## 3. 컴포넌트 카탈로그

### Button
- 경로: `src/components/Button/`
- shadcn 베이스: `button` (원본 `src/components/ui/button.tsx` — 손대지 않음)
- intents: `primary` · `secondary` · `ghost` · `danger`
- sizes: `sm` · `md` · `lg`
- 옵션: `fullWidth` (boolean), `leftIcon` / `rightIcon` (ReactNode), `asChild` (Slot)
- 라디우스: `--radius-full` (999px) — PROJECT.md 버튼 표준
- 폰트: `--font-sans` (Pretendard)
- 토큰 의존:
  - `--color-primary` / `--color-primary-hover` / `--color-primary-active` / `--color-text-on-brand`
  - `--color-surface` / `--color-surface-hover` / `--color-bg-muted` / `--color-text`
  - `--color-border-interactive`
  - `--color-danger` / `--color-danger-hover` / `--color-danger-active` / `--color-text-on-danger`
  - `--focus-ring-color` / `--focus-ring-width` / `--focus-ring-offset`
  - `--font-size-sm` / `--font-size-base` / `--font-size-lg`
- 스토리: `Default` · `Variants` · `Sizes` · `States` · `WithIcons` · `FullWidth` · `Matrix`
- 검증: typecheck PASS · `pnpm eval` 100/100 · CRITICAL 0건
- 생성일: 2026-06-13

## 3.W 와이어프레임 카탈로그

### Login (src/wireframes/Login/)
- 의도: Travelnote 첫 진입. ID/PW + 카카오·Apple 소셜 로그인
- 구성: 상단 캐릭터 placeholder + 헤드라인 / ID·PW 입력 / 로그인 CTA / 보조(회원가입·찾기) / "또는" divider / 카카오·Apple 와이어 버튼
- 사용 컴포넌트: 없음 (인라인 회색 처리 — Button 컴포넌트는 색 강조라 와이어 단계 미사용)
- 토큰: neutral-0/100/300/500/900 · radius-md/full/sm · font-size-xs/sm/base/2xl
- Stories: Default · Empty · WithError
- 생성일: 2026-06-13

## 4. 컨벤션

- 토큰 참조: `var(--color-primary)` 등 semantic alias만 사용. raw 스케일 직접 참조 금지.
- 노출 컴포넌트는 `src/components/{Name}/` (`src/components/ui/`는 shadcn 원본, 손대지 않음).
- 색 공간은 OKLCH 고정. HSL/RGB/HEX 직접 사용 금지.

## 5. 미해결 후속 작업

- [x] `/ds-component Button` — 첫 컴포넌트 (2026-06-13)
- [ ] `/qa Button` 또는 `/qa-a11y Button` — Button 검증
- [ ] (선택) Figma 파일 키 채워 `/figma-tokens 전체`로 동기

---

## 검증 리포트

- `docs/qa-reports/Token-Init-2026-06-13.json` — WCAG 2.2 AA 검증: **16 PASS / 0 FAIL** (라이트 only)

## 변경 이력

- 2026-06-13 — `/wireframe Login` (wireframe-builder): `src/wireframes/Login/` 3개 파일 생성. 회색 5단계만 사용, 캐릭터 일러스트 placeholder + ID/PW + 로그인 + 카카오/Apple 소셜 와이어. Stories 3종(Default/Empty/WithError).
- 2026-06-13 — `/ds-component Button` (shadcn-wrapper): `src/components/Button/` 3개 파일 생성. cva 기반 intent(primary/secondary/ghost/danger) × size(sm/md/lg) × fullWidth, leftIcon/rightIcon 슬롯. typecheck/eval 통과.
- 2026-06-13 — `/init` 부트스트랩 (ds-token-builder v0.3): 색 6종(브랜드+neutral+시맨틱4) raw 스케일 + alias + typography/spacing/radius/motion/semantic 생성
