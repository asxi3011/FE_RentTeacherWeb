import { create } from "zustand";

import { callApi } from "../utils/callApi";
import { LoginRequest } from "../pages/Login";
import { APIResponse, CallAPI, LoginResponse, RefreshAccessTokenResponse } from "../types";
import { callApiWithAuth } from "../utils/callApiWithAuth";

// Định nghĩa kiểu dữ liệu cho AuthStore
interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (loginRequest: LoginRequest) => Promise<T>;
    refreshAccessToken: () => Promise<string | null>;
    logout: () => void;
}



// Tạo Zustand Store
export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: localStorage.getItem("accessToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),

    // Đăng nhập
    login: async (loginRequest: LoginRequest) => {
        try {
            const response: CallAPI<APIResponse<LoginResponse>> = await callApi(
                "POST",
                "/auth/login",
                loginRequest
            )
            console.log("🚀 ~ login: ~ response:", response)
            if (response.data?.code == 1000 && response.data.data && response.error == null) {
                localStorage.setItem("accessToken", response.data.data.accessToken); // Lưu vào localStorage
                set({ accessToken: response.data.data.accessToken, isAuthenticated: response.data.data.authenticated });
            }
            return { data: response.data, error: response.error };
        } catch (error) {
            return error;
        }
    },

    // Làm mới token
    refreshAccessToken: async () => {
        try {
            const response: CallAPI<APIResponse<RefreshAccessTokenResponse>> = await callApi(
                "POST",
                `/auth/refreshAccessToken`,
                { accessToken: get().accessToken },
                { withCredentials: true }
            );
            if (response.data?.code == 1000 && response.data.data && response.error) {
                localStorage.setItem("accessToken", response.data.data.accessToken);
                set({ accessToken: response.data.data.accessToken, isAuthenticated: true });
                return response.data.data.accessToken;
            }
            return ""
        } catch (error) {
            console.error("Refresh token: Refresh Token het han", error);
            set({ accessToken: null, isAuthenticated: false });
            // localStorage.removeItem("accessToken");
            return window.location.href = ("/login");
        }
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem("accessToken");
        set({ accessToken: null, isAuthenticated: false });
    },
}));

