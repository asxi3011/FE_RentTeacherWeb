import { create } from "zustand";

// ✅ 1. Định nghĩa Type cho Theme Store
type ThemeMode = "light" | "dark";

type ThemeState = {
    theme: ThemeMode;
    toggleTheme: () => void;
};

// ✅ 2. Tạo Zustand Store
export const useThemeStore = create<ThemeState>((set) => ({
    theme: "dark", // Mặc định là Light Mode
    toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
