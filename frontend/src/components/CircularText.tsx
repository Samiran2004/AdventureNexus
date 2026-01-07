'use client';
import {
  motion,
  MotionValue,
  Transition,
  useAnimation,
  useMotionValue,
} from 'framer-motion'; // Animation library
import { useEffect } from 'react';

// Props for the CircularText component
type CircularTextProps = {
  text: string; // The text to display in a circle
  spinDuration?: number; // Duration of one full rotation in seconds
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers'; // Behavior on hover
  className?: string; // Optional CSS class
};

// Helper function to create rotation transition configuration
const getRotationTransition = (
  duration: number,
  from: number,
  loop: boolean = true,
) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0, // Infinite loop if enabled
});

// Helper function to combine rotation and scale transitions
const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300,
  },
});

export function CircularText({
  text = 'Circular Text Animation • ', // Default text
  spinDuration = 20, // Default rotation speed
  onHover = 'speedUp', // Default hover effect
  className = '',
}: Readonly<CircularTextProps>) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation: MotionValue<number> = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [spinDuration, text, onHover, controls]);

  const handleHoverStart = () => {
    const start = rotation.get();

    if (!onHover) return;

    let transitionConfig: ReturnType<typeof getTransition> | Transition;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 },
        };
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white">
      <motion.div
        className={`relative m-0 mx-auto h-[200px] w-[200px] origin-center cursor-pointer rounded-full text-center font-black text-black ${className}`}
        style={{ rotate: rotation }}
        initial={{ rotate: 0 }}
        animate={controls}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        {letters.map((letter, i) => {
          const rotationDeg = (360 / letters.length) * i;
          const factor = Math.PI / letters.length;
          const x = factor * i;
          const y = factor * i;
          const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

          return (
            <span
              key={i}
              className="absolute inset-0 inline-block text-2xl transition-all duration-500 ease-out"
              style={{ transform, WebkitTransform: transform }}
            >
              {letter}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

export default CircularText;
