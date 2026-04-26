"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  suffixFor?: Record<number, ReactNode>;
}

export default function TypingAnimation({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = "",
  suffixFor,
}: TypingAnimationProps) {
  const stateRef = useRef({
    currentTextIndex: 0,
    currentText: "",
    isDeleting: false,
  });
  const [displayProps, setDisplayProps] = useState({ text: "", textIndex: 0 });

  useEffect(() => {
    const state = stateRef.current;
    let timeoutId: NodeJS.Timeout;

    const updateText = () => {
      const text = texts[state.currentTextIndex];

      if (!state.isDeleting) {
        if (state.currentText.length < text.length) {
          state.currentText = text.slice(0, state.currentText.length + 1);
          setDisplayProps({ text: state.currentText, textIndex: state.currentTextIndex });
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
          setDisplayProps({ text: state.currentText, textIndex: state.currentTextIndex });
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
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="inline-block whitespace-pre">
        {displayProps.text}
        <span className="animate-pulse">|</span>
      </span>
      {suffixFor && suffixFor[displayProps.textIndex] && (
        <span className="inline-flex items-center shrink-0">
          {suffixFor[displayProps.textIndex]}
        </span>
      )}
    </span>
  );
}
