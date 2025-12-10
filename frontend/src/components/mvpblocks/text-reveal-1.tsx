import { TextReveal } from '@/components/ui/text-reveal';
import { cn } from '@/lib/utils';
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

export default function TextRevealLetters() {
  return (
    <TextReveal
      className={cn(
        "bg-primary from-foreground to-primary via-rose-400 bg-clip-text text-6xl font-bold text-transparent dark:bg-gradient-to-b font-[Inter]"
      )}
      from="bottom"
      split="letter"
    >
      Welcome to AdventureNexus!
    </TextReveal>
  );
}