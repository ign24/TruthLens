export function useScrollLock() {
  let originalOverflow = '';
  let isLocked = false;

  const lockScroll = () => {
    if (isLocked) return;
    
    // Store the original overflow value
    originalOverflow = document.body.style.overflow || '';
    
    // Lock the scroll
    document.body.style.overflow = 'hidden';
    isLocked = true;
  };

  const unlockScroll = () => {
    if (!isLocked) return;
    
    // Restore the original overflow value
    document.body.style.overflow = originalOverflow;
    isLocked = false;
  };

  const toggleScrollLock = (shouldLock: boolean) => {
    if (shouldLock) {
      lockScroll();
    } else {
      unlockScroll();
    }
  };

  // Cleanup function to ensure scroll is unlocked
  const cleanup = () => {
    if (isLocked) {
      unlockScroll();
    }
  };

  return {
    lockScroll,
    unlockScroll,
    toggleScrollLock,
    cleanup,
    isLocked: () => isLocked
  };
}