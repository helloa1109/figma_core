import { cn } from "@/lib/cn";

export interface LoginWireframeProps {
  error?: string;
  defaultId?: string;
}

export function LoginWireframe({ error, defaultId = "" }: LoginWireframeProps) {
  return (
    <main
      className={cn(
        "min-h-screen w-full mx-auto max-w-md",
        "bg-[var(--color-neutral-0)] text-[var(--color-neutral-900)]",
        "px-6 pt-14 pb-10 flex flex-col",
      )}
    >
      {/* 상단: 캐릭터 일러스트 placeholder + headline */}
      <header className="flex flex-col items-center text-center mb-10">
        <div
          aria-label="여행 앱 캐릭터 일러스트 placeholder"
          className={cn(
            "w-32 h-32 rounded-full",
            "bg-[var(--color-neutral-100)]",
            "border border-[var(--color-neutral-300)]",
            "flex items-center justify-center mb-6",
          )}
        >
          <span className="text-[length:var(--font-size-xs)] text-[var(--color-neutral-500)]">
            illustration
          </span>
        </div>
        <h1 className="text-[length:var(--font-size-2xl)] font-bold leading-tight">
          다음 여행을 이어서
        </h1>
        <p className="mt-2 text-[length:var(--font-size-sm)] text-[var(--color-neutral-500)]">
          계정으로 로그인하고 기록을 이어가세요
        </p>
      </header>

      {/* 중간: 폼 */}
      <form className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="login-id"
            className="block text-[length:var(--font-size-sm)] font-medium mb-2"
          >
            아이디
          </label>
          <input
            id="login-id"
            type="text"
            defaultValue={defaultId}
            placeholder="아이디 또는 이메일"
            className={cn(
              "w-full px-4 py-3 rounded-[var(--radius-md)]",
              "border border-[var(--color-neutral-300)]",
              "bg-[var(--color-neutral-0)]",
              "text-[length:var(--font-size-base)]",
              "placeholder:text-[var(--color-neutral-300)]",
              "focus:outline-none focus:border-[var(--color-neutral-900)]",
            )}
          />
        </div>

        <div>
          <label
            htmlFor="login-pw"
            className="block text-[length:var(--font-size-sm)] font-medium mb-2"
          >
            비밀번호
          </label>
          <input
            id="login-pw"
            type="password"
            placeholder="비밀번호 입력"
            aria-invalid={error ? true : undefined}
            className={cn(
              "w-full px-4 py-3 rounded-[var(--radius-md)]",
              "border border-[var(--color-neutral-300)]",
              "bg-[var(--color-neutral-0)]",
              "text-[length:var(--font-size-base)]",
              "placeholder:text-[var(--color-neutral-300)]",
              "focus:outline-none focus:border-[var(--color-neutral-900)]",
              error && "border-[var(--color-neutral-900)]",
            )}
          />
          {error ? (
            <p
              role="alert"
              className="mt-2 text-[length:var(--font-size-xs)] text-[var(--color-neutral-900)] font-medium"
            >
              {error}
            </p>
          ) : null}
        </div>

        {/* 로그인 버튼 — 라디우스 full, 회색 강조 */}
        <button
          type="submit"
          className={cn(
            "mt-3 w-full h-12 rounded-[var(--radius-full)]",
            "bg-[var(--color-neutral-900)] text-[var(--color-neutral-0)]",
            "text-[length:var(--font-size-base)] font-semibold",
          )}
        >
          로그인
        </button>

        {/* 보조 액션 — 회원가입/비번찾기 */}
        <div className="flex items-center justify-center gap-4 mt-2 text-[length:var(--font-size-sm)] text-[var(--color-neutral-500)]">
          <button type="button" className="px-1 py-1">
            회원가입
          </button>
          <span aria-hidden className="w-px h-3 bg-[var(--color-neutral-300)]" />
          <button type="button" className="px-1 py-1">
            아이디·비밀번호 찾기
          </button>
        </div>
      </form>

      {/* 또는 divider */}
      <div className="flex items-center gap-3 my-8" aria-hidden>
        <div className="flex-1 h-px bg-[var(--color-neutral-300)]" />
        <span className="text-[length:var(--font-size-xs)] text-[var(--color-neutral-500)]">
          또는
        </span>
        <div className="flex-1 h-px bg-[var(--color-neutral-300)]" />
      </div>

      {/* 하단: 소셜 로그인 */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className={cn(
            "w-full h-12 rounded-[var(--radius-full)]",
            "bg-[var(--color-neutral-0)] text-[var(--color-neutral-900)]",
            "border border-[var(--color-neutral-300)]",
            "text-[length:var(--font-size-base)] font-medium",
            "flex items-center justify-center gap-2",
          )}
        >
          <span
            aria-hidden
            className="w-5 h-5 rounded-[var(--radius-sm)] bg-[var(--color-neutral-100)] border border-[var(--color-neutral-300)]"
          />
          카카오로 로그인
        </button>

        <button
          type="button"
          className={cn(
            "w-full h-12 rounded-[var(--radius-full)]",
            "bg-[var(--color-neutral-0)] text-[var(--color-neutral-900)]",
            "border border-[var(--color-neutral-300)]",
            "text-[length:var(--font-size-base)] font-medium",
            "flex items-center justify-center gap-2",
          )}
        >
          <span
            aria-hidden
            className="w-5 h-5 rounded-[var(--radius-sm)] bg-[var(--color-neutral-100)] border border-[var(--color-neutral-300)]"
          />
          Apple로 로그인
        </button>
      </div>
    </main>
  );
}
