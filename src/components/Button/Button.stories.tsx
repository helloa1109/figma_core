import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { children: "다음 여행" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button intent="primary">Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="ghost">Ghost</Button>
      <Button intent="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Normal</Button>
      <Button className="bg-[var(--color-primary-hover)]">Hover</Button>
      <Button className="bg-[var(--color-primary-active)]">Pressed</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<Plus aria-hidden />}>새 여행</Button>
      <Button intent="secondary" rightIcon={<ArrowRight aria-hidden />}>
        이어서 계획
      </Button>
      <Button
        intent="danger"
        leftIcon={<Trash2 aria-hidden />}
        aria-label="여행 삭제"
      >
        삭제
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <Button fullWidth rightIcon={<ArrowRight aria-hidden />}>
        예약 확정
      </Button>
    </div>
  ),
};

export const Matrix: Story = {
  render: () => {
    const intents = ["primary", "secondary", "ghost", "danger"] as const;
    const sizes = ["sm", "md", "lg"] as const;
    return (
      <div className="grid grid-cols-[auto_repeat(3,1fr)] items-center gap-4">
        <div />
        {sizes.map((s) => (
          <div
            key={s}
            className="text-center text-[length:var(--font-size-xs)] text-[var(--color-text-subtle)]"
          >
            {s}
          </div>
        ))}
        {intents.flatMap((intent) => [
          <div
            key={`label-${intent}`}
            className="text-[length:var(--font-size-xs)] text-[var(--color-text-subtle)]"
          >
            {intent}
          </div>,
          ...sizes.map((size) => (
            <div key={`${intent}-${size}`} className="flex justify-center">
              <Button intent={intent} size={size}>
                Label
              </Button>
            </div>
          )),
        ])}
      </div>
    );
  },
};
