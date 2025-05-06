import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ParticlesBackground } from './ParticlesBackground';

export const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Enhanced 3D Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(145deg, #f0f4f8 0%, #e3e8ed 50%, #d1d8e0 100%)',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 2, 0],
          rotateY: [0, 3, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3D Perspective Container */}
      <div 
        className="absolute inset-0" 
        style={{ 
          perspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D Grid Elements */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(90deg, rgba(120, 186, 255, 0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(120, 186, 255, 0.08) 1px, transparent 1px)'
              : 'linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0px 0px',
            transform: 'rotateX(60deg) translateZ(-100px) translateY(-500px) scale(3)',
            transformOrigin: 'center center',
            opacity: 0.5,
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Particles Effect */}
        {/* <ParticlesBackground /> */}
      </div>

      {/* Subtle Linear Gradient Overlay - reduced opacity and removed animation */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(135deg, rgba(120, 186, 255, 0.1), rgba(240, 184, 102, 0.1))'
            : 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(245, 158, 11, 0.05))',
          opacity: 0.3,
        }}
      />

      {/* Depth Linear Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2) 100%)'
            : 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.05) 100%)',
          transform: 'translateZ(50px)',
        }}
      />
    </div>
  );
};
