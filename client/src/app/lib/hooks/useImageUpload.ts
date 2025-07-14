import { useState } from "react";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) {
      throw new Error("파일을 선택해주세요");
    }

    setIsUploading(true);
    setProgress(0);

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      setIsUploading(false);
      throw authError;
    }

    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      console.log("Upload response:", uploadResponse);
      if (uploadResponse.url) {
        return uploadResponse.url;
      } else {
        throw new Error("업로드된 이미지 URL을 가져올 수 없습니다");
      }
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
        throw new Error("업로드가 취소되었습니다");
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
        throw new Error("잘못된 요청입니다");
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
        throw new Error("네트워크 오류가 발생했습니다");
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
        throw new Error("서버 오류가 발생했습니다");
      } else {
        console.error("Upload error:", error);
        throw new Error("업로드 중 오류가 발생했습니다");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleUpload,
    progress,
    isUploading,
  };
}
