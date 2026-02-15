import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "fixed bottom-4 left-0 w-full text-center text-sm text-muted pointer-events-auto z-50",
        className
      )}
    >
      © {new Date().getFullYear()} dohwi
    </footer>
  );
}
