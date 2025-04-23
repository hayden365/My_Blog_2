import { UserProfile } from "../types/user";

let accessToken: string | null = null;
let userData: UserProfile | null = null;

const API_URL = process.env.NEXT_PUBLIC_URL;

export const initAuth = () => {
  // 세션 스토리지에서 임시 저장된 토큰과 사용자 정보 가져오기
  accessToken = sessionStorage.getItem("accessToken");
  const userDataString = sessionStorage.getItem("userData");

  if (userDataString) {
    userData = JSON.parse(userDataString);
  }
  // 세션 스토리지 삭제 (메모리에만 유지)
  // sessionStorage.removeItem("accessToken");
  // sessionStorage.removeItem("userData");
};

export const getAccessToken = () => accessToken;
export const getUserData = () => userData;

// 토큰이 있는지 확인
export const isAuthenticated = () => !!accessToken;

// 로그인 함수
export const login = () => {
  try {
    window.location.href = `${API_URL}/auth/google`;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const setAccessToken = (token: string) => {
  accessToken = token;

  // 토큰에서 사용자 정보 추출
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    userData = JSON.parse(jsonPayload);

    // 세션 스토리지에 저장
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("userData", JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

// 토큰 갱신 함수
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // 반드시 포함
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token in refreshToken");
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
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
    accessToken = null;
    userData = null;
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
  }
};

// 인증 헤더를 포함한 fetch 함수
// TODO: fetch interceptor 패턴으로 변경 해보기
// (함수 위치로 여기가 적절할까?)
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // 함수 호출 시점에 최신 토큰을 가져옴
  let accessToken = getAccessToken();

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...(options.headers || {}),
    },
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    const refreshSuccessful = await refreshToken();

    if (!refreshSuccessful) {
      throw new Error("Failed to refresh token in fetchWithAuth");
    }

    accessToken = getAccessToken();

    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    response = await fetch(url, fetchOptions);
  }

  return response;
};
