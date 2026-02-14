export interface Frontmatter {
  title: string;
  date: string;
  description: string;
  category: string;
  tags?: string[];
  published?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  published: boolean;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}
