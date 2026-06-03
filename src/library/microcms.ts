import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export interface Blog {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  description?: string;
  tags?: string[];
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
}

export const getBlogs = async (queries?: any) => {
  return await client.get<{ contents: Blog[] }>({
    endpoint: "blogs",
    queries,
  });
};

export const getBlogDetail = async (contentId: string, queries?: any) => {
  return await client.get<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};
