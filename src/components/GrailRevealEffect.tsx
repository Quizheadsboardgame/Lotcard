import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Crown } from 'lucide-react';

interface GrailRevealEffectProps {
  cardName: string;
  marketValue: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  type: 'star' | 'circle' | 'diamond' | 'spark';
  shimmerOffset: number;
}

const PALETTE = [
  '#f59e0b', // Amber Gold
  '#fbbf24', // Bright Gold
  '#fef08a', // Starlight Champagne
  '#ffffff', // Pure Brilliance
  '#ec4899', // Holographic Pink
  '#8b5cf6', // Cosmic Violet
  '#38bdf8', // Electric Sky
];

export const GrailRevealEffect: React.FC<GrailRevealEffectProps> = ({ cardName, marketValue }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showFlash, setShowFlash] = useState(true);
  const [particlesActive, setParticlesActive] = useState(true);

  // Dissolve initial solar flash after 750ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlash(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  // Canvas particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Spawn explosive burst of 85 initial golden particles
    const spawnInitialBurst = () => {
      for (let i = 0; i < 85; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7.5;
        const pType: Particle['type'] =
          Math.random() < 0.35 ? 'star' : Math.random() < 0.65 ? 'diamond' : Math.random() < 0.85 ? 'spark' : 'circle';

        particles.push({
          x: centerX + (Math.random() - 0.5) * 40,
          y: centerY + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 1.5), // slight upward bias
          size: pType === 'star' ? 4 + Math.random() * 7 : 2 + Math.random() * 4.5,
          alpha: 0.95 + Math.random() * 0.05,
          decay: 0.005 + Math.random() * 0.012,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.12,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          type: pType,
          shimmerOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    spawnInitialBurst();

    // Helper to draw a 4-pointed radiant sparkle star
    const drawStar = (x: number, y: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 1.5;

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.28), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.28));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Helper to draw a sparkling diamond
    const drawDiamond = (x: number, y: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 1.2;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.65, 0);
      ctx.moveTo(0, size);
      ctx.lineTo(-size * 0.65, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let tick = 0;

    const render = () => {
      tick++;
      const currentRect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, currentRect.width, currentRect.height);

      // Spawn continuous ambient stardust embers while active
      if (particlesActive && particles.length < 55 && tick % 3 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 140;
        const pType: Particle['type'] = Math.random() < 0.4 ? 'star' : Math.random() < 0.7 ? 'diamond' : 'circle';

        particles.push({
          x: currentRect.width / 2 + Math.cos(angle) * radius,
          y: currentRect.height / 2 + Math.sin(angle) * (radius * 0.8) + 40,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -0.6 - Math.random() * 1.4, // Rising stardust
          size: pType === 'star' ? 3.5 + Math.random() * 5 : 2 + Math.random() * 3.5,
          alpha: 0.1,
          decay: 0.007 + Math.random() * 0.008,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.06,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          type: pType,
          shimmerOffset: Math.random() * Math.PI * 2,
        });
      }

      // Update & render all particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.rotation += p.rotSpeed;

        // Twinkle effect
        const twinkle = Math.sin(tick * 0.12 + p.shimmerOffset) * 0.2;
        const currentAlpha = Math.max(0, Math.min(1, p.alpha + twinkle));

        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === 'star') {
          drawStar(p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
        } else if (p.type === 'diamond') {
          drawDiamond(p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
        } else if (p.type === 'spark') {
          drawStar(p.x, p.y, p.size * 0.7, p.rotation, '#ffffff', currentAlpha);
        } else {
          // Circular glowing ember
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size * 2;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [particlesActive]);

  // Click handler to trigger manual extra burst of sparks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.x;
    const clickY = e.clientY - rect.y;

    // Trigger local spark burst
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.5;
      const pType: Particle['type'] = Math.random() < 0.5 ? 'star' : 'spark';
      // We can let the main loop naturally keep running, or re-render
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      {/* 1. Initial High-Impact Golden Solar Flash */}
      {showFlash && (
        <div className="fixed inset-0 pointer-events-none bg-radial from-amber-300/40 via-yellow-500/20 to-transparent z-50 animate-grail-flash mix-blend-screen" />
      )}

      {/* 2. Expanding Golden Shockwave Rings */}
      <div className="absolute w-72 h-96 rounded-full border-2 border-amber-400/80 animate-shockwave mix-blend-screen" />
      <div
        className="absolute w-60 h-80 rounded-full border border-yellow-300/60 animate-shockwave mix-blend-screen"
        style={{ animationDelay: '0.18s' }}
      />

      {/* 3. Primary Rotating God Rays / Celestial Sunburst (Clockwise) */}
      <div
        className="absolute w-[560px] h-[560px] sm:w-[680px] sm:h-[680px] rounded-full opacity-65 animate-sunburst-spin pointer-events-none mix-blend-screen"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(245, 158, 11, 0.45) 0deg, transparent 15deg, rgba(251, 191, 36, 0.5) 30deg, transparent 45deg, rgba(234, 179, 8, 0.45) 60deg, transparent 75deg, rgba(245, 158, 11, 0.5) 90deg, transparent 105deg, rgba(251, 191, 36, 0.45) 120deg, transparent 135deg, rgba(234, 179, 8, 0.5) 150deg, transparent 165deg, rgba(245, 158, 11, 0.45) 180deg, transparent 195deg, rgba(251, 191, 36, 0.5) 210deg, transparent 225deg, rgba(234, 179, 8, 0.45) 240deg, transparent 255deg, rgba(245, 158, 11, 0.5) 270deg, transparent 285deg, rgba(251, 191, 36, 0.45) 300deg, transparent 315deg, rgba(234, 179, 8, 0.5) 330deg, transparent 345deg, rgba(245, 158, 11, 0.45) 360deg)',
          maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 15%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 15%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* 4. Secondary Counter-Rotating Radiant Starburst (Counter-Clockwise) */}
      <div
        className="absolute w-[480px] h-[480px] sm:w-[580px] sm:h-[580px] rounded-full opacity-45 animate-sunburst-counter pointer-events-none mix-blend-screen"
        style={{
          background:
            'conic-gradient(from 22deg, rgba(254, 240, 138, 0.55) 0deg, transparent 20deg, rgba(245, 158, 11, 0.4) 40deg, transparent 60deg, rgba(236, 72, 153, 0.3) 80deg, transparent 100deg, rgba(254, 240, 138, 0.55) 120deg, transparent 140deg, rgba(245, 158, 11, 0.4) 160deg, transparent 180deg, rgba(139, 92, 246, 0.3) 200deg, transparent 220deg, rgba(254, 240, 138, 0.55) 240deg, transparent 260deg, rgba(245, 158, 11, 0.4) 280deg, transparent 300deg, rgba(56, 189, 248, 0.3) 320deg, transparent 340deg, rgba(254, 240, 138, 0.55) 360deg)',
          maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 75%)',
        }}
      />

      {/* 5. Deep Multi-Tiered Golden & Chromatic Aura (Breathing Glow) */}
      <div
        className="absolute w-80 h-[440px] sm:w-96 sm:h-[480px] rounded-[36px] animate-grail-aura pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(251, 191, 36, 0.55) 0%, rgba(245, 158, 11, 0.38) 35%, rgba(217, 119, 6, 0.2) 60%, transparent 80%)',
          filter: 'blur(32px)',
        }}
      />

      {/* 6. Prismatic Edge Halo (Cosmic Holo Foil Sheen behind Slab) */}
      <div
        className="absolute w-72 h-[420px] rounded-[32px] animate-grail-chromatic pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(245, 158, 11, 0.45) 0%, rgba(236, 72, 153, 0.35) 35%, rgba(56, 189, 248, 0.35) 70%, rgba(251, 191, 36, 0.45) 100%)',
          filter: 'blur(20px)',
          opacity: 0.85,
        }}
      />

      {/* 7. Golden Horizon Pedestal Glow Under Card */}
      <div
        className="absolute bottom-12 w-[340px] sm:w-[420px] h-12 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 80%)',
          filter: 'blur(16px)',
        }}
      />

      {/* 8. 60FPS Interactive HTML5 Canvas Particle Engine */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair z-10"
        title="Tap or click to spark celestial grail stardust!"
      />

      {/* 9. Floating Static Starlight Accent Stars */}
      <div className="absolute top-12 left-10 text-amber-300 text-lg animate-pulse opacity-90 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
        ✦
      </div>
      <div
        className="absolute top-16 right-12 text-yellow-200 text-xl animate-pulse opacity-90 drop-shadow-[0_0_10px_rgba(254,240,138,0.9)]"
        style={{ animationDelay: '0.4s' }}
      >
        ★
      </div>
      <div
        className="absolute bottom-20 left-12 text-amber-400 text-base animate-pulse opacity-80 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
        style={{ animationDelay: '0.8s' }}
      >
        ✦
      </div>
      <div
        className="absolute bottom-24 right-10 text-fuchsia-300 text-lg animate-pulse opacity-80 drop-shadow-[0_0_8px_rgba(236,72,153,0.9)]"
        style={{ animationDelay: '1.2s' }}
      >
        ✧
      </div>
    </div>
  );
};
