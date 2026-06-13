# QA-Figma-Wireframe — Login

- 날짜: 2026-06-13
- 대상: Figma frame `24:3` (Login, 393×852)
- 파일: `iYJ1FGBWJGUtkI5IDhl1al`
- 페이지: Wireframes (`24:2`)

## 카운트

- Critical: 0
- High: 2
- Medium: 2
- Low: 2

## 이슈

### [High] H1 — Input 터치 타겟 1px 부족
- 노드: `25:5 Input`, `25:9 Input`
- 현재: 높이 43px (`px-16 py-12` + base 16px line, leading-normal)
- 기준: 모바일 최소 44×44
- 수정안: 높이 48px 고정, 또는 `py` 12→13, 또는 `line-height-tight(120%)` 적용해 자연 48px 도달

### [High] H2 — Secondary Links 탭 영역 협소
- 노드: `25:13` (회원가입 / 찾기)
- 현재: 높이 25px (텍스트 17 + pt-8)
- 기준: 최소 44×44
- 수정안: 각 텍스트를 44px 탭 영역으로 감싸거나 컨테이너에 `py-12`(`space/3`) 추가

### [Medium] M1 — line-height 토큰 미적용
- 모든 텍스트가 `leading-[normal]` (CSS normal ≈ 1.2)
- DESIGN.md에 alias(tight/snug/normal/relaxed) 정의됨에도 Figma에 PERCENT로 미적용
- 수정안: 본문은 `normal(150%)`, 헤드라인은 `tight(125%)` 적용 (한글 가독성)

### [Medium] M2 — 아이콘 placeholder 시각 의도 모호
- 노드: `26:8 Kakao Icon Placeholder`, `26:11 Apple Icon Placeholder`
- 현재: 회색 사각 20×20, 모양/문자 힌트 없음
- 식별성이 텍스트에만 의존
- 수정안: 모양 힌트(원형 K / 사각 ) 또는 레이어명 보강

### [Low] L1 — Pretendard 미설치 폴백
- 모든 텍스트가 `Inter:*`
- DESIGN.md `--font-sans = Pretendard Variable, ...` 의도와 어긋남 (push 시점에 이미 인지)
- 후속: Pretendard Variable 인스톨 후 텍스트 노드 fontName 일괄 교체

### [Low] L2 — Illustration placeholder 라디우스 토큰 미사용
- 노드: `24:5` 128×128 + `rounded-[64px]`
- 원형 의도이므로 `radius-full` alias 바인딩 권고

## 긍정 신호

- 시맨틱 컬러 누설 0건 (회색 5단계만)
- raw hex/픽셀 0건, 모든 값 Variable alias 바인딩
- 393 width 모바일 적합, safe area 충분 (좌우 24 / 상 48 / 하 40)
- 한 화면 한 메시지 원칙 부합 (Hero 1문장 + 보조 1문장)
- 정보 위계 명확 (Hero → Form → CTA → Secondary → Divider → Social)
- 라디우스 컨벤션 부합 (버튼 `full`, 인풋 `md`)
- auto-layout gap 전 구간 `space/*` 토큰

## 권장 후속

- `/design Login` — 와이어 → 본 디자인 단계 진입 (High 이슈는 디자인 단계에서 해소 가능)
- `/screen-spec Login` — 화면설계서(스펙) 작성
