import { cn } from "@/lib/utils";
import Link from "next/link";
import { Github, Instagram, Mail } from "lucide-react";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "fixed bottom-4 left-0 w-full flex flex-col items-center justify-center gap-3 pointer-events-auto z-50",
        className
      )}
    >
      <div className="flex items-center gap-5 text-muted">
        <Link
          href="https://github.com/dohwi"
          target="_blank"
          aria-label="GitHub"
          className="hover:text-foreground transition-colors p-1"
        >
          <Github className="w-4 h-4" />
        </Link>
        <Link
          href="https://instagram.com/dohvvi"
          target="_blank"
          aria-label="Instagram"
          className="hover:text-foreground transition-colors p-1"
        >
          <Instagram className="w-4 h-4" />
        </Link>
        <Link
          href="https://threads.net/@dohvvi"
          target="_blank"
          aria-label="Threads"
          className="hover:text-foreground transition-colors p-1 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12V14.5C7 15.8807 8.11929 17 9.5 17V17C10.8807 17 12 15.8807 12 14.5V10.5C12 9.11929 13.1193 8 14.5 8V8C15.8807 8 17 9.11929 17 10.5V17" />
            <path d="M12 13V12" />
          </svg>
        </Link>
        <Link
          href="mailto:me@dohwi.com"
          aria-label="Email"
          className="hover:text-foreground transition-colors p-1"
        >
          <Mail className="w-4 h-4" />
        </Link>
      </div>
      <div className="text-[10px] text-muted tracking-wider">
        © {new Date().getFullYear()} DOHWI. All Rights Reserved.
      </div>
    </footer>
  );
}


