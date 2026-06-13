import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-[var(--font-sans)] font-medium",
    "rounded-[var(--radius-full)]",
    "transition-colors",
    "outline-none",
    "focus-visible:ring-[length:var(--focus-ring-width)]",
    "focus-visible:ring-offset-[length:var(--focus-ring-offset)]",
    "focus-visible:ring-[var(--focus-ring-color)]",
    "focus-visible:ring-offset-[var(--color-bg)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      intent: {
        primary: [
          "bg-[var(--color-primary)] text-[var(--color-text-on-brand)]",
          "hover:bg-[var(--color-primary-hover)]",
          "active:bg-[var(--color-primary-active)]",
        ].join(" "),
        secondary: [
          "bg-[var(--color-surface)] text-[var(--color-text)]",
          "border border-[var(--color-border-interactive)]",
          "hover:bg-[var(--color-surface-hover)]",
          "active:bg-[var(--color-bg-muted)]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--color-text)]",
          "hover:bg-[var(--color-surface-hover)]",
          "active:bg-[var(--color-bg-muted)]",
        ].join(" "),
        danger: [
          "bg-[var(--color-danger)] text-[var(--color-text-on-danger)]",
          "hover:bg-[var(--color-danger-hover)]",
          "active:bg-[var(--color-danger-active)]",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-3 text-[length:var(--font-size-sm)] [&_svg]:size-4",
        md: "h-10 px-4 text-[length:var(--font-size-base)] [&_svg]:size-4",
        lg: "h-12 px-6 text-[length:var(--font-size-lg)] [&_svg]:size-5",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { intent: "primary", size: "md", fullWidth: false },
  },
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      intent,
      size,
      fullWidth,
      asChild = false,
      type = "button",
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        data-slot="button"
        data-intent={intent ?? "primary"}
        data-size={size ?? "md"}
        className={cn(
          buttonVariants({ intent, size, fullWidth }),
          className,
        )}
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
