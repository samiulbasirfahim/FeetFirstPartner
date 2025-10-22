import { LoginPayload } from "@/types/auth";
import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  login: (data: LoginPayload) => void | Partial<Record<string, string>>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: (data: LoginPayload) => {
    if (data.email !== "partner@feetf1rst.com")
      return { email: "E-Mail nicht gefunden" };

    if (data.password !== "feetf1rst") return { password: "Falsches Passwort" };

    set(() => ({ isLoggedIn: true }));
  },
  logout: () => set(() => ({ isLoggedIn: false })),
}));
