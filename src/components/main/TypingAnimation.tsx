"use client";

import { useEffect, useRef } from "react";

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function TypingAnimation({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = "",
}: TypingAnimationProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef({
    currentTextIndex: 0,
    currentText: "",
    isDeleting: false,
  });

  useEffect(() => {
    const state = stateRef.current;
    let timeoutId: NodeJS.Timeout;

    const updateText = () => {
      const text = texts[state.currentTextIndex];

      if (!state.isDeleting) {
        if (state.currentText.length < text.length) {
          state.currentText = text.slice(0, state.currentText.length + 1);
          if (containerRef.current) {
            containerRef.current.firstChild!.textContent = state.currentText;
          }
          timeoutId = setTimeout(updateText, typingSpeed);
        } else {
          timeoutId = setTimeout(() => {
            state.isDeleting = true;
            updateText();
          }, pauseDuration);
        }
      } else {
        if (state.currentText.length > 0) {
          state.currentText = text.slice(0, state.currentText.length - 1);
          if (containerRef.current) {
            containerRef.current.firstChild!.textContent = state.currentText;
          }
          timeoutId = setTimeout(updateText, deletingSpeed);
        } else {
          state.isDeleting = false;
          state.currentTextIndex = (state.currentTextIndex + 1) % texts.length;
          timeoutId = setTimeout(updateText, typingSpeed);
        }
      }
    };

    timeoutId = setTimeout(updateText, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span ref={containerRef} className={className}>
      {stateRef.current.currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
