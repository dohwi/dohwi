import Link from "next/link";

import ParticleBackground from "@/components/main/ParticleBackground";
import TypingAnimation from "@/components/main/TypingAnimation";

const ROTATING_TEXTS = [
  "Frontend Developer",
  "Creative Coder",
  "Problem Solver",
  "Tech Enthusiast",
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleBackground />

      <main className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          Hello, I&apos;m{" "}
          <span className="text-accent">dohwi</span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl text-muted min-h-[2em]">
          <TypingAnimation texts={ROTATING_TEXTS} />
        </p>

        <p className="max-w-md text-base sm:text-lg text-muted/80">
          Welcome to my personal space. I build things for the web and share my thoughts here.
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            href="/blog"
            className="px-6 py-3 bg-accent text-white rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg"
          >
            Visit Blog
          </Link>
          <a
            href="https://github.com/dohwi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-border text-foreground rounded-full font-medium transition-all hover:bg-foreground hover:text-background"
          >
            GitHub
          </a>
        </div>
      </main>

      <footer className="absolute bottom-4 text-sm text-muted/60">
        © {new Date().getFullYear()} dohwi.com
      </footer>
    </div>
  );
}
