// Client-side utility to handle page transitions
export function applyPageTransition() {
  if (typeof window === 'undefined') return;

  const overlay = document.getElementById('page-transition-overlay');
  if (!overlay) return;

  // Add event listeners for navigation
  document.addEventListener('beforeunload', () => {
    overlay.classList.add('active');
  });

  // Handle Next.js client-side navigation
  const handleStart = () => {
    overlay.classList.add('active');
  };

  const handleComplete = () => {
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 100);
  };

  // Add these event listeners to Next router or Link components
  // You would need to manually call these when navigation happens
  return {
    handleStart,
    handleComplete
  };
}

// Apply fading effect to page elements on load
export function applyEntranceAnimation() {
  if (typeof window === 'undefined') return;
  
  const pageElements = document.querySelectorAll('.animate-entrance');
  
  pageElements.forEach((el, i) => {
    const element = el as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 500ms ease, transform 500ms ease';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100 + (i * 100)); // Stagger the animations
  });
} 