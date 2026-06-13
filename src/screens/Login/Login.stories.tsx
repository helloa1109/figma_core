import type { Meta, StoryObj } from "@storybook/react-vite";
import { Login } from "./Login";

const meta = {
  title: "Screens/Login",
  component: Login,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "iphone14" },
  },
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultId: "traveler@example.com" },
};

export const WithError: Story = {
  args: {
    defaultId: "traveler@example.com",
    error: "아이디 또는 비밀번호를 확인해주세요",
  },
};

export const RememberOn: Story = {
  args: {
    defaultId: "traveler@example.com",
    defaultRemember: true,
  },
};
