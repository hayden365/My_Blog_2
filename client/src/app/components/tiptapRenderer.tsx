import React from "react";
import { JSONContent } from "@tiptap/react";
import DOMPurify from "isomorphic-dompurify";

interface TiptapRendererProps {
  content: JSONContent;
  className?: string;
}

// 안전한 HTML 태그와 속성만 허용하는 함수
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "strong",
      "em",
      "del",
      "u",
      "mark",
      "sup",
      "sub",
      "a",
      "img",
      "hr",
      "input",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "title",
      "style",
      "class",
      "type",
      "checked",
      "disabled",
      "colspan",
      "rowspan",
    ],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onfocus",
      "onblur",
    ],
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// TipTap JSON을 HTML로 변환하는 함수
function jsonToHtml(json: JSONContent): string {
  if (!json) return "";

  let html = "";

  // 배열인 경우 각 요소를 처리
  if (Array.isArray(json)) {
    return json.map((item) => jsonToHtml(item)).join("");
  }

  // 객체인 경우 타입에 따라 처리
  if (typeof json === "object" && json !== null) {
    const { type, content, text, marks, attrs } = json as {
      type: string;
      content: JSONContent[];
      text: string;
      marks: { type: string; attrs: Record<string, unknown> }[];
      attrs: Record<string, unknown>;
    };

    // 텍스트 노드
    if (text) {
      let textContent = text;

      // 마크 적용
      if (marks && Array.isArray(marks)) {
        marks.forEach(
          (mark: { type: string; attrs: Record<string, unknown> }) => {
            switch (mark.type) {
              case "bold":
                textContent = `<strong>${textContent}</strong>`;
                break;
              case "italic":
                textContent = `<em>${textContent}</em>`;
                break;
              case "strike":
                textContent = `<del>${textContent}</del>`;
                break;
              case "underline":
                textContent = `<u>${textContent}</u>`;
                break;
              case "code":
                textContent = `<code>${escapeHtml(textContent)}</code>`;
                break;
              case "superscript":
                textContent = `<sup>${textContent}</sup>`;
                break;
              case "subscript":
                textContent = `<sub>${textContent}</sub>`;
                break;
              case "highlight":
                const color = mark.attrs?.color || "yellow";
                textContent = `<mark style="background-color: ${color}">${textContent}</mark>`;
                break;
              case "link":
                const href = (mark.attrs?.href as string) || "#";
                // 안전한 URL만 허용
                const safeHref =
                  typeof href === "string" &&
                  (href.startsWith("http://") ||
                    href.startsWith("https://") ||
                    href.startsWith("/") ||
                    href.startsWith("#"))
                    ? href
                    : "#";
                textContent = `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${textContent}</a>`;
                break;
            }
          }
        );
      }

      html += textContent;
    }

    // 블록 노드
    if (type) {
      const children = content
        ? content.map((child: JSONContent) => jsonToHtml(child)).join("")
        : "";

      switch (type) {
        case "doc":
          html += children;
          break;
        case "paragraph":
          const align = attrs?.textAlign || "left";
          html += `<p style="text-align: ${align}">${children}</p>`;
          break;
        case "heading":
          const level = attrs?.level || 1;
          html += `<h${level}>${children}</h${level}>`;
          break;
        case "bulletList":
          html += `<ul>${children}</ul>`;
          break;
        case "orderedList":
          html += `<ol>${children}</ol>`;
          break;
        case "listItem":
          html += `<li>${children}</li>`;
          break;
        case "taskList":
          html += `<ul class="task-list">${children}</ul>`;
          break;
        case "taskItem":
          const checked = attrs?.checked || false;
          html += `<li class="task-item"><input type="checkbox" ${checked ? "checked" : ""} disabled>${children}</li>`;
          break;
        case "blockquote":
          html += `<blockquote>${children}</blockquote>`;
          break;
        case "codeBlock":
          const language = attrs?.language || "";
          const codeText = (content || [])
            .map((child) => escapeHtml(child.text || ""))
            .join("");
          html += `<pre><code class="language-${language}">${codeText}</code></pre>`;
          break;
        case "code":
          const inlineCode = (content || [])
            .map((child) => escapeHtml(child.text || ""))
            .join("");
          html += `<code>${inlineCode}</code>`;
          break;
        case "image":
          const src = (attrs?.src as string) || "";
          const alt = (attrs?.alt as string) || "";
          const title = (attrs?.title as string) || "";
          // 안전한 이미지 URL만 허용
          const safeSrc =
            typeof src === "string" &&
            (src.startsWith("http://") ||
              src.startsWith("https://") ||
              src.startsWith("/") ||
              src.startsWith("data:image/"))
              ? src
              : "";
          console.log("safeSrc", safeSrc);
          if (safeSrc) {
            const isGif = safeSrc.toLowerCase().includes(".gif");
            const imgClass = isGif ? "gif-image" : "";
            html += `<img src="${safeSrc}" alt="${alt}" title="${title}" class="${imgClass}" />`;
          }
          break;
        case "horizontalRule":
          html += "<hr>";
          break;
        case "table":
          html += `<table>${children}</table>`;
          break;
        case "tableRow":
          html += `<tr>${children}</tr>`;
          break;
        case "tableCell":
          html += `<td>${children}</td>`;
          break;
        case "tableHeader":
          html += `<th>${children}</th>`;
          break;
        default:
          html += children;
      }
    }
  }

  return html;
}

export default function TiptapRenderer({
  content,
  className = "",
}: TiptapRendererProps) {
  // JSON을 HTML로 변환
  const rawHtml = jsonToHtml(content);

  // 서버 사이드에서 안전한 HTML 생성
  const sanitizedHtml = sanitizeHtml(rawHtml);

  return (
    <div
      className={`tiptap-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
