# Login (src/screens/Login)

> Travelnote 첫 진입 — A안: 폼 컨테이너가 보딩패스 카드 자체.

## 1. 디자인 의도

이 화면 유형의 통계적 평균 답안은 "가운데 일러스트 + 헤드라인 + 회색 박스 입력 + 면 채움 CTA + 소셜 버튼 2개". 평균 답안은 기각.

대신 PROJECT.md 시그니처(보딩패스 사물성)를 첫 화면부터 번역: 와이어의 원형 일러스트를 삭제하고, **카드 = 탑승권**으로 재구성. 입력은 박스가 아니라 **탑승권 위에 직접 적는 라벨/언더라인**. CTA의 코랄 액센트는 면이 아니라 **헤어라인 보더 + 좌측 얇은 스트라이프**(점으로서의 색).

## 2. A안 사양 매핑

| 사양 | 구현 위치 |
|---|---|
| 상단 절취선 위 "TRAVELNOTE / BOARDING PASS" + 항공사 로고 글리프 | 카드 상단 메타 영역 (별 SVG 글리프) |
| 절취선 (점선 + 좌우 노치) | `border-dashed` + 카드 가장자리 원형 노치 2개 |
| PASSENGER NAME / PASSWORD 라벨 (uppercase, tracking 0.12em) | 입력 라벨 |
| 입력값 18pt SemiBold + tabular-nums | `text-[length:var(--font-size-lg)]` + `font-variant-numeric: tabular-nums` |
| 우측 D-day 대신 세션 스텁 (자동로그인 토글 + 점선 분리) | 카드 하단, 두 번째 절취선 아래 SESSION 스텁 |
| CTA 액센트 = 헤어라인 보더 + 좌측 얇은 코랄 스트라이프 | `border var(--color-primary)` + 좌측 `w-1` 절대 위치 |
| 헤드라인 "다음 여행을 이어서" SemiBold | `font-weight-semibold` + tracking-tight |
| 사진 없음, 배경 neutral-50, 카드 neutral-0 + 틴트 그림자 | `bg-bg-muted` + `bg-surface` + `shadow-md` (brand hue 틴트) |

## 3. 시그니처 번역 (시리즈 일관성)

| 사물 디테일 | 이 화면에서의 번역 |
|---|---|
| 보딩패스 절취선 | 카드 상하단 점선 2줄 — 위는 정보(헤더 ↔ 폼), 아래는 결정(폼 ↔ 세션 스텁) |
| 구간 표기 (ICN→KIX) | 다음 화면(예약·메인)에서 등장 예정. 로그인은 "탑승 전" 상태이므로 미사용 |
| 스텁(stub) | 우측 D-day 대신 SESSION/자동로그인. 본권에서 분리 가능한 "상태 조각"이라는 동일 의미 |
| PASSENGER NAME 라벨 | 보딩패스의 실제 인쇄 라벨 차용. 평범한 "아이디" 대신 사물성 강화 |

## 4. 토큰 매핑

| 역할 | 토큰 |
|---|---|
| 페이지 배경 | `--color-bg-muted` (neutral-50) |
| 카드 배경 | `--color-surface` (neutral-0) |
| 본문/입력값 | `--color-text` (neutral-900) |
| 라벨 (PASSENGER NAME 등) | `--color-text-muted` (neutral-600, 7.77:1) |
| 점선·분리선 | `--color-border-decorative` (neutral-200) |
| 입력 밑줄 | `--color-border-interactive` (3.04:1 보장) |
| CTA 액센트(보더·스트라이프) | `--color-primary` (brand-500, UI 4.74:1) |
| 에러 텍스트 | `--color-danger` |
| 카드 그림자 | `--shadow-md` (brand hue 22.4 틴트) |
| 헤드라인 | `--font-size-2xl` + `--font-weight-semibold` + `--letter-spacing-tight` |
| 라벨 | `--font-size-xs` + tracking 0.12em |
| 입력값 | `--font-size-lg` + `--font-weight-semibold` + `tabular-nums` |
| 라디우스 | 카드 `--radius-lg` / 버튼 `--radius-full` |

## 5. 대비 검증 (a11y-contrast-checker)

| 페어 | 비율 | 결과 |
|---|---|---|
| primary 보더 on surface(neutral-0) | 4.74:1 | UI PASS |
| primary 보더 on bg-muted(neutral-50) | 4.54:1 | UI PASS |
| text-muted(neutral-600) on neutral-0 (PASSENGER NAME) | 7.77:1 | AAA |
| text-subtle(neutral-500) on neutral-0 (placeholder) | 4.85:1 | AA |
| text(neutral-900) on neutral-50 (헤드라인) | 17.34:1 | AAA |
| text(neutral-900) on neutral-0 (CTA 텍스트) | 18.1:1 | AAA |

## 6. 관습 파괴 1개

**"로그인 폼이 곧 보딩패스다."** 일반 로그인은 폼이 "화면 위에 놓인 부속"이지만, 이 화면은 폼 자체가 1장의 탑승권. 입력은 박스가 아니라 카드 위에 직접 적는 펜선(언더라인). 근거: PROJECT.md 시그니처 "보딩패스의 사물성"을 첫 진입부터 못 박아야 시리즈 다음 화면(메인·예약)이 같은 언어로 이어진다.

## 7. prefers-reduced-motion

토글·CTA·소셜 버튼 transition에 `motion-reduce:transition-none` 분기 적용.

## 8. Stories

- `Default` — 기본 상태
- `WithError` — 비밀번호 에러
- `RememberOn` — 자동 로그인 토글 ON

## 9. 와이어 → 디자인 차이 요약

| 와이어 | 디자인 |
|---|---|
| 가운데 원형 일러스트 placeholder | 삭제 → 카드 상단 메타 + 항공사 글리프 |
| 박스 입력 (border + radius-md) | 카드 위 언더라인 입력 |
| 회색 면 채움 CTA (neutral-900) | 흰 면 + primary 헤어라인 보더 + 좌측 스트라이프 |
| 보조 액션 텍스트 버튼 (탭 36) | 탭 영역 44 확보 (`h-11`) |
| 자동 로그인 없음 | 카드 내부 SESSION 스텁으로 편입 |
