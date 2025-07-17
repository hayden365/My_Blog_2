import { JSONContent } from "@tiptap/react";

export function generateHeadingId(text: string, index: number): string {
  const cleanText = text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, "") // 이모티콘 제거
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-") // 연속된 하이픈을 하나로
    .replace(/^-|-$/g, ""); // 앞뒤 하이픈 제거

  const result = cleanText || `heading-${index}`;
  return `${result}-${index}`;
}

export function extractHeadingText(content: JSONContent[]): string {
  if (!content || !Array.isArray(content)) return "";

  return content
    .map((child) => {
      if (typeof child === "object") {
        if (child.text) {
          return child.text;
        }
        if (child.content) {
          return extractHeadingText(child.content);
        }
      }
      return "";
    })
    .join("");
}
