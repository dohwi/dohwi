"use client";

import {
  createContext,
  useEffect,
  useState,
  use,
  type ReactNode,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/hooks/useHydrated";

interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  animate: boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModal() {
  const context = use(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within Modal.Root");
  }
  return context;
}

interface RootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Root({ isOpen, onClose, children }: RootProps) {
  const mounted = useHydrated();
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (isOpen) {
      // We need to render before we can animate in
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      
      // Double rAF to ensure browser paint has occurred for transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setAnimate(true);
        });
      });
    } else {
      setAnimate(false);
      // Wait for animation to finish before unmounting
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
      }, 300) as unknown as NodeJS.Timeout;
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  if (!mounted || !shouldRender) return null;

  return (
    <ModalContext value={{ isOpen, onClose, animate }}>
      {children}
    </ModalContext>
  );
}

interface OverlayProps {
  className?: string;
}

function Overlay({ className }: OverlayProps) {
  const { onClose, animate } = useModal();

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] transition-opacity duration-300 ease-in-out bg-background/40 backdrop-blur-sm",
        animate ? "opacity-100" : "opacity-0",
        className
      )}
      onClick={onClose}
    />,
    document.body
  );
}

interface ContentProps {
  children: ReactNode;
  className?: string;
}

function Content({ children, className }: ContentProps) {
  const { animate } = useModal();

  return createPortal(
    <div
        className="fixed inset-0 z-[101] flex items-start justify-center pt-24 px-4 pointer-events-none"
    >
      <div
        className={cn(
          "pointer-events-auto relative w-full max-w-2xl bg-background border border-border rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] transform",
          animate
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-8",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

function Header({ children, className }: HeaderProps) {
  return (
    <div className={cn("flex items-center px-4 border-b border-border", className)}>
      {children}
    </div>
  );
}

interface BodyProps {
  children: ReactNode;
  className?: string;
}

function Body({ children, className }: BodyProps) {
  return <div className={cn("max-h-[50vh] overflow-y-auto py-2", className)}>{children}</div>;
}

interface FooterProps {
  children: ReactNode;
  className?: string;
}

function Footer({ children, className }: FooterProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-border bg-background text-xs text-muted flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CloseProps {
  children?: ReactNode;
  className?: string;
}

function Close({ children, className }: CloseProps) {
  const { onClose } = useModal();

  return (
    <button
      onClick={onClose}
      className={cn(
        "text-sm text-muted hover:text-foreground px-2 py-1 rounded transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
    >
      {children || "ESC"}
    </button>
  );
}

export const Modal = {
  Root,
  Overlay,
  Content,
  Header,
  Body,
  Footer,
  Close,
};
