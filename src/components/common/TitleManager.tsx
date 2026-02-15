"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CLEAN_DELAY_MS = 3000;
const SEPARATOR = " · ";

export default function TitleManager() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentTitle = document.title;
      const separatorIndex = currentTitle.lastIndexOf(SEPARATOR);

      if (separatorIndex !== -1) {
        const cleanTitle = currentTitle.substring(0, separatorIndex);
        if (cleanTitle.length > 0) {
          document.title = cleanTitle;
        }
      }
    }, CLEAN_DELAY_MS);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
