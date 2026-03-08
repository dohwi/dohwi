"use client";

import { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";

function getOptimizedSrc(src?: string) {
    if (!src) return "";
    
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
    const [margin, setMargin] = useState(45);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // 모바일(Tailwind sm 640px 이하) 환경인지 판별하는 Media Query
        const mql = window.matchMedia("(max-width: 639px)");

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setMargin(e.matches ? 0 : 45);
        };

        // 초기 설정
        handleChange(mql);

        // 이벤트 리스너 대신 미디어쿼리 브레이크포인트 변경 감지 사용 (성능 최적화)
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

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

    // 하이드레이션 에러 방지를 위해 서버에서는 단순히 img태그만 렌더링하고, 클라이언트에서만 Zoom 렌더링
    if (!isMounted) {
        return imgElement;
    }

    return (
        <Zoom wrapElement="span" zoomMargin={margin}>
            {imgElement}
        </Zoom>
    );
}
