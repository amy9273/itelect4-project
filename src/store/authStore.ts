import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null;
    userId: number | null;
    userName: string | null;
    userRole: "owner" | "vet" | "admin";
    vetId?: number | null;
    login: (name: string, userId?: number, role?: "owner" | "vet" | "admin", vetId?: number) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            userId: 5, // Default owner ID
            userName: null,
            userRole: "owner",
            vetId: null,
            login: (name: string, userId: number = 5, role: "owner" | "vet" | "admin" = "owner", vetId: number | null = null) =>
                set({
                    token: `demo-token-${name}`,
                    userName: name,
                    userId: userId,
                    userRole: role,
                    vetId: vetId,
                }),
            logout: () => set({ token: null, userName: null, userId: null, userRole: "owner", vetId: null }),
        }),
        {
            name: "itelect4-auth",
            partialize: (state) => ({
                token: state.token,
                userId: state.userId,
                userName: state.userName,
                userRole: state.userRole,
                vetId: state.vetId,
            }),
        }
    )
);

export default useAuthStore;

