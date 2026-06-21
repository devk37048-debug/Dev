import React, { useEffect, useRef } from "react";

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track scroll for camera movement trigger
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initialize 3D particles & shapes
    interface Particle {
      x: number;
      y: number;
      z: number; // depth
      ox: number; 
      oy: number;
      size: number;
      color: string;
      speed: number;
    }

    interface HShape {
      x: number;
      y: number;
      z: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      connections: number;
    }

    const particles: Particle[] = [];
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 1000 + 100,
        ox: Math.random() * width,
        oy: Math.random() * height,
        size: Math.random() * 2 + 1,
        color: `rgba(0, 229, 255, ${Math.random() * 0.4 + 0.1})`,
        speed: Math.random() * 0.8 + 0.2,
      });
    }

    const shapes: HShape[] = [];
    const shapeCount = 6;
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * 600 + 100,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        connections: Math.floor(Math.random() * 3) + 3, // 3 to 5 sides (triangles, quads, pentagons)
      });
    }

    // Loop
    const render = () => {
      // Background base
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const camX = (mouse.x - width / 2) * -0.15;
      const camY = (mouse.y - height / 2) * -0.15 + scrollY * 0.4;

      // Draw subtle grid
      ctx.strokeStyle = "rgba(123, 97, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      const gridOffsetX = camX % gridSize;
      const gridOffsetY = camY % gridSize;

      for (let x = gridOffsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridOffsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Perspective Tunnel Warp lines
      ctx.strokeStyle = "rgba(0, 229, 255, 0.015)";
      ctx.lineWidth = 1.5;
      const centerX = width / 2 + camX * 0.5;
      const centerY = height / 2 + (camY - scrollY * 0.4) * 0.5;
      const warpCount = 12;
      for (let j = 0; j < warpCount; j++) {
        const angle = (j / warpCount) * Math.PI * 2 + (scrollY * 0.0003);
        const distance = Math.max(width, height) * 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * distance, centerY + Math.sin(angle) * distance);
        ctx.stroke();
      }

      // Draw and update 3D elements
      particles.forEach((p) => {
        // move closer (simulate moving forward)
        p.z -= p.speed * (1 + scrollY * 0.01); // accelerations during scroll
        if (p.z <= 0) {
          p.z = 1000;
          p.x = Math.random() * width - width / 2;
          p.y = Math.random() * height - height / 2;
        }

        // Project 3D to 2D
        const fov = 400; // Focal length
        const scale = fov / (fov + p.z);
        const projectedX = width / 2 + (p.x + camX) * scale;
        const projectedY = height / 2 + (p.y + camY * 0.5) * scale;

        // Draw particle
        if (projectedX >= 0 && projectedX <= width && projectedY >= 0 && projectedY <= height) {
          const alpha = (1 - p.z / 1000) * 0.6;
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, p.size * scale * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00E5FF";
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Holographic Floating Shapes
      shapes.forEach((s) => {
        s.rotation += s.rotationSpeed;
        
        // Dynamic horizontal/vertical floating drift
        const fov = 400;
        const scale = fov / (fov + s.z);
        const projectedX = width / 2 + (s.x + camX * 0.7) * scale;
        const projectedY = height / 2 + (s.y + camY * 0.3) * scale;

        const currentSize = s.size * scale;

        if (projectedX >= -200 && projectedX <= width + 200 && projectedY >= -200 && projectedY <= height + 200) {
          const alpha = (1 - s.z / 800) * 0.25;
          ctx.strokeStyle = `rgba(123, 97, 255, ${alpha * 1.2})`;
          ctx.fillStyle = `rgba(123, 97, 255, ${alpha * 0.15})`;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(123, 97, 255, 0.4)";

          ctx.beginPath();
          for (let k = 0; k < s.connections; k++) {
            const angle = s.rotation + (k / s.connections) * Math.PI * 2;
            const px = projectedX + Math.cos(angle) * currentSize;
            const py = projectedY + Math.sin(angle) * currentSize;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Draw little node terminals at vertices
          ctx.shadowBlur = 0; // reset
          ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 2.0})`;
          for (let k = 0; k < s.connections; k++) {
            const angle = s.rotation + (k / s.connections) * Math.PI * 2;
            const px = projectedX + Math.cos(angle) * currentSize;
            const py = projectedY + Math.sin(angle) * currentSize;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Subtle digital HUD telemetry text floating next to hologram
          ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 0.7})`;
          ctx.font = "9px monospace";
          ctx.fillText(`SYS.NODE_${Math.floor(s.z)}`, projectedX + currentSize + 10, projectedY - 10);
          ctx.fillText(`Z_DEPTH: ${Math.floor(s.z)}M`, projectedX + currentSize + 10, projectedY);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(projectedX + 5, projectedY - 12);
          ctx.lineTo(projectedX + currentSize + 8, projectedY - 12);
          ctx.stroke();
        }
      });

      // Interactive mouse bloom indicator if mouse is active
      if (mouse.active) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0, 229, 255, 0.4)";
        ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 229, 255, 0.4)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
}
