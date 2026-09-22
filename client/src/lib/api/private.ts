import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/auth/authStore";

export const privateApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// ---------- request: attach Bearer from the store ----------
privateApi.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ---------- response: refresh on 401 ----------
let isRefreshing = false;
let refreshQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown) {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    refreshQueue = [];
}

privateApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/auth/refresh")) {
            isRefreshing = false;
            flushQueue(error);
            useAuthStore.getState().clearSession();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({
                    resolve: () => resolve(privateApi(originalRequest)),
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const res = await privateApi.post("/auth/refresh");
            useAuthStore.getState().setToken(res.data.data.accessToken);
            flushQueue(null);
            return privateApi(originalRequest);
        } catch (refreshError) {
            flushQueue(refreshError);
            useAuthStore.getState().clearSession();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);