import { TextReveal } from '@/components/ui/text-reveal';
import { cn } from '@/lib/utils';

// TextRevealLetters component demonstrates text reveal animation split by letter
export default function TextRevealLetters() {
  return (
    <div className="flex items-center justify-center w-full py-12">
      <TextReveal
        className={cn(
          "bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-5xl md:text-7xl font-bold text-transparent font-outfit text-center leading-tight tracking-tight"
        )}
        from="bottom"
        split="letter"
      >
        Welcome to AdventureNexus!
      </TextReveal>
    </div>
  );
}