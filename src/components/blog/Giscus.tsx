"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/hooks/useHydrated";

export default function Giscus() {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();
  const ref = useRef<HTMLDivElement>(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  // Initial load
  useEffect(() => {
    if (!hydrated || !ref.current || ref.current.hasChildNodes()) return;
    if (!repo || !repoId || !category || !categoryId) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, [hydrated, resolvedTheme, repo, repoId, category, categoryId]);

  // Handle theme changes
  useEffect(() => {
    if (!hydrated) return;
    
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (!iframe) return;
    
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: resolvedTheme === "dark" ? "dark" : "light" } } },
      "https://giscus.app"
    );
  }, [resolvedTheme, hydrated]);

  if (!hydrated) return null;
  if (!repo || !repoId || !category || !categoryId) return null;

  return (
    <div className="giscus-container mt-12 pt-8 border-t border-border" ref={ref} />
  );
}
