import { create } from "zustand";
import { UserProfile } from "../types/user";
import {
  getUserData,
  initAuth,
  refreshToken,
  login as serviceLogin,
  logout as serviceLogout,
} from "../services/authService";

type AuthStore = {
  userProfile: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  checkAuth: () => void;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userProfile: null,
  isLoading: true,
  isLoggedIn: false,

  checkAuth: async () => {
    initAuth();

    let userData = getUserData();

    if (!userData) {
      const refreshsed = await refreshToken();
      if (refreshsed) {
        userData = getUserData();
      }
    }

    if (userData) {
      set({
        userProfile: userData,
        isLoggedIn: true,
        isLoading: false,
      });
    } else {
      set({
        userProfile: null,
        isLoggedIn: false,
        isLoading: false,
      });
    }
  },

  login: () => {
    serviceLogin();
  },

  logout: async () => {
    await serviceLogout();
    set({
      userProfile: null,
      isLoggedIn: false,
      isLoading: false,
    });
  },
}));
