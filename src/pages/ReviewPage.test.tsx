import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReviewPage from "./ReviewPage";

function renderReviewPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ReviewPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ReviewPage", () => {
  it("shows the schema error message when submitted empty", async () => {
    const user = userEvent.setup();
    renderReviewPage();

    await user.click(
      screen.getByRole("button", { name: "Review my description" }),
    );

    expect(
      await screen.findByText(
        "Describe your project or pet consultation in at least 20 characters.",
      ),
    ).toBeInTheDocument();
  });

  it("sends nothing to the API while the prompt is invalid", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    renderReviewPage();

    await user.type(screen.getByLabelText("Description"), "Too short");
    await user.click(
      screen.getByRole("button", { name: "Review my description" }),
    );

    expect(
      await screen.findByText(
        "Describe your project or pet consultation in at least 20 characters.",
      ),
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
