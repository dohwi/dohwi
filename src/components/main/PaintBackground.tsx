"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Blob {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  targetRadius: number;
  colorIndex: number;
  points: { angle: number; length: number }[];
  rotation: number;
  rotationSpeed: number;
}

export default function PaintBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  const lightColors = [
    [162, 155, 254, 0.4],
    [116, 185, 255, 0.4],
    [129, 236, 236, 0.4],
    [253, 121, 168, 0.4],
    [108, 92, 231, 0.3],
    [223, 249, 251, 0.4],
  ];

  const darkColors = [
    [80, 80, 160, 0.2],
    [60, 100, 160, 0.2],
    [50, 120, 140, 0.2],
    [100, 70, 140, 0.2],
    [70, 90, 120, 0.2],
    [40, 40, 80, 0.2],
  ];

  const currentColorsRef = useRef<number[][]>(
    resolvedTheme === "dark"
      ? darkColors.map((c) => [...c])
      : lightColors.map((c) => [...c])
  );

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) return;

      blobsRef.current.forEach((blob) => {
        blob.colorIndex += Math.floor(Math.random() * 3) + 1;
        blob.targetRadius = 100 + Math.random() * 200;
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const createBlob = (width: number, height: number, index: number): Blob => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.min(width, height) * 0.15;

      const targetX = width / 2 + Math.cos(angle) * distance;
      const targetY = height / 2 + Math.sin(angle) * distance;

      const pointCount = 8 + Math.floor(Math.random() * 5);
      const points: { angle: number; length: number }[] = [];
      for (let j = 0; j < pointCount; j++) {
        points.push({
          angle: (j / pointCount) * Math.PI * 2,
          length: 0.8 + Math.random() * 0.4,
        });
      }

      return {
        x: width / 2,
        y: height / 2,
        targetX,
        targetY,
        radius: 0,
        targetRadius: 100 + Math.random() * 200,
        colorIndex: index,
        points,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
      };
    };

    const initBlobs = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      const newBlobs: Blob[] = [];
      const blobCount = 12;

      for (let i = 0; i < blobCount; i++) {
        newBlobs.push(createBlob(width, height, i));
      }
      blobsRef.current = newBlobs;
    };

    const colorStringsCache: string[] = new Array(
      Math.max(lightColors.length, darkColors.length)
    );
    const cosCache: number[] = [];
    const sinCache: number[] = [];

    const drawBlob = (
      ctx: CanvasRenderingContext2D,
      blob: Blob,
      currentColors: string[]
    ) => {
      ctx.save();
      ctx.translate(blob.x, blob.y);
      ctx.rotate(blob.rotation);

      ctx.fillStyle = currentColors[blob.colorIndex % currentColors.length];

      ctx.beginPath();
      const points = blob.points;
      const len = points.length;

      if (len === 0) {
        ctx.restore();
        return;
      }

      cosCache.length = len;
      sinCache.length = len;
      for (let i = 0; i < len; i++) {
        const p = points[i];
        cosCache[i] = Math.cos(p.angle) * p.length * blob.radius;
        sinCache[i] = Math.sin(p.angle) * p.length * blob.radius;
      }

      const lastX = cosCache[len - 1];
      const lastY = sinCache[len - 1];
      const firstX = cosCache[0];
      const firstY = sinCache[0];

      const startX = (lastX + firstX) / 2;
      const startY = (lastY + firstY) / 2;

      ctx.moveTo(startX, startY);

      for (let i = 0; i < len; i++) {
        const currX = cosCache[i];
        const currY = sinCache[i];
        const nextX = cosCache[(i + 1) % len];
        const nextY = sinCache[(i + 1) % len];
        const midX = (currX + nextX) / 2;
        const midY = (currY + nextY) / 2;
        ctx.quadraticCurveTo(currX, currY, midX, midY);
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      const targetColors =
        themeRef.current === "dark" ? darkColors : lightColors;

      const current = currentColorsRef.current;
      for (let i = 0; i < current.length; i++) {
        const currArr = current[i];
        const targetArr = targetColors[i];
        for (let j = 0; j < currArr.length; j++) {
          currArr[j] = currArr[j] + (targetArr[j] - currArr[j]) * 0.04;
        }
        colorStringsCache[i] = `rgba(${Math.round(currArr[0])}, ${Math.round(
          currArr[1]
        )}, ${Math.round(currArr[2])}, ${currArr[3]})`;
      }

      blobsRef.current.forEach((blob) => {
        const tx = blob.targetX;
        const ty = blob.targetY;

        blob.x += (tx - blob.x) * 0.05;
        blob.y += (ty - blob.y) * 0.05;
        blob.radius += (blob.targetRadius - blob.radius) * 0.04;
        blob.rotation += blob.rotationSpeed;

        drawBlob(ctx, blob, colorStringsCache);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;

      blobsRef.current.forEach((blob) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(width, height) * 0.15;
        blob.targetX = width / 2 + Math.cos(angle) * distance;
        blob.targetY = height / 2 + Math.sin(angle) * distance;
      });
    };

    handleResize();
    initBlobs();

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
        filter: "blur(30px)",
        opacity: 0.8,
      }}
    />
  );
}
