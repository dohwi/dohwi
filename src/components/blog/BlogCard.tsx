import Link from "next/link";

import type { PostMeta } from "@/types/post";

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group p-6 border border-border rounded-lg bg-background hover:border-accent/50 transition-colors">
      <Link href={`/blog/${post.slug}`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium">
              {post.category}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
            {post.title}
          </h2>
          <p className="text-muted line-clamp-2">{post.description}</p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted/80 hover:text-accent transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
