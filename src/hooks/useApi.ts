import { useState, useEffect, useMemo } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { BASE_URL } from "../CONFIG";
import { ErrorResponse } from "../types";

import { useAuthStore } from "../store/useAuthStore";

// Tạo instance axios với cấu hình mặc định
const axiosClient = axios.create({
    baseURL: BASE_URL, // Thay bằng API thực tế của bạn
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000, // Giới hạn request trong 5s
    withCredentials: true,
});

// Custom hook `useApi`
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    console.log("DA VAO DAY ");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => Promise.reject(error)
);


export const useApi = <T, D = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    requestData?: D,
    config?: AxiosRequestConfig
) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { refreshAccessToken } = useAuthStore();

    const stableRequestData = useMemo(() => requestData, [JSON.stringify(requestData)]);


    axiosClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response && error.response.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    console.log("DA REFRESH LAI ACCESS TOKEN")
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return axios(error.config); // Gửi lại request với token mới
                }
            }
            return Promise.reject(error);
        }
    );


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient({
                    method,
                    url,
                    data: stableRequestData,
                    ...config,
                });
                console.log("FETCH API !!!!!!!!!!!!!!!")
                setError(null);
                console.log("🚀 ~ fetchData ~ response:", response)

                setData(response.data);
            } catch (error: unknown) {
                const axiosError = error as AxiosError;
                const errorResponse = axiosError.response?.data as ErrorResponse
                setError(errorResponse);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [method, url, stableRequestData, config]);

    return { data, error, loading };
};
