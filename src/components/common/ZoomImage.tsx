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
        <figure className={cn("mx-auto max-w-full inline-block rounded-lg border border-border bg-muted/20 overflow-hidden", className)}>
            <Zoom wrapElement="span" zoomMargin={margin}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt || ""}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full h-auto object-contain block"
                    {...props}
                />
            </Zoom>
        </figure>
    );
}
