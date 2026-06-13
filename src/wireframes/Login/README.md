# Login Wireframe

## 의도
Travelnote 첫 진입 — 사용자가 ID/비밀번호 또는 카카오·Apple 소셜 로그인으로 진입.
"다음 여행을 이어서"라는 톤 한 줄로 재방문 시 기록 연속성을 환기.

## 명세 (입력)
- 상단: 여행 앱 캐릭터 일러스트 placeholder + "다음 여행을 이어서" 헤드라인 + 서브카피
- 중간: 아이디 입력창 + 비밀번호 입력창
- 로그인 버튼 (full width, 라디우스 999)
- 보조: 회원가입 / 아이디·비번 찾기 링크
- 구분: "또는" divider
- 하단: 카카오 로그인 + Apple 로그인 (회색 와이어)

## 화면 구성 요약
| 영역 | 요소 | 토큰 |
|---|---|---|
| Hero | 원형 일러스트 placeholder (128px) | bg-neutral-100, border-neutral-300 |
| Headline | "다음 여행을 이어서" | font-size-2xl, font-bold |
| Sub | 보조 카피 | font-size-sm, neutral-500 |
| Input × 2 | ID / PW | border-neutral-300, focus border-neutral-900, radius-md |
| 로그인 CTA | full width 버튼 | bg-neutral-900 / text-neutral-0, radius-full |
| 보조 액션 | 회원가입 · 찾기 | neutral-500, 가운데 정렬 |
| Divider | "또는" | h-px bg-neutral-300 |
| Social × 2 | 카카오 · Apple | outline (border-neutral-300), 아이콘 placeholder |

## 사용된 디자인 시스템 요소
- typography: `--font-size-2xl` (headline), `--font-size-base` (input/cta), `--font-size-sm` (sub/label), `--font-size-xs` (error/divider)
- radius: `--radius-full` (버튼) / `--radius-md` (input) / `--radius-sm` (소셜 아이콘 placeholder)
- 회색 5단계: `--color-neutral-0/100/300/500/900`
- 컴포넌트: **인라인 회색 처리** (Button 컴포넌트의 primary intent는 색 강조이므로 와이어 단계 미사용)

## 상태 / Stories
- `Default` — 아이디 미리 채움
- `Empty` — 빈 상태
- `WithError` — 비밀번호 오류 alert

## 다음 단계 (디자인 단계로 넘어갈 때 고려)
- 로그인 CTA → `<Button intent="primary" size="lg" fullWidth>` 으로 교체 (코랄 강조)
- 카카오 버튼 → 브랜드 컬러 적용 여부 결정 (앱 정책 확인 — 보통 카카오 가이드 준수)
- Apple 버튼 → Apple HIG의 검정/흰색 규정 적용
- 캐릭터 일러스트 → 실제 에셋 교체 (필름 톤 grayscale 0.35 + contrast 1.1 통일)
- 에러 상태 → 시맨틱 danger 토큰 적용, aria-invalid 유지
- 입력 필드 → TextField 컴포넌트가 만들어지면 교체
