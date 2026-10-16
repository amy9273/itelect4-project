import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, ID } from "../types/index";

interface AuthState {
    token: string | null;
    user: User | null;
    userId: ID | null;
    userName: string | null;
    userRole: "owner" | "vet" | "admin" | "student" | "instructor";
    vetId?: number | null;
    setSession: (token: string, user: User, vetId?: number | null) => void;
    login: (name: string, userId?: ID, role?: "owner" | "vet" | "admin", vetId?: number) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            userId: null,
            userName: null,
            userRole: "owner",
            vetId: null,
            setSession: (token: string, user: User, vetId: number | null = null) =>
                set({
                    token,
                    user,
                    userName: user.name,
                    userId: user.id,
                    userRole: user.role || "owner",
                    vetId: vetId,
                }),
            login: (name: string, userId: ID = 5, role: "owner" | "vet" | "admin" = "owner", vetId: number | null = null) =>
                set({
                    token: `demo-token-${name}`,
                    user: { id: userId, name, email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`, role },
                    userName: name,
                    userId: userId,
                    userRole: role,
                    vetId: vetId,
                }),
            logout: () =>
                set({
                    token: null,
                    user: null,
                    userName: null,
                    userId: null,
                    userRole: "owner",
                    vetId: null,
                }),
        }),
        {
            name: "itelect4-auth",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                userId: state.userId,
                userName: state.userName,
                userRole: state.userRole,
                vetId: state.vetId,
            }),
        }
    )
);

export default useAuthStore;
