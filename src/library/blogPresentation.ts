export const cleanBlogTitle = (title: string) =>
  title.replace(/^\s*大見出し[：:]\s*/, "");

export const cleanBlogContent = (content: string) =>
  content
    .replace(/(<h[2-3]\b[^>]*>)\s*中見出し[：:]\s*/g, "$1")
    .replace(/<h[2-3]\b[^>]*>\s*設定用ハッシュタグ\s*<\/h[2-3]>/g, "")
    .replace(/設定用ハッシュタグ\s*/g, "");

const decodeBasicEntities = (text: string) =>
  text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

export const createBlogExcerpt = (content: string, maxLength = 140) => {
  const text = decodeBasicEntities(cleanBlogContent(content).replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
};
