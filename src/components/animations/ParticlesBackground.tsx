import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      color: string;

      constructor() {
        if (!canvas) {
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.size = 1;
          this.speedX = 0;
          this.speedY = 0;
          this.speedZ = 0;
          this.color = '';
          return;
        }
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 3 + 2; // Slightly larger particles
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.speedZ = (Math.random() - 0.5) * 0.6;
        this.color = isDark 
          ? `rgba(120, 186, 255, ${Math.random() * 0.7 + 0.4})` // Increased opacity
          : `rgba(75, 85, 99, ${Math.random() * 0.6 + 0.3})`; // Increased opacity
      }

      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;
        this.z += this.speedZ;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        if (this.z < 0) this.z = 1000;
        if (this.z > 1000) this.z = 0;
      }

      draw() {
        if (!ctx) return;
        const scale = (1000 - this.z) / 1000;
        const x = this.x * scale;
        const y = this.y * scale;
        const size = this.size * scale;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Enhanced glow effect
        ctx.shadowColor = isDark ? 'rgba(120, 186, 255, 0.6)' : 'rgba(75, 85, 99, 0.6)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 180; // Increased particle count
    for (let i = 0; i < particleCount; i++) {
      const particle = new Particle();
      if (particle) particles.push(particle);
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort particles by z-index for proper 3D rendering
      particles.sort((a, b) => b.z - a.z);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark]); // Dependency on isDark ensures re-initialization on theme change

  return (
    <canvas
      key={`particles-canvas-${theme}`} // Key changes when theme changes, forcing re-render
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{
        opacity: isDark ? 0.6 : 0.5, // Slightly increased opacity
      }}
    />
  );
}; 