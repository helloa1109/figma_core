---
description: 전체 디자인 시스템 + 접근성 + 와이어프레임 QA 일괄 실행. 빌드 건전성(typecheck) 포함. 인자 있으면 해당 컴포넌트만, 없으면 전부.
argument-hint: [ComponentName]
---

# /qa — 전체 QA

3개의 QA 에이전트를 순차 실행 (qa-design-system이 v0.2부터 typecheck를 선행):
1. `qa-design-system` — **빌드 건전성(typecheck)** + 토큰·컴포넌트 정합성
2. `qa-a11y` — WCAG 2.2 AA 접근성 (+ 동적 axe 결과 연동, v0.3)
3. `qa-wireframe` — 와이어프레임 (`src/wireframes/`가 존재할 때만)

## 사용법

```
/qa            # 전체 검사
/qa Button     # 특정 컴포넌트만
```

## 흐름

```
사용자: /qa

Claude: 전체 QA 시작합니다.

        Step 1/3: 디자인 시스템 QA
        (qa-design-system 위임)
        ✓ typecheck: 에러 0개          ← v0.2
        ✓ 12개 컴포넌트 검사
        ✓ 토큰 준수: 11/12 PASS
        ✗ Dialog: 하드코딩 1개 발견

        Step 2/3: 접근성 QA
        (qa-a11y 위임)
        ✓ 14개 컬러 페어 검증
        ✓ 동적 axe: 스토리 12개 critical 0 (또는 SKIP+사유)
        ✗ danger-500 대비비 4.21:1 (AA 미달)

        Step 3/3: 와이어프레임 QA
        ✓ src/wireframes/ 비어있음 — skip

        통합 리포트: docs/qa-reports/QA-All-2026-06-11-1200.md
```

## 통합 리포트

3개 에이전트의 개별 리포트를 모아 통합 요약 추가 생성:
`docs/qa-reports/QA-All-{YYYY-MM-DD-HHMM}.md`

```markdown
# Combined QA Report — 2026-06-11 12:00

## Overall Grade
- 빌드 건전성: ✅ typecheck 0 errors   ← v0.2 (에러 있으면 종합 상한 NEEDS WORK)
- 디자인 시스템: B (1 FAIL)
- 접근성: C (1 CRITICAL)
- 와이어프레임: N/A
- **종합: NEEDS WORK** (1 CRITICAL 이슈)

## CRITICAL Issues (즉시 해결 필요)
...

## 개별 리포트
- [디자인 시스템](./QA-Design-System-...)
- [접근성](./QA-A11y-...)
```

## 절대 실행하지 말 것

- 자동 수정 (리포트만)
- 한 에이전트 실패해도 다른 에이전트 skip 안 함
- 통합 리포트 생성 누락
- typecheck 생략 또는 타입 에러 있는 채 종합 PASS (v0.2)
