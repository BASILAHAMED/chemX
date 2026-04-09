import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./components/LabScene3D", () => ({
  default: ({ contentsLabel }: { contentsLabel: string }) => <div>{contentsLabel}</div>
}));

describe("App", () => {
  beforeEach(() => {
    window.localStorage.removeItem("chemistry-practice-progress");
  });

  it("completes a mission and stores progress locally", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start practicing/i }));
    await user.click(screen.getAllByRole("button", { name: /open lab/i })[0]);
    await user.click(screen.getByRole("button", { name: /vinegar/i }));
    await screen.findByText(/Add one more reagent to see what happens/i);
    await user.click(screen.getByRole("button", { name: /baking soda/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/Mission completed successfully/i)).toBeInTheDocument();
      },
      { timeout: 3500 }
    );

    expect(window.localStorage.getItem("chemistry-practice-progress")).toContain("mission-fizz");
  });

  it("shows neutral feedback for unsupported mixes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start practicing/i }));
    await user.click(screen.getAllByRole("button", { name: /open lab/i })[1]);
    await user.click(screen.getByRole("button", { name: /red cabbage indicator/i }));
    await screen.findByText(/Add one more reagent to see what happens/i);
    await user.click(screen.getAllByRole("button", { name: /salt water/i })[0]);

    await waitFor(
      () => {
        expect(screen.getByText(/No major visible reaction happened/i)).toBeInTheDocument();
      },
      { timeout: 3500 }
    );
  });
});
