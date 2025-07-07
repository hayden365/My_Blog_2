import { create } from "zustand";
import { UserProfile } from "../types/user";
import {
  getUserData,
  initAuth,
  isAuthenticated,
  login as serviceLogin,
  logout as serviceLogout,
} from "../services/authService";

type AuthStore = {
  userProfile: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  checkAuth: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userProfile: null,
  isLoading: true,
  isLoggedIn: false,

  checkAuth: async () => {
    try {
      // 서버에서 사용자 정보 가져오기
      const userData = await initAuth();

      if (userData) {
        set({
          userProfile: userData,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        // 사용자 정보가 없으면 인증 상태 한 번 더 확인
        const authenticated = await isAuthenticated();

        if (authenticated) {
          const currentUserData = getUserData();
          set({
            userProfile: currentUserData,
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
      }
    } catch (error) {
      console.error("Auth check failed:", error);
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
