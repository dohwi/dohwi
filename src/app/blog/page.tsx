import { Metadata } from "next";

import BlogCard from "@/components/blog/BlogCard";
import SearchBar from "@/components/blog/SearchBar";
import TagFilter from "@/components/blog/TagFilter";
import { getPosts, getAllTags, getAllCategories } from "@/lib/github";

export const metadata: Metadata = {
  title: "Blog | dohwi.com",
  description: "Blog posts by dohwi",
};

export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { q, tag, category } = await searchParams;
  const [posts, allTags, allCategories] = await Promise.all([
    getPosts(),
    getAllTags(),
    getAllCategories(),
  ]);

  let filteredPosts = posts;

  if (q) {
    const query = q.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (tag) {
    filteredPosts = filteredPosts.filter((post) => post.tags.includes(tag));
  }

  if (category) {
    filteredPosts = filteredPosts.filter((post) => post.category === category);
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-foreground">Blog</h1>
        <p className="text-muted">Thoughts, ideas, and things I&apos;ve learned.</p>
      </header>

      <div className="flex flex-col gap-4">
        <SearchBar />
        <TagFilter tags={allTags} categories={allCategories} />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="py-12 text-center text-muted">
          <p>No posts found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
