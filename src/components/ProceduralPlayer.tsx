import React, { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface ProceduralPlayerProps {
  proceduralType: "ring" | "particles" | "sine" | "dna" | "matrix" | "quantum" | "gravity" | "hologram";
  color: string;
  secondaryColor?: string;
  speedMultiplier: number;
  glowOn: boolean;
  intensity: number; // 1 to 5 scale
  isPlaying: boolean;
  onDimensionsReport?: (width: number, height: number) => void;
}

export default function ProceduralPlayer({
  proceduralType,
  color,
  secondaryColor = "#7B61FF",
  speedMultiplier,
  glowOn,
  intensity,
  isPlaying,
  onDimensionsReport,
}: ProceduralPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 640);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);
    if (onDimensionsReport) onDimensionsReport(width, height);

    // Track resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (!canvas) continue;
        width = canvas.width = entry.contentRect.width || 640;
        height = canvas.height = entry.contentRect.height || 360;
        if (onDimensionsReport) onDimensionsReport(width, height);
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let frameCount = 0;

    // Local data structure initialized per type
    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string }> = [];
    if (proceduralType === "particles" || proceduralType === "quantum" || proceduralType === "dna" || proceduralType === "gravity") {
      const pCount = proceduralType === "particles" ? 80 : 40;
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          r: Math.random() * 3 + 1,
          color: Math.random() > 0.4 ? color : secondaryColor,
        });
      }
    }

    const matrixDrops: Array<{ x: number; y: number; speed: number; chars: string[] }> = [];
    if (proceduralType === "matrix") {
      const cols = Math.floor(width / 16);
      for (let i = 0; i < cols; i++) {
        matrixDrops.push({
          x: i * 16,
          y: Math.random() * -height,
          speed: Math.random() * 3 + 2,
          chars: Array.from({ length: 15 }, () => Math.random() > 0.5 ? "1" : "0"),
        });
      }
    }

    // Render loop
    const render = () => {
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        frameCount += speedMultiplier;
      }

      ctx.save();
      if (glowOn) {
        ctx.shadowBlur = intensity * 4;
        ctx.shadowColor = color;
      } else {
        ctx.shadowBlur = 0;
      }

      // Ring Procedural
      if (proceduralType === "ring") {
        const cx = width / 2;
        const cy = height / 2;
        const maxRadius = Math.min(width, height) * 0.35;

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 + intensity * 0.5;

        // Draw multiple orbiting ring components
        const ringCount = 3 + Math.floor(intensity / 1.5);
        for (let r = 0; r < ringCount; r++) {
          const radius = maxRadius * (1 - r * 0.22);
          const spin = (frameCount * 0.015 * (1 + r * 0.2)) / (r + 1);

          ctx.beginPath();
          ctx.arc(cx, cy, radius, spin, spin + Math.PI * 1.5);
          ctx.stroke();

          // Satellite ticks
          ctx.fillStyle = secondaryColor;
          ctx.beginPath();
          ctx.arc(
            cx + Math.cos(spin + Math.PI * 1.5) * radius,
            cy + Math.sin(spin + Math.PI * 1.5) * radius,
            3 + intensity * 0.5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Concentric geometric inner ring
        ctx.strokeStyle = `${secondaryColor}44`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius * 0.12, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        const crossLength = maxRadius * 1.2;
        ctx.strokeStyle = `${color}22`;
        ctx.beginPath();
        // Horizontal
        ctx.moveTo(cx - crossLength, cy);
        ctx.lineTo(cx + crossLength, cy);
        // Vertical
        ctx.moveTo(cx, cy - crossLength);
        ctx.lineTo(cx, cy + crossLength);
        ctx.stroke();
      }

      // Particles Procedural
      else if (proceduralType === "particles") {
        ctx.fillStyle = color;
        particles.forEach((p, idx) => {
          if (isPlaying) {
            p.x += p.vx * speedMultiplier;
            p.y += p.vy * speedMultiplier;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (1 + intensity * 0.15), 0, Math.PI * 2);
          ctx.fill();

          // Draw connections
          for (let j = idx + 1; j < particles.length; j++) {
            const other = particles[j];
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 80 + intensity * 15;

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.35;
              ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
              ctx.lineWidth = 0.5 + intensity * 0.25;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
      }

      // Sine wave / Oscilloscope
      else if (proceduralType === "sine") {
        const cy = height / 2;
        const waveCount = 3 + Math.floor(intensity / 1.5);

        for (let w = 0; w < waveCount; w++) {
          ctx.strokeStyle = w % 2 === 0 ? color : secondaryColor;
          ctx.lineWidth = 1 + w + intensity * 0.3;
          ctx.beginPath();

          const offsetPhase = (w * Math.PI) / 4 + frameCount * 0.05;
          const frequency = 0.005 + w * 0.002;
          const amplitude = (height * 0.22) / (w + 1) * (1 + intensity * 0.15);

          for (let x = 0; x < width; x += 3) {
            const y = cy + Math.sin(x * frequency + offsetPhase) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // DNA Helix
      else if (proceduralType === "dna") {
        const cx = width / 2;
        const cy = height / 2;
        const helixWidth = 140 + intensity * 25;
        const nodeCount = 20;

        ctx.lineWidth = 1.5;

        for (let i = 0; i < nodeCount; i++) {
          const t = i / nodeCount;
          const y = 30 + t * (height - 60);
          const angle = t * Math.PI * 4 + frameCount * 0.04;

          const x1 = cx + Math.sin(angle) * (helixWidth / 2);
          const x2 = cx - Math.sin(angle) * (helixWidth / 2);

          const r1 = 3 + Math.cos(angle) * 1.5;
          const r2 = 3 - Math.cos(angle) * 1.5;

          // Connective rung
          const alphaFactor = (Math.cos(angle) + 2) / 3; // depth feel
          ctx.strokeStyle = `rgba(123, 97, 255, ${0.1 + alphaFactor * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();

          // Left node
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x1, y, r1 * (1 + intensity * 0.25), 0, Math.PI * 2);
          ctx.fill();

          // Right node
          ctx.fillStyle = secondaryColor;
          ctx.beginPath();
          ctx.arc(x2, y, r2 * (1 + intensity * 0.25), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Matrix rain
      else if (proceduralType === "matrix") {
        ctx.font = "14px monospace";
        matrixDrops.forEach((drop) => {
          if (isPlaying) {
            drop.y += drop.speed * speedMultiplier;
            if (drop.y > height) {
              drop.y = Math.random() * -100;
              drop.speed = Math.random() * 3 + 2;
            }
          }

          // Render falling characters
          drop.chars.forEach((char, idx) => {
            const charY = drop.y - idx * 16;
            if (charY > 0 && charY < height) {
              const alpha = 1 - idx / 12;
              ctx.fillStyle = idx === 0 ? "white" : `rgba(${parseInt(color.slice(1,3),16) || 0}, ${parseInt(color.slice(3,5),16) || 229}, ${parseInt(color.slice(5,7),16) || 255}, ${alpha})`;
              ctx.fillText(char, drop.x, charY);

              // Scramble characters randomly
              if (isPlaying && Math.random() > 0.94) {
                drop.chars[idx] = Math.random() > 0.5 ? "1" : "0";
              }
            }
          });
        });
      }

      // Quantum Orbits
      else if (proceduralType === "quantum") {
        const cx = width / 2;
        const cy = height / 2;

        // Big central reactor node
        ctx.fillStyle = color;
        ctx.shadowBlur = intensity * 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        const coreRad = 20 + intensity * 4;
        ctx.arc(cx, cy, coreRad + Math.sin(frameCount * 0.08) * 3, 0, Math.PI * 2);
        ctx.fill();

        // Orbit paths
        ctx.shadowBlur = glowOn ? intensity * 3 : 0;
        const orbitCount = 3;
        for (let i = 0; i < orbitCount; i++) {
          const rx = 100 + i * 40;
          const ry = 40 + i * 15;
          const rot = (i * Math.PI) / 3 + frameCount * 0.005;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);

          // Path ellipse
          ctx.strokeStyle = `rgba(123, 97, 255, 0.2)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Satellite electron
          const angle = frameCount * (0.03 / (i + 1));
          const sx = rx * Math.cos(angle);
          const sy = ry * Math.sin(angle);

          ctx.fillStyle = secondaryColor;
          ctx.beginPath();
          ctx.arc(sx, sy, 5 + intensity * 0.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // Gravity black hole grid
      else if (proceduralType === "gravity") {
        const cx = width / 2;
        const cy = height / 2;
        const rowStep = 30;
        const colStep = 30;

        ctx.strokeStyle = `${color}44`;
        ctx.lineWidth = 1;

        // Draw distorted grid mesh
        for (let j = 0; j < height; j += rowStep) {
          ctx.beginPath();
          for (let i = 0; i <= width; i += 15) {
            const dx = i - cx;
            const dy = j - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const rawWarp = (7000 / (dist + 40)) * (intensity * 0.6);
            const actualWarp = Math.min(rawWarp, dist); // prevent extreme jumps
            const angle = Math.atan2(dy, dx);

            // warp particles toward black-hole center
            const x = i - Math.cos(angle) * actualWarp * (0.5 + Math.sin(frameCount * 0.02) * 0.1);
            const y = j - Math.sin(angle) * actualWarp * (0.5 + Math.sin(frameCount * 0.02) * 0.1);

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Draw intense grid columns
        for (let i = 0; i < width; i += colStep) {
          ctx.beginPath();
          for (let j = 0; j <= height; j += 15) {
            const dx = i - cx;
            const dy = j - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const rawWarp = (7000 / (dist + 40)) * (intensity * 0.6);
            const actualWarp = Math.min(rawWarp, dist);
            const angle = Math.atan2(dy, dx);

            const x = i - Math.cos(angle) * actualWarp * (0.5 + Math.sin(frameCount * 0.02) * 0.1);
            const y = j - Math.sin(angle) * actualWarp * (0.5 + Math.sin(frameCount * 0.02) * 0.1);

            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Draw event horizon singularity
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2 + intensity * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 18 + intensity * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Holographic Scanner Wireframe
      else if (proceduralType === "hologram") {
        const cx = width / 2;
        const cy = height / 2;
        const boxSize = 80 + intensity * 15;

        // Draw wireframe rotating 3D box projected to 2D
        const rotX = frameCount * 0.01;
        const rotY = frameCount * 0.015;

        const vertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
        ];

        const edges = [
          [0,1], [1,2], [2,3], [3,0], // back
          [4,5], [5,6], [6,7], [7,4], // front
          [0,4], [1,5], [2,6], [3,7]  // depths
        ];

        const projected: Array<{x: number; y: number}> = [];

        vertices.forEach((v) => {
          // X rotation
          let y1 = v[1] * Math.cos(rotX) - v[2] * Math.sin(rotX);
          let z1 = v[1] * Math.sin(rotX) + v[2] * Math.cos(rotX);
          // Y rotation
          let x2 = v[0] * Math.cos(rotY) + z1 * Math.sin(rotY);
          let z2 = -v[0] * Math.sin(rotY) + z1 * Math.cos(rotY);

          // Project
          const dist = 3.0; // camera distance
          const xProj = cx + (x2 / (z2 + dist)) * boxSize * 2.5;
          const yProj = cy + (y1 / (z2 + dist)) * boxSize * 2.5;

          projected.push({ x: xProj, y: yProj });
        });

        // Draw edges
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        edges.forEach((e) => {
          ctx.beginPath();
          ctx.moveTo(projected[e[0]].x, projected[e[0]].y);
          ctx.lineTo(projected[e[1]].x, projected[e[1]].y);
          ctx.stroke();
        });

        // Draw horizontal scan beam scanning recursively
        const beamY = cy + Math.sin(frameCount * 0.06) * (boxSize * 1.25);
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = secondaryColor;
        ctx.beginPath();
        ctx.moveTo(cx - boxSize * 1.8, beamY);
        ctx.lineTo(cx + boxSize * 1.8, beamY);
        ctx.stroke();

        ctx.fillStyle = `rgba(${parseInt(secondaryColor.slice(1,3),16) || 123}, ${parseInt(secondaryColor.slice(3,5),16) || 97}, ${parseInt(secondaryColor.slice(5,7),16) || 255}, 0.08)`;
        ctx.fillRect(cx - boxSize * 1.5, Math.min(cy - boxSize, beamY), boxSize * 3, Math.abs(beamY - (cy - boxSize)));
      }

      ctx.restore();

      // Telemetry HUD Labels (Overlay)
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px monospace";
      ctx.globalAlpha = 0.4;
      ctx.fillText(`FPS: 60.0`, 16, 22);
      ctx.fillText(`RENDER_MODE: CORE_GPU`, 16, 36);
      ctx.fillText(`VECTOR_TYPE: ${proceduralType.toUpperCase()}`, 16, 50);

      const statusText = isPlaying ? "SAMPLING..." : "PAUSED (BUFF)";
      ctx.fillStyle = isPlaying ? "#00FF66" : "#FFB400";
      ctx.fillText(`STATUS: [${statusText}]`, width - 120, 22);

      ctx.globalAlpha = 1.0; // reset
      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
    };
  }, [proceduralType, color, secondaryColor, speedMultiplier, glowOn, intensity, isPlaying]);

  return (
    <div ref={containerRef} className="w-full h-full relative group bg-black rounded-2xl overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
    </div>
  );
}
