import { describe, expect, it } from "vitest";

import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { createPreferencesStore } from "@/stores/preferences/preferences-store";

describe("preferences-store", () => {
  it("hydrates with PREFERENCE_DEFAULTS when no init is provided", () => {
    const store = createPreferencesStore();
    const state = store.getState();
    expect(state.themeMode).toBe(PREFERENCE_DEFAULTS.theme_mode);
    expect(state.themePreset).toBe(PREFERENCE_DEFAULTS.theme_preset);
    expect(state.contentLayout).toBe(PREFERENCE_DEFAULTS.content_layout);
    expect(state.navbarStyle).toBe(PREFERENCE_DEFAULTS.navbar_style);
    expect(state.sidebarVariant).toBe(PREFERENCE_DEFAULTS.sidebar_variant);
    expect(state.sidebarCollapsible).toBe(PREFERENCE_DEFAULTS.sidebar_collapsible);
    expect(state.isSynced).toBe(false);
  });

  it("uses provided init values over defaults", () => {
    const store = createPreferencesStore({ themeMode: "dark", contentLayout: "full" });
    const state = store.getState();
    expect(state.themeMode).toBe("dark");
    expect(state.contentLayout).toBe("full");
    // unspecified keys still fall back to defaults
    expect(state.themePreset).toBe(PREFERENCE_DEFAULTS.theme_preset);
  });

  it("setters update only the targeted slice", () => {
    const store = createPreferencesStore();
    store.getState().setThemeMode("dark");
    expect(store.getState().themeMode).toBe("dark");
    expect(store.getState().themePreset).toBe(PREFERENCE_DEFAULTS.theme_preset);

    store.getState().setIsSynced(true);
    expect(store.getState().isSynced).toBe(true);
  });
});
