import { createClient } from 'microcms-js-sdk';
import snapshot from '../data/blogSnapshot.json';

export interface Blog {
  id: string; createdAt: string; updatedAt: string; publishedAt: string; revisedAt: string;
  title: string; content: string; description?: string; tags?: string[];
  eyecatch?: { url: string; height: number; width: number };
}
// Keep live CMS support. A Sites import can build all published articles without
// copying production secrets: the versioned public snapshot is the fallback.
export const client = import.meta.env.MICROCMS_SERVICE_DOMAIN && import.meta.env.MICROCMS_API_KEY
  ? createClient({serviceDomain:import.meta.env.MICROCMS_SERVICE_DOMAIN,apiKey:import.meta.env.MICROCMS_API_KEY})
  : null;
export const getBlogs = async (queries?: { orders?: string; fields?: string[]; limit?: number; offset?: number }) => {
  if(client) return client.get<{contents:Blog[]}>({endpoint:'blogs',queries});
  const posts = [...snapshot.contents].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  const start=queries?.offset||0;
  return { contents:posts.slice(start,queries?.limit ? start+queries.limit : undefined) as Blog[] };
};
export const getBlogDetail = async (contentId: string, queries?: any) => {
  if(client) return client.get<Blog>({endpoint:'blogs',contentId,queries});
  const post=snapshot.contents.find(item=>item.id===contentId);
  if(!post) throw new Error(`Published blog article not found: ${contentId}`);
  return post as Blog;
};
