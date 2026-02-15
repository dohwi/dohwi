import { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";
import { getPost, getPosts } from "@/lib/github";
import { parseMDX } from "@/lib/mdx";
import TOC from "@/components/blog/TOC";
import ScrollToTop from "@/components/blog/ScrollToTop";
import Giscus from "@/components/blog/Giscus";

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
  if (!post) return { title: "찾을 수 없음" };

  const baseUrl = process.env.SITE_URL || "https://dohwi.com";

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: [
      "도휘닷컴",
      "도휘",
      "dohwi",
      ...(post.frontmatter.tags || []),
      post.frontmatter.category,
    ].filter(Boolean),
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: `${post.frontmatter.title} · 도휘닷컴`,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: ["도휘"],
      siteName: "도휘닷컴",
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.frontmatter.title} · 도휘닷컴`,
      description: post.frontmatter.description,
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
  const baseUrl = process.env.SITE_URL || "https://dohwi.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: "도휘",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "도휘닷컴",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
    url: `${baseUrl}/blog/${slug}`,
    keywords: post.frontmatter.tags?.join(", ") || "",
    articleSection: post.frontmatter.category,
    inLanguage: "ko-KR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <Link
                href={`/blog?category=${post.frontmatter.category}`}
                className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {post.frontmatter.category}
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {post.frontmatter.title}
            </h1>
            <p className="text-lg text-muted">{post.frontmatter.description}</p>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="text-sm text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>
          <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20">
            {content}
          </div>
          <Giscus />
        </article>
        <TOC items={toc} />
        <ScrollToTop />
      </div>
    </>
  );
}
