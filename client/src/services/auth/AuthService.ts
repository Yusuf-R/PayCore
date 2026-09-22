import { publicApi } from "@/lib/api/public";
import { privateApi } from "@/lib/api/private";
import type { AuthUser } from "@/lib/auth/authStore";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
    user: AuthUser;
}

export interface RegisterResult {
    userId: string;
    email: string;
}

export interface VerifyEmailPayload {
    email: string;
    code: string;
}

export interface ResendVerificationPayload {
    email: string;
}

class AuthService {
    async login(payload: LoginPayload): Promise<LoginResult> {
        const res = await publicApi.post<{ data: LoginResult }>("/auth/login", payload);
        return res.data.data;
    }

    async register(payload: RegisterPayload): Promise<RegisterResult> {
        const res = await publicApi.post<{ data: RegisterResult }>("/auth/register", payload);
        return res.data.data;
    }

    async verifyEmail(payload: VerifyEmailPayload): Promise<RegisterResult> {
        const res = await publicApi.post<{ data: RegisterResult }>("/auth/verify-email", payload);
        return res.data.data;
    }

    async resendVerification(payload: ResendVerificationPayload): Promise<{ message: string }> {
        const res = await publicApi.post<{ message: string }>("/auth/resend-verification", payload);
        return res.data;
    }

    async logout(): Promise<void> {
        await privateApi.post("/auth/logout");
    }

    async getMe(): Promise<AuthUser> {
        const res = await privateApi.get<{ data: AuthUser }>("/auth/me");
        return res.data.data;
    }

    async forgotPassword(payload: { email: string }): Promise<{ message: string }> {
        const res = await publicApi.post<{ message: string }>("/auth/forgot-password", payload);
        return res.data;
    }

    async resetPassword(payload: {
        email: string;
        code: string;
        newPassword: string;
    }): Promise<{ userId: string; email: string }> {
        const res = await publicApi.post<{ data: { userId: string; email: string } }>(
            "/auth/reset-password",
            payload
        );
        return res.data.data;
    }
}

export const authService = new AuthService();