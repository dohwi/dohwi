"use client";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";

export function ZoomImage({
    src,
    alt,
    className,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
    if (!src) return null;

    return (
        <Zoom wrapElement="span" zoomMargin={45}>
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
