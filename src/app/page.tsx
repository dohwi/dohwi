import Link from "next/link";
import Footer from "@/components/common/Footer";

import PaintBackground from "@/components/main/PaintBackground";
import TypingAnimation from "@/components/main/TypingAnimation";
import ThemeToggle from "@/components/common/ThemeToggle";

const ROTATING_TEXTS = [
  "프론트엔드 개발자",
  "백엔드 개발자",
  "풀스택 개발자",
  "바이브 코더",
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      <PaintBackground />

      <div className="absolute top-0 left-0 w-full z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-end">
          <ThemeToggle variant="ghost" className="hover:bg-transparent" />
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-4 text-center select-none pointer-events-none">
        {/* pointer-events-auto for interactive elements */}
        <div className="pointer-events-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            안녕하세요, <span className="text-accent">도휘</span>입니다
          </h1>

          <div className="text-xl sm:text-2xl md:text-3xl text-foreground font-medium min-h-[2em] flex items-center justify-center">
            <TypingAnimation texts={ROTATING_TEXTS} />
          </div>

          <p className="max-w-md mx-auto text-base sm:text-lg text-foreground/80 mt-4 mb-8 text-center">
            도휘닷컴에 오신 것을 환영합니다.
            <br />
            코딩을 즐기는 사람입니다 :)
          </p>

          <div className="flex items-center justify-center">
            <Link
              href="/blog"
              className="group flex items-center gap-2 text-lg font-semibold text-foreground hover:text-accent transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              <span>블로그 방문하기</span>
              <span className="transform transition-transform group-hover:translate-x-1 duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>

      <Footer className="border-none bg-transparent" />
    </div>
  );
}
