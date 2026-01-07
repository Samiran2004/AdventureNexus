import { VelocityScroll } from '@/components/ui/scrollbasedvelocity';

// ScrollBasedVelocityDemo component demonstrates the velocity scroll effect
export default function ScrollBasedVelocityDemo() {
  return (
    <VelocityScroll
      className="px-6 text-center text-4xl font-bold tracking-tight md:text-7xl md:leading-[5rem] text-white"
      text="Welcome to AdventureNexus"
      default_velocity={5}
    />
  );
}
