import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface AnimatedNameProps {
  firstName: string;
  lastName: string;
}

export const AnimatedName = ({ firstName, lastName }: AnimatedNameProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="mb-10 relative whitespace-nowrap">
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold relative pb-3 inline-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className={`inline-block ${isDark ? 'text-text-light' : 'text-text-primary'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {firstName}
        </motion.span>{' '}
        <motion.span
          className={`inline-block ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {lastName}
        </motion.span>

        {/* Animated moving line */}
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-[#1e88e5] z-10 rounded-full"
          style={{
            boxShadow: '0 0 8px rgba(30, 136, 229, 0.6)'
          }}
          initial={{ 
            width: 0,
            left: 0
          }}
          animate={{ 
            width: ["0%", "100%", "0%"],
            left: ["0%", "0%", "100%"]
          }}
          transition={{ 
            duration: 3,
            times: [0, 0.5, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0
          }}
        />
      </motion.h1>
    </div>
  );
};
