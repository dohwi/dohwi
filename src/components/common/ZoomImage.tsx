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
        const updateMargin = () => {
            setMargin(window.innerWidth < 640 ? 0 : 45);
        };

        // 초기 설정
        updateMargin();

        window.addEventListener("resize", updateMargin);
        return () => window.removeEventListener("resize", updateMargin);
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
                className={cn("mx-auto max-w-full h-auto rounded-lg border border-border bg-muted/20 object-contain", className)}
                {...props}
            />
        </Zoom>
    );
}
