import Earth from '@/components/ui/globe';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Globe2 component displays an interactive 3D globe using the Earth component
export default function Globe2() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we're in dark mode
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Theme-aware colors
  const globeColors = isDark
    ? {
      baseColor: [0.1, 0.1, 0.1] as [number, number, number],
      markerColor: [0.1, 0.8, 0.9] as [number, number, number],
      glowColor: [0.1, 0.8, 0.9] as [number, number, number],
    }
    : {
      baseColor: [0.2, 0.5, 0.7] as [number, number, number],
      markerColor: [1.0, 0.42, 0.21] as [number, number, number],
      glowColor: [0.2, 0.5, 0.7] as [number, number, number],
    };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl" />
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl">
      <div className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-700 hover:scale-105 pointer-events-none opacity-80 mix-blend-plus-lighter">
        <Earth
          baseColor={globeColors.baseColor}
          markerColor={globeColors.markerColor}
          glowColor={globeColors.glowColor}
        />
      </div>
    </div>
  );
}
