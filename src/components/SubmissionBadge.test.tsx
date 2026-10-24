import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SubmissionBadge from "./SubmissionBadge";

describe("SubmissionBadge", () => {
  it("renders the given status text with default info variant", () => {
    render(<SubmissionBadge status="Scheduled" />);

    const badge = screen.getByText("Scheduled");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-blue-100");
  });

  it("renders a completed status with the success variant styling", () => {
    render(<SubmissionBadge status="Completed" variant="success" />);

    const badge = screen.getByText("Completed");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100");
  });

  it("renders an error variant for cancelled status", () => {
    render(<SubmissionBadge status="Cancelled" variant="error" />);

    const badge = screen.getByText("Cancelled");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-100");
  });
});
