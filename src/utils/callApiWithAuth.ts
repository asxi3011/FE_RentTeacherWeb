import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "../CONFIG";
import { ErrorResponse } from "../types";
import { useAuthStore } from "../store/useAuthStore";

// Tạo instance axios
const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
    withCredentials: true,
});

let isRefreshing = false; // Kiểm soát refresh token
let failedQueue: any[] = []; // Hàng đợi các request đang chờ refresh token

// Xử lý retry request sau khi refresh token
const processQueue = (error: AxiosError | null, token: string | null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};


axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Thêm interceptor để xử lý lỗi 401
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("Bi Loi 401");
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { refreshAccessToken, logout } = useAuthStore.getState();
                const newToken = await refreshAccessToken();

                if (!newToken) {
                    logout(); // Nếu refresh thất bại, logout user
                    return Promise.reject(error);
                }

                localStorage.setItem("accessToken", newToken);
                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().logout(); // Logout nếu refresh token thất bại
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Hàm gọi API
export async function callApiWithAuth<T, D = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    requestData?: D,
    config?: AxiosRequestConfig
): Promise<{ data: T | null; error: ErrorResponse | null }> {
    try {
        const response: AxiosResponse<T> = await axiosClient({
            method,
            url,
            data: requestData,
            ...config,
        });

        return { data: response.data, error: null };
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const errorResponse = axiosError.response?.data as ErrorResponse;
        return { data: null, error: errorResponse };
    }
}
