import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";

import type { TOCItem } from "@/types/post";

interface MDXResult {
  content: React.ReactElement;
  toc: TOCItem[];
}

export async function parseMDX(source: string): Promise<MDXResult> {
  const toc: TOCItem[] = [];
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);
    toc.push({ id, text, level });
  }

  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor"],
              },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: true,
            },
          ],
        ],
      },
    },
  });

  return { content, toc };
}

export function extractHeadingsFromHTML(html: string): TOCItem[] {
  const toc: TOCItem[] = [];
  const headingRegex = /<h([1-3])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    toc.push({ id, text, level });
  }
  return toc;
}
