import type { Blog } from './microcms';
import { blogReadingGuides } from '../data/blogReadingGuides';

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

// 一覧・本文・メタ情報で、改稿後の内容を共通して使う。
export const presentBlog = (post: Blog) => {
  const guide = blogReadingGuides[post.id];
  const content = cleanBlogContent(guide?.content ?? post.content);
  const dateModified = [post.updatedAt, post.revisedAt, guide?.revisedAt]
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];

  return {
    ...post,
    title: cleanBlogTitle(guide?.title ?? post.title),
    content,
    description: guide?.description || post.description?.trim() || createBlogExcerpt(content, 150),
    // 改稿前の見出し入り画像を、改稿後のタイトルと並べない。
    eyecatch: guide?.content ? undefined : post.eyecatch,
    dateModified,
    guide,
    topic: guide?.topic ?? 'other',
  };
};
