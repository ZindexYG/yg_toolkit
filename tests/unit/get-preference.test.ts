import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => Promise.resolve({ get: cookieGet }),
}));

import { getPreference } from "@/server/server-actions";

const allowed = ["light", "dark", "system"] as const;

describe("getPreference", () => {
  beforeEach(() => {
    cookieGet.mockReset();
  });

  it("returns the fallback when the cookie is missing", async () => {
    cookieGet.mockReturnValue(undefined);
    expect(await getPreference("theme_mode", allowed, "light")).toBe("light");
  });

  it("returns the fallback when the cookie value is not in the allow-list", async () => {
    cookieGet.mockReturnValue({ value: "neon" });
    expect(await getPreference("theme_mode", allowed, "light")).toBe("light");
  });

  it("returns the cookie value when it is in the allow-list (trimmed)", async () => {
    cookieGet.mockReturnValue({ value: "  dark  " });
    expect(await getPreference("theme_mode", allowed, "light")).toBe("dark");
  });

  it("treats an empty string as invalid and falls back", async () => {
    cookieGet.mockReturnValue({ value: "" });
    expect(await getPreference("theme_mode", allowed, "system")).toBe("system");
  });
});
