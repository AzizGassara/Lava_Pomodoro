import React, { useEffect, useState } from 'react';
import { LavaLampTheme } from '../types';

interface LavaBackgroundProps {
  theme: LavaLampTheme;
}

const LavaBackground: React.FC<LavaBackgroundProps> = ({ theme }) => {
  const [blobs, setBlobs] = useState<Array<{ id: number; left: number; top: number; size: number; duration: number; delay: number; color: string; anim: string }>>([]);

  useEffect(() => {
    // Generate organic blobs
    const count = 10;
    const newBlobs = Array.from({ length: count }).map((_, i) => {
      const isLarge = i < 3; 
      return {
        id: i,
        left: Math.random() * 90 + 5, // Keep somewhat within bounds
        top: Math.random() * 90 + 5,
        size: isLarge ? 300 + Math.random() * 150 : 180 + Math.random() * 100,
        duration: (isLarge ? 25 : 18) + Math.random() * 10,
        delay: Math.random() * -30,
        color: theme.colors[i % theme.colors.length],
        anim: i % 2 === 0 ? 'lava-move-vertical' : 'lava-move-mixed'
      };
    });
    setBlobs(newBlobs);
  }, [theme]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
       {/* Ambient Glow matching the theme */}
       <div 
        className="absolute inset-0 opacity-20 transition-colors duration-[2000ms]"
        style={{ 
            background: `radial-gradient(circle at 50% 50%, ${theme.colors[0]} 0%, transparent 60%)` 
        }} 
       />

       {/* Subtle Breathing Pulse Overlay */}
       <div 
         className="absolute inset-0 opacity-10 breathing-glow mix-blend-screen"
         style={{
            background: `radial-gradient(circle at 60% 40%, ${theme.colors[1]} 0%, transparent 50%)`
         }}
       />

       {/* Moving Shimmer Texture */}
       <div className="absolute inset-0 opacity-[0.05] shimmer-overlay mix-blend-overlay" />

      <style>{`
        @keyframes lava-move-vertical {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-15vh) scale(1.1) rotate(10deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes lava-move-mixed {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4vw, -10vh) scale(1.1); }
          66% { transform: translate(-4vw, 5vh) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -50% -50%; }
          100% { background-position: 150% 150%; }
        }
        @keyframes breathe {
          0% { opacity: 0.05; transform: scale(1); }
          100% { opacity: 0.15; transform: scale(1.05); }
        }
        .lava-blob {
           position: absolute;
           border-radius: 50%;
           /* Opacity 1 is crucial for the alpha threshold filter to produce a solid blob */
           opacity: 1;
           will-change: transform;
        }
        .shimmer-overlay {
            background: linear-gradient(
                45deg,
                transparent 45%,
                rgba(255, 255, 255, 0.5) 50%,
                transparent 55%
            );
            background-size: 200% 200%;
            animation: shimmer 15s infinite linear;
        }
        .breathing-glow {
            animation: breathe 8s ease-in-out infinite alternate;
        }
      `}</style>
      
      {/* 
        The Gooey Filter 
        This uses a Gaussian Blur to blend the shapes, then a Color Matrix to sharpen the alpha channel.
        This creates the effect of them merging like liquid wax.
      */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="35" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 50 -10"
              result="goo"
            />
            {/* Note: Removing feComposite prevents the original sharp shapes from rendering on top */}
          </filter>
        </defs>
      </svg>

      {/* Render Blobs with Filter */}
      <div 
        className="w-full h-full relative"
        style={{ filter: 'url(#goo)' }}
      >
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="lava-blob transition-colors duration-[3000ms]"
            style={{
              left: `${blob.left}%`,
              top: `${blob.top}%`,
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              marginLeft: `-${blob.size / 2}px`,
              marginTop: `-${blob.size / 2}px`,
              backgroundColor: blob.color,
              animation: `${blob.anim} ${blob.duration / theme.speed}s infinite ease-in-out alternate`,
              animationDelay: `${blob.delay}s`,
            }}
          />
        ))}
      </div>
      
      {/* Vignette Overlay for depth and focusing attention */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 pointer-events-none" />
    </div>
  );
};

export default LavaBackground;