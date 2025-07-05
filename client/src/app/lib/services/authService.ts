import { UserProfile } from "../types/user";

let accessToken: string | null = null;
let userData: UserProfile | null = null;

const API_URL = process.env.NEXT_PUBLIC_URL;

// 쿠키에서 토큰 읽기
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();

    if (trimmedCookie.startsWith(`${name}=`)) {
      const value = trimmedCookie.substring(name.length + 1);
      return value;
    }
  }
  return null;
};

// 쿠키 설정
const setCookie = (name: string, value: string, maxAge: number) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict; Secure`;
};

// 쿠키 삭제
const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const initAuth = () => {
  // 쿠키에서 토큰과 사용자 정보 가져오기
  accessToken = getCookie("accessToken");

  if (accessToken) {
    try {
      const base64Url = accessToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      userData = JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse user data from token:", error);
      accessToken = null;
      userData = null;
    }
  }
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

    // 쿠키에 저장 (15분 유효)
    setCookie("accessToken", token, 15 * 60);

    return userData;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

// 토큰 갱신 함수
export const refreshToken = async (): Promise<boolean> => {
  if (!accessToken) {
    console.log("No access token available for refresh");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // 반드시 포함
    });

    console.log("Refresh response status:", response.status);

    if (!response.ok) {
      // 서버 응답 내용을 확인
      const errorData = await response.text();
      console.error("Refresh token failed:", {
        status: response.status,
        statusText: response.statusText,
        body: errorData,
      });

      // 401이나 403 에러인 경우 로그아웃 처리
      if (response.status === 401 || response.status === 403) {
        console.log("Token refresh failed, logging out user");
        await logout();
      }

      return false;
    }

    const data = await response.json();
    console.log("Token refresh successful");
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

    // 쿠키 삭제
    deleteCookie("accessToken");
  }
};

// api 요청을 인증 헤더 포함하게 해주는 fetch 함수
// TODO: fetch interceptor 패턴으로 변경 해보기
// (함수 위치로 여기가 적절할까?)
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // 함수 호출 시점에 쿠키에서 최신 토큰을 가져옴
  let accessToken = getCookie("accessToken") || getAccessToken();

  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include", // 쿠키 포함
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...(options.headers || {}),
    },
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401 && accessToken) {
    console.log("Access token expired, attempting refresh");
    const refreshSuccessful = await refreshToken();

    if (!refreshSuccessful) {
      console.log("Token refresh failed, redirecting to login");
      // 로그인 페이지로 리다이렉트
      window.location.href = "/";
      throw new Error("Authentication failed");
    }

    accessToken = getCookie("accessToken") || getAccessToken();

    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    response = await fetch(url, fetchOptions);
  }

  return response;
};
