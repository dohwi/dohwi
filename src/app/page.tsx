import Link from "next/link";

import PaintBackground from "@/components/main/PaintBackground";
import TypingAnimation from "@/components/main/TypingAnimation";
import ThemeToggle from "@/components/common/ThemeToggle";

const ROTATING_TEXTS = [
  "프론트엔드 개발자",
  "크리에이티브 코더",
  "문제 해결사",
  "기술 애호가",
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <PaintBackground />
      
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center select-none pointer-events-none">
        {/* pointer-events-auto for interactive elements */}
        <div className="pointer-events-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            안녕하세요, <span className="text-accent">도휘</span>입니다
          </h1>

          <div className="text-xl sm:text-2xl md:text-3xl text-foreground font-medium min-h-[2em] flex items-center justify-center">
            <TypingAnimation texts={ROTATING_TEXTS} />
          </div>

          <p className="max-w-md mx-auto text-base sm:text-lg text-foreground/80 mt-4 mb-8 text-center">
            제 개인 공간에 오신 것을 환영합니다.
            <br className="hidden sm:block" />
            웹을 위한 것들을 만들고 생각을 공유합니다.
          </p>

          <div className="flex items-center justify-center">
            <Link
              href="/blog"
              className="group flex items-center gap-2 text-lg font-semibold text-foreground hover:text-accent transition-colors duration-300"
            >
              <span>블로그 방문하기</span>
              <span className="transform transition-transform group-hover:translate-x-1 duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-4 text-sm text-muted/60 pointer-events-auto">
        © {new Date().getFullYear()} dohwi.com
      </footer>
    </div>
  );
}
