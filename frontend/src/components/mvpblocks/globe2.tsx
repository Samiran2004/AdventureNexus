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
      <div className="bg-background flex flex-col items-center justify-center overflow-hidden rounded-3xl mb-7 w-full">
        <article className="relative mx-auto h-[350px] min-h-60 w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-primary/10 to-transparent p-6 md:h-[450px] md:min-h-80 md:p-8">
          <span className="block max-w-[80%] z-20 relative text-3xl tracking-tight text-foreground md:text-5xl md:leading-[1.1] lg:text-6xl font-outfit font-bold">
            Discover the world with intelligent trip planning at your fingertips.
          </span>
        </article>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background flex flex-col items-center justify-center overflow-hidden rounded-3xl mb-7 w-full">
        <article className="relative mx-auto h-[350px] min-h-60 w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-primary/10 to-transparent p-6 text-3xl tracking-tight text-foreground md:h-[450px] md:min-h-80 md:p-8 md:text-5xl md:leading-[1.1] lg:text-6xl font-outfit font-bold">
          <span className="block max-w-[80%] z-20 relative">
            Discover the world with intelligent trip planning at your fingertips.
          </span>
          <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-20 md:-bottom-20 md:max-w-[550px] pointer-events-none opacity-80 mix-blend-plus-lighter">
            <Earth
              baseColor={globeColors.baseColor}
              markerColor={globeColors.markerColor}
              glowColor={globeColors.glowColor}
            />
          </div>
        </article>
      </div>
    </>
  );
}
