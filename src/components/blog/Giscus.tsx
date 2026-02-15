"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/hooks/useHydrated";

export default function Giscus() {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;

    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: resolvedTheme === "dark" ? "dark" : "light" } } },
        "https://giscus.app"
      );
    }
  }, [resolvedTheme, hydrated]);

  if (!hydrated) return null;

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !category || !categoryId) {
    return null;
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className="giscus-container mt-12 pt-8 border-t border-border">
      <script
        src="https://giscus.app/client.js"
        data-repo={repo}
        data-repo-id={repoId}
        data-category={category}
        data-category-id={categoryId}
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme={theme}
        data-lang="ko"
        data-loading="lazy"
        crossOrigin="anonymous"
        async
      />
    </div>
  );
}
