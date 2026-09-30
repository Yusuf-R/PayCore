import { privateApi } from "@/lib/api/private";
import type { AuthUser } from "@/lib/auth/store/authStore";

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

class UserService {
    async updateProfile(input: UpdateProfileInput): Promise<AuthUser> {
        const res = await privateApi.patch<{ data: AuthUser }>("/users/me", input);
        return res.data.data;
    }
}

export const userService = new UserService();