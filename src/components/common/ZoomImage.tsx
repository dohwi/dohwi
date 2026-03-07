"use client";

import { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";

export function ZoomImage({
    src,
    alt,
    className,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
    const [margin, setMargin] = useState(45);

    useEffect(() => {
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

    if (!src) return null;

    return (
        <Zoom wrapElement="span" zoomMargin={margin}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt || ""}
                loading="lazy"
                decoding="async"
                className={cn("mx-auto max-w-full h-auto rounded-lg object-contain", className)}
                {...props}
            />
        </Zoom>
    );
}
