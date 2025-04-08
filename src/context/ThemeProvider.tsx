import { ReactNode, useMemo } from "react";
import { useThemeStore } from "../store/themeStore";
import { Container, createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { BorderColor } from "@mui/icons-material";
const getDesignTokens = (mode: "light" | "dark") => ({
    palette: {
        mode,
        primary: {
            main: mode === "light" ? "#1565C0" : "#00A2FF", // Light: Xanh dương đậm | Dark: Xanh neon
        },
        secondary: {
            main: mode === "light" ? "#1E88E5" : "#1E4D92", // Light: Xanh tươi | Dark: Xanh navy
        },
        background: {
            default: mode === "light" ? "#E3F2FD" : "#0A0E14", // Light: Xanh dương nhạt | Dark: Đen xanh
            paper: mode === "light" ? "#FFFFFF" : "#121826", // Light: Trắng | Dark: Xám đen
        },
        text: {
            primary: mode === "light" ? "#1A237E" : "#E0F2FF", // Light: Xanh đen | Dark: Trắng xanh
            secondary: mode === "light" ? "#546E7A" : "#A0C4E2", // Light: Xám xanh | Dark: Xanh bạc
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: mode === "light" ? "#546E7A" : "#A0C4E2",

                    },

                    "& .MuiInputAdornment-root": {
                        color: mode === "light" ? "#546E7A" : "#A0C4E2", // Màu chữ chung cho tất cả input trong TextField
                    }
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: mode === "light" ? "#546E7A" : "#A0C4E2",

                    },

                    "& .MuiInputAdornment-root": {
                        color: mode === "light" ? "#546E7A" : "#A0C4E2", // Màu chữ chung cho tất cả input trong TextField
                    }
                },
            },
        }
    },
});
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { theme } = useThemeStore(); // Lấy theme từ Zustand

    // ✅ 2. Tạo MUI theme dựa trên Zustand theme
    const muiTheme = useMemo(
        () =>
            createTheme(getDesignTokens(theme)),
        [theme]
    );

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline /> {/* Reset toàn bộ CSS theo theme */}
            {children}
        </MuiThemeProvider>
    );
};