import { useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";

export interface LoginProps {
  error?: string;
  defaultId?: string;
  defaultRemember?: boolean;
  onSubmit?: (payload: { id: string; remember: boolean }) => void;
}

/**
 * Login (Travelnote)
 * A안 — 폼 컨테이너가 보딩패스 카드 자체. 헤드라인 + 사진 없음, 화면 전체가 1장의 스텁.
 * 시그니처: 절취선 + 사물성 라벨(PASSENGER NAME) + 세션 스텁(자동로그인).
 * 액센트: CTA "계속 이어가기" 한 곳에만 — 면이 아닌 헤어라인 보더 + 좌측 얇은 코랄 스트라이프.
 */
export function Login({
  error,
  defaultId = "",
  defaultRemember = false,
  onSubmit,
}: LoginProps) {
  const idInputId = useId();
  const pwInputId = useId();
  const errorId = useId();
  const rememberId = useId();
  const [remember, setRemember] = useState<boolean>(defaultRemember);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const id = (form.elements.namedItem("login-id") as HTMLInputElement)?.value ?? "";
    onSubmit?.({ id, remember });
  };

  return (
    <main
      className={cn(
        "min-h-screen w-full mx-auto max-w-md",
        "bg-[var(--color-bg-muted)] text-[var(--color-text)]",
        "px-5 pt-10 pb-10 flex flex-col",
        "font-[family-name:var(--font-sans)]",
        "[font-feature-settings:'ss01','tnum']",
      )}
    >
      {/* 헤드라인 — 좌측 정렬, 매거진 위계 */}
      <header className="mb-6">
        <h1
          className={cn(
            "text-[length:var(--font-size-2xl)]",
            "font-[var(--font-weight-semibold)]",
            "leading-[var(--line-height-tight)]",
            "tracking-[var(--letter-spacing-tight)]",
          )}
        >
          다음 여행을 이어서
        </h1>
        <p
          className={cn(
            "mt-1 text-[length:var(--font-size-sm)]",
            "text-[var(--color-text-muted)]",
            "leading-[var(--line-height-normal)]",
          )}
        >
          탑승권을 꺼내듯, 계정으로 다시 입장하세요
        </p>
      </header>

      {/* 보딩패스 카드 — 폼 컨테이너 */}
      <section
        aria-label="로그인 탑승권"
        className={cn(
          "relative bg-[var(--color-surface)]",
          "rounded-[var(--radius-lg)]",
          "shadow-[var(--shadow-md)]",
          "overflow-hidden",
        )}
      >
        {/* 카드 상단 메타 — TRAVELNOTE · BOARDING PASS · 항공사 로고 자리 */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "text-[length:var(--font-size-xs)]",
                "font-[var(--font-weight-bold)]",
                "tracking-[0.18em]",
                "text-[var(--color-text)]",
              )}
            >
              TRAVELNOTE
            </span>
            <span
              aria-hidden
              className={cn(
                "text-[length:var(--font-size-xs)]",
                "tracking-[0.18em]",
                "text-[var(--color-text-subtle)]",
              )}
            >
              BOARDING PASS
            </span>
          </div>
          {/* 항공사 로고 자리 — SVG 글리프 (이모지 금지) */}
          <span
            aria-hidden
            className={cn(
              "inline-flex items-center justify-center",
              "w-6 h-6 rounded-[var(--radius-sm)]",
              "text-[var(--color-text-muted)]",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              aria-hidden
            >
              <path
                d="M12 2.5l2.4 6.8 7.1.4-5.6 4.4 1.9 6.9L12 17l-5.8 4 1.9-6.9L2.5 9.7l7.1-.4L12 2.5z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {/* 절취선 — 점선, 좌우 노치 */}
        <div className="relative px-6" aria-hidden>
          {/* 좌측 노치 */}
          <span
            className={cn(
              "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-3 h-3 rounded-[var(--radius-full)]",
              "bg-[var(--color-bg-muted)]",
            )}
          />
          {/* 우측 노치 */}
          <span
            className={cn(
              "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
              "w-3 h-3 rounded-[var(--radius-full)]",
              "bg-[var(--color-bg-muted)]",
            )}
          />
          <div
            className={cn(
              "border-t border-dashed",
              "border-[var(--color-border-decorative)]",
            )}
          />
        </div>

        {/* 카드 본문 — 폼 */}
        <form className="px-6 pt-6 pb-2 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor={idInputId}
              className={cn(
                "block mb-2",
                "text-[length:var(--font-size-xs)]",
                "font-[var(--font-weight-medium)]",
                "tracking-[0.12em]",
                "text-[var(--color-text-muted)]",
              )}
            >
              PASSENGER NAME
            </label>
            <input
              id={idInputId}
              name="login-id"
              type="text"
              defaultValue={defaultId}
              autoComplete="username"
              placeholder="아이디 또는 이메일"
              className={cn(
                "w-full h-12 px-0",
                "bg-transparent",
                "border-0 border-b",
                "border-[var(--color-border-interactive)]",
                "text-[length:var(--font-size-lg)]",
                "font-[var(--font-weight-semibold)]",
                "[font-variant-numeric:tabular-nums]",
                "text-[var(--color-text)]",
                "placeholder:text-[var(--color-text-subtle)]",
                "placeholder:font-[var(--font-weight-normal)]",
                "outline-none",
                "focus:border-[var(--color-text)]",
                "focus-visible:ring-0",
              )}
            />
          </div>

          <div>
            <label
              htmlFor={pwInputId}
              className={cn(
                "block mb-2",
                "text-[length:var(--font-size-xs)]",
                "font-[var(--font-weight-medium)]",
                "tracking-[0.12em]",
                "text-[var(--color-text-muted)]",
              )}
            >
              PASSWORD
            </label>
            <input
              id={pwInputId}
              name="login-pw"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                "w-full h-12 px-0",
                "bg-transparent",
                "border-0 border-b",
                "border-[var(--color-border-interactive)]",
                "text-[length:var(--font-size-lg)]",
                "font-[var(--font-weight-semibold)]",
                "[font-variant-numeric:tabular-nums]",
                "text-[var(--color-text)]",
                "placeholder:text-[var(--color-text-subtle)]",
                "placeholder:font-[var(--font-weight-normal)]",
                "outline-none",
                "focus:border-[var(--color-text)]",
                "focus-visible:ring-0",
                error && "border-[var(--color-danger)]",
              )}
            />
            {error ? (
              <p
                id={errorId}
                role="alert"
                className={cn(
                  "mt-2 text-[length:var(--font-size-xs)]",
                  "font-[var(--font-weight-medium)]",
                  "text-[var(--color-danger)]",
                )}
              >
                {error}
              </p>
            ) : null}
          </div>
        </form>

        {/* 세션 스텁 — 점선 분리 + 자동 로그인 토글 */}
        <div className="relative px-6 mt-2" aria-hidden>
          <span
            className={cn(
              "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-3 h-3 rounded-[var(--radius-full)]",
              "bg-[var(--color-bg-muted)]",
            )}
          />
          <span
            className={cn(
              "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
              "w-3 h-3 rounded-[var(--radius-full)]",
              "bg-[var(--color-bg-muted)]",
            )}
          />
          <div
            className={cn(
              "border-t border-dashed",
              "border-[var(--color-border-decorative)]",
            )}
          />
        </div>

        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span
              className={cn(
                "text-[length:var(--font-size-xs)]",
                "font-[var(--font-weight-medium)]",
                "tracking-[0.12em]",
                "text-[var(--color-text-muted)]",
              )}
            >
              SESSION
            </span>
            <label
              htmlFor={rememberId}
              className={cn(
                "mt-1 text-[length:var(--font-size-sm)]",
                "font-[var(--font-weight-medium)]",
                "text-[var(--color-text)]",
                "cursor-pointer",
              )}
            >
              자동 로그인 유지
            </label>
          </div>

          {/* 토글 — 탭 영역 44 확보 */}
          <button
            id={rememberId}
            type="button"
            role="switch"
            aria-checked={remember}
            aria-label="자동 로그인 유지"
            onClick={() => setRemember((v) => !v)}
            className={cn(
              "relative inline-flex items-center",
              "w-11 h-11 justify-end",
              "outline-none",
              "focus-visible:ring-[length:var(--focus-ring-width)]",
              "focus-visible:ring-[var(--focus-ring-color)]",
              "focus-visible:ring-offset-[length:var(--focus-ring-offset)]",
              "focus-visible:ring-offset-[var(--color-surface)]",
              "rounded-[var(--radius-full)]",
            )}
          >
            <span
              className={cn(
                "relative inline-block w-11 h-6 rounded-[var(--radius-full)]",
                "transition-colors duration-200",
                "motion-reduce:transition-none",
                remember
                  ? "bg-[var(--color-text)]"
                  : "bg-[var(--color-border-decorative)]",
              )}
              aria-hidden
            >
              <span
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-[var(--radius-full)]",
                  "bg-[var(--color-surface)]",
                  "transition-transform duration-200",
                  "motion-reduce:transition-none",
                  remember ? "translate-x-5" : "translate-x-0",
                )}
              />
            </span>
          </button>
        </div>
      </section>

      {/* CTA — 헤어라인 보더 + 좌측 얇은 코랄 스트라이프 (액센트 1곳) */}
      <button
        type="submit"
        onClick={(e) => {
          const form = (e.currentTarget.closest("main")?.querySelector("form")) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        className={cn(
          "relative mt-5 w-full h-12",
          "rounded-[var(--radius-full)]",
          "bg-[var(--color-surface)]",
          "text-[var(--color-text)]",
          "text-[length:var(--font-size-base)]",
          "font-[var(--font-weight-semibold)]",
          "border border-[var(--color-primary)]",
          "overflow-hidden",
          "transition-colors duration-200",
          "motion-reduce:transition-none",
          "hover:bg-[color-mix(in_oklch,var(--color-primary)_6%,transparent)]",
          "active:bg-[color-mix(in_oklch,var(--color-primary)_12%,transparent)]",
          "outline-none",
          "focus-visible:ring-[length:var(--focus-ring-width)]",
          "focus-visible:ring-[var(--focus-ring-color)]",
          "focus-visible:ring-offset-[length:var(--focus-ring-offset)]",
          "focus-visible:ring-offset-[var(--color-bg-muted)]",
        )}
      >
        {/* 좌측 코랄 스트라이프 */}
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            "bg-[var(--color-primary)]",
          )}
        />
        <span className="inline-flex items-center gap-2 pl-2">
          계속 이어가기
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            aria-hidden
          >
            <path
              d="M4 10h12m0 0l-4-4m4 4l-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* 보조 링크 — 탭 영역 44 확보 */}
      <nav
        aria-label="계정 보조 액션"
        className="mt-3 flex items-center justify-center gap-1"
      >
        <button
          type="button"
          className={cn(
            "h-11 px-3 inline-flex items-center justify-center",
            "text-[length:var(--font-size-sm)]",
            "font-[var(--font-weight-medium)]",
            "text-[var(--color-text-muted)]",
            "rounded-[var(--radius-md)]",
            "outline-none",
            "focus-visible:ring-[length:var(--focus-ring-width)]",
            "focus-visible:ring-[var(--focus-ring-color)]",
          )}
        >
          회원가입
        </button>
        <span
          aria-hidden
          className="w-px h-3 bg-[var(--color-border-decorative)]"
        />
        <button
          type="button"
          className={cn(
            "h-11 px-3 inline-flex items-center justify-center",
            "text-[length:var(--font-size-sm)]",
            "font-[var(--font-weight-medium)]",
            "text-[var(--color-text-muted)]",
            "rounded-[var(--radius-md)]",
            "outline-none",
            "focus-visible:ring-[length:var(--focus-ring-width)]",
            "focus-visible:ring-[var(--focus-ring-color)]",
          )}
        >
          아이디·비밀번호 찾기
        </button>
      </nav>

      {/* 또는 divider */}
      <div className="flex items-center gap-3 my-6" aria-hidden>
        <div className="flex-1 h-px bg-[var(--color-border-decorative)]" />
        <span
          className={cn(
            "text-[length:var(--font-size-xs)]",
            "tracking-[0.18em]",
            "text-[var(--color-text-subtle)]",
          )}
        >
          OR
        </span>
        <div className="flex-1 h-px bg-[var(--color-border-decorative)]" />
      </div>

      {/* 소셜 로그인 */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className={cn(
            "w-full h-12 rounded-[var(--radius-full)]",
            "bg-[var(--color-surface)] text-[var(--color-text)]",
            "border border-[var(--color-border-interactive)]",
            "text-[length:var(--font-size-base)]",
            "font-[var(--font-weight-medium)]",
            "inline-flex items-center justify-center gap-2",
            "transition-colors duration-200",
            "motion-reduce:transition-none",
            "hover:bg-[var(--color-surface-hover)]",
            "outline-none",
            "focus-visible:ring-[length:var(--focus-ring-width)]",
            "focus-visible:ring-[var(--focus-ring-color)]",
            "focus-visible:ring-offset-[length:var(--focus-ring-offset)]",
            "focus-visible:ring-offset-[var(--color-bg-muted)]",
          )}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            aria-hidden
          >
            <ellipse cx="10" cy="9" rx="7" ry="5.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7.5 13.2L6 17l4.6-2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          카카오로 로그인
        </button>

        <button
          type="button"
          className={cn(
            "w-full h-12 rounded-[var(--radius-full)]",
            "bg-[var(--color-surface)] text-[var(--color-text)]",
            "border border-[var(--color-border-interactive)]",
            "text-[length:var(--font-size-base)]",
            "font-[var(--font-weight-medium)]",
            "inline-flex items-center justify-center gap-2",
            "transition-colors duration-200",
            "motion-reduce:transition-none",
            "hover:bg-[var(--color-surface-hover)]",
            "outline-none",
            "focus-visible:ring-[length:var(--focus-ring-width)]",
            "focus-visible:ring-[var(--focus-ring-color)]",
            "focus-visible:ring-offset-[length:var(--focus-ring-offset)]",
            "focus-visible:ring-offset-[var(--color-bg-muted)]",
          )}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            aria-hidden
          >
            <path d="M13.6 10.6c0-2.1 1.7-3.1 1.8-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.6 0-1.7-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.6 2.1 2.6 2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.2-2.3 1.2-2.4 0-.1-2.2-.9-2.2-3.3zM11.5 4.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.8-.5 2.5-1.3z" />
          </svg>
          Apple로 로그인
        </button>
      </div>
    </main>
  );
}
