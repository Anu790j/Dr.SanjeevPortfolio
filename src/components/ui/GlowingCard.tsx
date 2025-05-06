// Create src/components/ui/GlowingCard.tsx
export function GlowingCard({ 
    children, 
    glowColor = 'blue',
    className = '' 
  }: { 
    children: React.ReactNode, 
    glowColor?: 'blue' | 'copper' | 'green',
    className?: string 
  }) {
    const glowMap = {
      blue: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]',
      copper: 'shadow-[0_0_15px_rgba(228,169,81,0.3)]',
      green: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
    };
    
    return (
      <div className={`
        bg-bg-secondary border border-circuit-copper border-opacity-30
        backdrop-blur-md rounded-lg overflow-hidden 
        ${glowMap[glowColor]} transition-all duration-300
        hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]
        ${className}
      `}>
        {children}
      </div>
    );
  }
  
  // Create src/components/ui/CircuitHeading.tsx
  export function CircuitHeading({ 
    children,
    className = ''
  }: { 
    children: React.ReactNode,
    className?: string
  }) {
    return (
      <div className={`relative ${className}`}>
        <h2 className="
          text-2xl font-bold text-circuit-light-blue
          after:content-[''] after:absolute after:-bottom-2 after:left-0
          after:w-16 after:h-1 after:bg-circuit-copper
        ">
          {children}
        </h2>
        <div className="absolute -left-3 top-1/2 w-2 h-2 bg-circuit-light-blue rounded-full"></div>
      </div>
    );
  }
  
  // Create src/components/ui/LEDButton.tsx
  export function LEDButton({
    children,
    onClick,
    color = 'blue',
    className = ''
  }: {
    children: React.ReactNode,
    onClick?: () => void,
    color?: 'blue' | 'green' | 'red' | 'copper',
    className?: string
  }) {
    const colorMap = {
      blue: 'bg-circuit-light-blue hover:bg-opacity-90',
      green: 'bg-circuit-green hover:bg-opacity-90',
      red: 'bg-circuit-red hover:bg-opacity-90',
      copper: 'bg-circuit-copper hover:bg-opacity-90',
    };
    
    return (
      <button
        onClick={onClick}
        className={`
          relative px-6 py-2 rounded-md text-white font-medium
          ${colorMap[color]} transition-all duration-300
          before:content-[''] before:absolute before:inset-0
          before:bg-white before:opacity-0 before:rounded-md
          hover:before:opacity-10 hover:scale-105
          active:scale-95 active:shadow-inner
          ${className}
        `}
      >
        {children}
      </button>
    );
  }