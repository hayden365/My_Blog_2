import { UserProfile } from "../types/user";

let userData: UserProfile | null = null;

const API_URL = process.env.NEXT_PUBLIC_URL;

// 사용자 정보를 서버에서 가져오는 함수 (리프레시 토큰 포함)
const fetchUserData = async (): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    }

    // 401 에러가 발생한 경우
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      console.log("📝 에러 메시지:", errorData.message);

      // "No access token provided" 메시지인 경우 - 로그인하지 않은 상태
      if (errorData.message === "No access token provided") {
        console.log("🚫 로그인하지 않은 상태 - 검증 생략");
        return null;
      }

      // 토큰이 만료된 경우에만 리프레시 시도
      if (errorData.message === "There's only refresh token") {
        console.log("🔄 액세스 토큰 만료, 리프레시 토큰으로 갱신 시도");

        // 리프레시 토큰으로 새로운 액세스 토큰 발급 시도
        const refreshSuccessful = await refreshToken();

        if (refreshSuccessful) {
          return userData;
        }

        console.log("❌ 리프레시 토큰도 만료됨");
        return null;
      }

      // 기타 401 에러의 경우
      console.log("❌ 인증 실패:", errorData.message);
      return null;
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};

// 인증 초기화 - 서버에서 사용자 정보 가져오기
export const initAuth = async (): Promise<UserProfile | null> => {
  try {
    userData = await fetchUserData();
    return userData;
  } catch (error) {
    console.error("Auth initialization failed:", error);
    return null;
  }
};

// 사용자 데이터 가져오기
export const getUserData = () => userData;

// 인증 상태 확인
export const isAuthenticated = async (): Promise<boolean> => {
  if (userData) {
    return true;
  }

  // 서버에서 최신 정보 확인
  const freshUserData = await fetchUserData();
  if (freshUserData) {
    userData = freshUserData;
    return true;
  }

  return false;
};

// 로그인 함수
export const login = () => {
  try {
    window.location.href = `${API_URL}/auth/google`;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// 로그아웃 함수
export const logout = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    userData = null;
  }
};

// 토큰 갱신 함수 (서버에서 자동 처리되므로 간단하게)
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("❌ Token refresh failed:", response.status);
      return false;
    }

    console.log("✅ 리프레시 토큰 갱신 성공, 사용자 정보 새로 가져오기");
    // 토큰이 갱신되었으므로 사용자 정보도 새로 가져오기 (무한 재귀 방지)
    const userResponse = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (userResponse.ok) {
      const freshUserData = await userResponse.json();
      userData = freshUserData;
      console.log("✅ 사용자 정보 업데이트 완료");
      return true;
    }

    console.log("❌ 사용자 정보 가져오기 실패");
    return false;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    return false;
  }
};

// 인증이 포함된 fetch 함수
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include", // 쿠키 포함
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    console.log("Access token expired, attempting refresh");
    const refreshSuccessful = await refreshToken();

    if (!refreshSuccessful) {
      console.log("Token refresh failed, redirecting to login");
      // 로그인 페이지로 리다이렉트
      window.location.href = "/";
      throw new Error("Authentication failed");
    }

    // 토큰이 갱신되었으므로 원래 요청 재시도
    response = await fetch(url, fetchOptions);
  }

  return response;
};
