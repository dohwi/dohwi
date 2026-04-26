import Link from "next/link";
import Footer from "@/components/common/Footer";
import Image from "next/image";

import PaintBackground from "@/components/main/PaintBackground";
import TypingAnimation from "@/components/main/TypingAnimation";
import ThemeToggle from "@/components/common/ThemeToggle";

const ROTATING_TEXTS = [
  "안녕하세요",
  "반가워요",
  "환영합니다",
];

const WAVE_IMG = "/wave-hand.png";

const WAVE_CLASS = "inline-block ml-2 w-[0.85em] h-[0.85em] align-middle";

const WAVE_SUFFIX = <Image src={WAVE_IMG} alt="" width={48} height={48} className={WAVE_CLASS} priority />;

const TYPING_SUFFIX: Record<number, React.ReactNode> = {
  0: WAVE_SUFFIX,
  1: WAVE_SUFFIX,
  2: WAVE_SUFFIX,
};

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      <PaintBackground />

      <div className="absolute top-0 left-0 w-full z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-end">
          <ThemeToggle variant="ghost" className="hover:bg-transparent" />
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-4 select-none pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg mx-auto text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 leading-[1.3]">
            <span className="relative block" style={{ height: "1.3em" }}>
              <span className="absolute top-0 left-0 flex items-center">
                <TypingAnimation texts={ROTATING_TEXTS} suffixFor={TYPING_SUFFIX} />
              </span>
            </span>
            <span className="text-accent">김도휘</span>입니다
          </h1>

          <div className="text-center mt-6">
            <p className="text-base sm:text-lg text-foreground/80 mb-6">
              새로운 것을 즐기고, 경험을 공유합니다.
            </p>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-accent transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
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
