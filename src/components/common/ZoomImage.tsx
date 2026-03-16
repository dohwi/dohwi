"use client";

import { useSyncExternalStore } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";

function getOptimizedSrc(src?: React.ImgHTMLAttributes<HTMLImageElement>["src"]) {
    if (typeof src !== "string") return src || "";

    // GitHub blob URL -> raw.githubusercontent.com URL로 변환 (리다이렉트 방지 및 안정적인 로드)
    if (src.includes("github.com") && src.includes("/blob/")) {
        return src
            .replace("//github.com/", "//raw.githubusercontent.com/")
            .replace("/blob/", "/")
            .split("?")[0]; // ?raw=true 등 쿼리스트링 제거
    }
    return src;
}

export function ZoomImage({
    src,
    alt,
    className,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
    const isMobile = useSyncExternalStore(
        (onStoreChange) => {
            const mql = window.matchMedia("(max-width: 639px)");
            mql.addEventListener("change", onStoreChange);
            return () => mql.removeEventListener("change", onStoreChange);
        },
        () => window.matchMedia("(max-width: 639px)").matches,
        () => false
    );

    const optimizedSrc = getOptimizedSrc(src);

    if (!optimizedSrc) return null;

    const imgElement = (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={optimizedSrc}
            alt={alt || ""}
            loading="lazy"
            decoding="async"
            className={cn("mx-auto max-w-full h-auto rounded-lg object-contain", className)}
            {...props}
        />
    );

    return (
        <Zoom wrapElement="span" zoomMargin={isMobile ? 0 : 45}>
            {imgElement}
        </Zoom>
    );
}
