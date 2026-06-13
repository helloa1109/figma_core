---
description: 와이어프레임에 방향 있는 디자인을 입혀 src/screens/ 생성 (ds-screen-designer 위임). PROJECT.md 디자인 방향 + design-polish 스킬 적용, 게이트형 진행.
argument-hint: <ScreenName> [방향 힌트]
---

# /design — 디자인 고도화

## 위치
```
/wireframe <화면>     회색 정보구조
/screen-spec <화면>   인터랙션 명세
/design <화면>        ← 디자인 입히기 (이 커맨드)
```

## 사용법
```
/design Main
/design Booking "예약 화면, 보딩패스 언어 유지"
```

## 위임
`ds-screen-designer` 에이전트. 흐름:
1. design-polish 스킬 + PROJECT.md 디자인 방향 로드
2. 템플릿 답안 기각문 → 방향 2~3안 제시 → **사용자 선택 대기**
3. 구현 (토큰만, 스토리 포함) → 자기비평 게이트(대비 전수·typecheck)
4. 보고 + 다음 단계 (/qa, pnpm test:a11y)

## 전제
- `/init` 완료 (토큰 존재) + 대상 와이어프레임 존재
- PROJECT.md `## 디자인 방향` 권장 (없으면 스킬 기본 방어만 — 결과 차이 큼)

## 절대 실행하지 말 것
- 방향 선택 게이트 생략 / 와이어 원본 수정 / 스토리 누락
