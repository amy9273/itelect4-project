import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Runs cleanup after each test to ensure a clean jsdom state
afterEach(() => {
  cleanup();
});
