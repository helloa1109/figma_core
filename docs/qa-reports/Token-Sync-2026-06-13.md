# Token Sync Report — 2026-06-13 15:25

> 양방향 동기화: 로컬 `src/tokens/*.css` ↔ Figma Variables (파일키 `iYJ1FGBWJGUtkI5IDhl1al`)
> 직전 워크플로: `/init` → `/figma-tokens push (4컬렉션 114변수)` → `/ds-token`(본 리포트)

## Figma 측 수집 제약 (먼저 읽으세요)

Figma MCP `get_variable_defs`는 **현재 데스크톱에서 선택된 노드가 참조하는 변수**만 반환합니다.
이번 파일은 `/figma-tokens push`로 Variables 컬렉션만 생성되었고 캔버스에 변수를 사용하는 미리보기 frame이 없어, MCP가 변수를 0개로 반환했습니다.

따라서 본 리포트는 **다음 가정**에 기반합니다:
- `/figma-tokens push`가 직전(같은 세션)에 성공했고, 그 시점의 입력 = 현재 `src/tokens/*.css`였다.
- 즉, **Figma 측 114변수 = 로컬 토큰 정의를 그대로 미러링한 상태**.

이 가정이 깨졌다면(중간에 디자이너가 Figma에서 수동 수정 등) 본 리포트는 무효이며, Figma에 각 컬렉션을 사용하는 swatch frame을 1개씩 만들고 그 frame을 선택한 뒤 `/ds-token`을 재실행해야 정확한 diff가 나옵니다.

## Summary

| 분류 | 개수 |
|---|---|
| 일치 (MATCH) | 114 (push된 변수 전체로 추정) |
| Figma에만 (FIGMA_ONLY) | 0 |
| 코드에만 (CODE_ONLY) | 코드 측 raw 토큰 다수 (의도된 차이 — 아래 설명) |
| 값 충돌 (CONFLICT) | 0 |
| 미세 오차 (MINOR_DRIFT) | 0 |
| WCAG 위반 | 0 (Token-Init-2026-06-13.json 검증 결과 16/16 PASS) |

## 인벤토리 비교 (카테고리별)

### Colors
- **로컬 raw scales**: brand 11 + neutral 14 + success 11 + warning 11 + danger 11 + info 11 = **69개**
- **로컬 semantic alias**: primary/danger/success/warning/info 계열 + text/bg/surface/border/focus = **23개**
- **Figma push (추정)**: Colors 컬렉션 — raw scale 위주
- **코드에만 있을 가능성**: semantic alias는 보통 코드 측 CSS 변수 참조(`var(--color-brand-500)`)로 정의되므로 Figma Variables에는 alias로 들어가지 않거나 별도 컬렉션 분리되어 있음. 이는 **의도된 차이**.

### Typography
- 로컬: `--font-sans` + size 8 + weight 6 + line-height 5 + letter-spacing 3 = **23개**
- Figma push: Typography 컬렉션 (동일 수치 가정)

### Spacing
- 로컬: 17개 (`--spacing-0` ~ `--spacing-32`, `px`, `0_5`, `1_5` 포함)
- Figma push: Spacing 컬렉션 (동일)

### Radius
- 로컬: 6개 (`none/sm/md/lg/xl/full`)
- Figma push: Radius 컬렉션 (동일)

### Motion / Semantic (shadow, z-index)
- 로컬에만 존재. Figma Variables는 motion/shadow를 표준 변수 타입으로 지원하지 않으므로 **의도적으로 push 제외**됨.
- 이는 CODE_ONLY로 분류되지만 **수동 처리 불필요** (Figma 비대응 영역).

## Resolved Conflicts

없음. 사용자에게 확인 요청한 충돌도 없습니다.

## Manual Action Required

없음. 모든 raw 토큰이 코드→Figma 단방향 push로 채워졌다는 가정 하에서.

## WCAG Audit

직전 `/init` 단계에서 생성된 `docs/qa-reports/Token-Init-2026-06-13.json`을 그대로 채택합니다:

| 페어 | 대비 | 상태 |
|---|---|---|
| neutral-0 on primary(brand-500) | 4.74:1 | AA pass |
| neutral-0 on primary-hover(brand-600) | 6.64:1 | AA pass |
| neutral-0 on primary-active(brand-700) | 9.24:1 | AAA pass |
| neutral-0 on danger | 4.76:1 | AA pass |
| neutral-900 on success | 4.67:1 | AA pass |
| neutral-900 on warning(Z=400) | 5.87:1 | AA pass |
| neutral-0 on info(600) | 6.18:1 | AA pass |
| text(neutral-900) on bg | 18.1:1 | AAA pass |
| text-muted on bg | 7.77:1 | AAA pass |
| text-subtle on bg | 4.85:1 | AA pass |
| border-interactive on surface | 3.64:1 | UI 3:1 pass |
| border-strong on surface | 4.85:1 | UI pass |
| focus-ring on bg | 4.74:1 | UI pass |

16/16 PASS. 토큰 동기화 후에도 컬러 값 변경이 없으므로 재계산 불필요.

## 다음 동기화에서 정확도를 높이려면

1. Figma 파일에 각 컬렉션 변수를 채운 swatch frame을 만들고 (예: brand 50~950 사각형 11개) 거기서 `/ds-token` 실행.
2. 또는 `PROJECT.md`에 `Figma 파일 키`를 채우고 디자이너가 직접 변경한 변수가 있을 때마다 swatch frame을 갱신.
3. 정책 명시 권장: `PROJECT.md`에 `토큰 동기화 정책: Code is source of truth` 한 줄 추가.
