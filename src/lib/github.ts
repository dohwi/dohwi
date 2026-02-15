import { cache } from "react";
import matter from "gray-matter";

import type { Frontmatter, Post, PostMeta } from "@/types/post";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const CONTENT_REPO_OWNER = process.env.CONTENT_REPO_OWNER || "dohwi";
const CONTENT_REPO_NAME = process.env.CONTENT_REPO_NAME || "content";
const CONTENT_BRANCH = process.env.CONTENT_BRANCH || "main";
const CONTENT_PATH = process.env.CONTENT_PATH || "posts";

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content?: string;
  download_url: string;
}

function getApiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchGitHubAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: getApiHeaders(),
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from GitHub API: ${endpoint}`, error);
    return null;
  }
}

async function fetchFileContent(downloadUrl: string): Promise<string | null> {
  try {
    const response = await fetch(downloadUrl, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch file content: ${downloadUrl}`, error);
    return null;
  }
}

async function _getPostSlugs(): Promise<string[]> {
  const files = await fetchGitHubAPI<GitHubFile[]>(
    `/repos/${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}/contents/${CONTENT_PATH}?ref=${CONTENT_BRANCH}`
  );
  if (!files) return [];
  return files
    .filter((file) => file.name.endsWith(".mdx") || file.name.endsWith(".md"))
    .map((file) => file.name.replace(/\.(mdx|md)$/, ""));
}

async function _getPost(slug: string): Promise<Post | null> {
  const extensions = ["mdx", "md"];
  for (const ext of extensions) {
    const file = await fetchGitHubAPI<GitHubFile>(
      `/repos/${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}/contents/${CONTENT_PATH}/${slug}.${ext}?ref=${CONTENT_BRANCH}`
    );
    if (file && file.download_url) {
      const content = await fetchFileContent(file.download_url);
      if (!content) continue;
      const { data, content: body } = matter(content);
      const frontmatter = data as Frontmatter;
      return {
        slug,
        frontmatter,
        content: body,
      };
    }
  }
  return null;
}

export const getPostSlugs = cache(_getPostSlugs);
export const getPost = cache(_getPost);

export async function getPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPost(slug);
      if (post && post.frontmatter.published !== false) {
        return {
          slug: post.slug,
          title: post.frontmatter.title,
          date: post.frontmatter.date,
          description: post.frontmatter.description,
          category: post.frontmatter.category,
          tags: post.frontmatter.tags || [],
          published: post.frontmatter.published ?? true,
        } as PostMeta;
      }
      return null;
    })
  );

  return posts
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.category === category);
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getPosts();
  const categorySet = new Set<string>();
  posts.forEach((post) => categorySet.add(post.category));
  return Array.from(categorySet).sort();
}
