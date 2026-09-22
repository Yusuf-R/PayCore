// src/lib/api/public.ts
import axios from "axios";

export const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: false, // no session involved
    headers: { "Content-Type": "application/json" },
});