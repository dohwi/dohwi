"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 초기 상태 확인
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl pointer-events-none z-50 px-4">
      <div className="flex justify-end">
        <button
          onClick={scrollToTop}
          className={cn(
            "p-3 rounded-full bg-background border border-border transition-all duration-300 ease-in-out pointer-events-auto hover:border-accent/50 hover:text-accent hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          )}
          aria-label="맨 위로 이동"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
