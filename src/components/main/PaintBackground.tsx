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
  const mouseRef = useRef({ x: 0, y: 0 }); // To track mouse position
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  // Update theme ref when it changes to avoid re-initializing canvas
  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  // Harmonious Pastel Palette (Cool Tones: Blue, Purple, Teal, Pink)
  const lightColors = [
    "rgba(162, 155, 254, 0.4)", // Lavender
    "rgba(116, 185, 255, 0.4)", // Soft Blue
    "rgba(129, 236, 236, 0.4)", // Teal
    "rgba(253, 121, 168, 0.4)", // Pink (Point)
    "rgba(108, 92, 231, 0.3)", // Purple
    "rgba(223, 249, 251, 0.4)", // Ice Blue
  ];

  // Toned Down Palette (Dark Mode) - Cool & Muted tones
  const darkColors = [
    "rgba(80, 80, 160, 0.2)", // Muted Purple
    "rgba(60, 100, 160, 0.2)", // Muted Blue
    "rgba(50, 120, 140, 0.2)", // Muted Teal
    "rgba(100, 70, 140, 0.2)", // Deep Violet
    "rgba(70, 90, 120, 0.2)", // Grey Blue
  ];

  // Handle mouse movement for dragging effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle click to change colors
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Optional: Ignore clicks on interactive elements like buttons/links
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) return;

      blobsRef.current.forEach((blob) => {
        // Shift color index randomly to create a "mysterious" change
        // Add a random offset (1-3) to ensure color always changes
        blob.colorIndex += Math.floor(Math.random() * 3) + 1;
        
        // Also slightly perturb the target size for a "breathing" effect
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
        // Distribute blobs: Keep them closer to the center (text area)
        // Reduced spread factor from 0.4 to 0.15 to keep it tight around text
        const distance = Math.random() * Math.min(width, height) * 0.15;
        
        const targetX = width / 2 + Math.cos(angle) * distance;
        const targetY = height / 2 + Math.sin(angle) * distance;

        // Create organic shape points
        const pointCount = 8 + Math.floor(Math.random() * 5); // 8-12 points
        const points = [];
        for (let j = 0; j < pointCount; j++) {
          points.push({
            angle: (j / pointCount) * Math.PI * 2,
            length: 0.8 + Math.random() * 0.4, // Variation in radius for bumpiness
          });
        }

        return {
          x: width / 2, // All start at center for "explosion" effect
          y: height / 2,
          targetX,
          targetY,
          radius: 0, // Start invisible
          targetRadius: 100 + Math.random() * 200, // Reduced max size
          colorIndex: index, // Store index instead of string
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

    const drawBlob = (ctx: CanvasRenderingContext2D, blob: Blob, currentColors: string[]) => {
      ctx.save();
      ctx.translate(blob.x, blob.y);
      ctx.rotate(blob.rotation);
      
      // Use color based on current mode
      ctx.fillStyle = currentColors[blob.colorIndex % currentColors.length];
      
      ctx.beginPath();
      const points = blob.points;
      
      // Calculate vertices based on current radius
      const vertices = points.map(p => ({
          x: Math.cos(p.angle) * p.length * blob.radius,
          y: Math.sin(p.angle) * p.length * blob.radius
      }));

      if (vertices.length === 0) {
          ctx.restore();
          return;
      }

      // Smooth closed curve using midpoints
      const len = vertices.length;
      const last = vertices[len - 1];
      const first = vertices[0];
      
      // Start at midpoint between last and first
      const startX = (last.x + first.x) / 2;
      const startY = (last.y + first.y) / 2;

      ctx.moveTo(startX, startY);

      for (let i = 0; i < len; i++) {
          const curr = vertices[i];
          const next = vertices[(i + 1) % len];
          const midX = (curr.x + next.x) / 2;
          const midY = (curr.y + next.y) / 2;
          
          // Curve from previous midpoint to next midpoint, using current vertex as control
          ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 'source-over' prevents dark accumulation in the center
      ctx.globalCompositeOperation = "source-over"; 

      // Determine colors based on current theme ref
      const isDark = themeRef.current === 'dark';
      const currentColors = isDark ? darkColors : lightColors;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      blobsRef.current.forEach((blob) => {
        // Animation physics
        // Calculate influence from mouse (pull effect)
        // Vector from center to mouse
        const mouseOffsetX = (mouseX - centerX) * 0.1; // Reduced influence
        const mouseOffsetY = (mouseY - centerY) * 0.1;

        // Base target (original animation)
        const tx = blob.targetX;
        const ty = blob.targetY;
        
        // Removed mouse influence to target
        
        // Ease out position towards target
        blob.x += (tx - blob.x) * 0.05;
        blob.y += (ty - blob.y) * 0.05;
        
        // Ease out radius (growth)
        blob.radius += (blob.targetRadius - blob.radius) * 0.04;
        
        // Constant rotation
        blob.rotation += blob.rotationSpeed;

        drawBlob(ctx, blob, currentColors);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      // Use client dimensions for better mobile support
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      
      canvas.width = width;
      canvas.height = height;

      // Update blobs target to new center
      blobsRef.current.forEach((blob) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(width, height) * 0.15;
        blob.targetX = width / 2 + Math.cos(angle) * distance;
        blob.targetY = height / 2 + Math.sin(angle) * distance;
      });
    };

    handleResize(); // Set initial size
    initBlobs(); // Initialize blobs once

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
        filter: "blur(30px)", // Increased blur for softer, more liquid paint look
        opacity: 0.8
      }} 
    />
  );
}
