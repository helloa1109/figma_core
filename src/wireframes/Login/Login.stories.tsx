import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginWireframe } from "./Login";

const meta = {
  title: "Wireframes/Login",
  component: LoginWireframe,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "iphone14" },
  },
} satisfies Meta<typeof LoginWireframe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultId: "traveler@example.com" },
};

export const Empty: Story = {
  args: {},
};

export const WithError: Story = {
  args: {
    defaultId: "traveler@example.com",
    error: "아이디 또는 비밀번호를 확인해주세요",
  },
};
