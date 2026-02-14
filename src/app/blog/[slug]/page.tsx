import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPost, getPosts } from "@/lib/github";
import { parseMDX } from "@/lib/mdx";
import TOC from "@/components/blog/TOC";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.frontmatter.title} | dohwi.com`,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: ["dohwi"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const { content, toc } = await parseMDX(post.content);

  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium">
              {post.frontmatter.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {post.frontmatter.title}
          </h1>
          <p className="text-lg text-muted">{post.frontmatter.description}</p>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-muted hover:text-accent transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-zinc-900 prose-pre:p-4">
          {content}
        </div>
      </article>
      <TOC items={toc} />
    </div>
  );
}
