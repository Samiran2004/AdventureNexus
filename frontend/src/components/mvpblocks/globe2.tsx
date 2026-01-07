import Earth from '@/components/ui/globe';

// Globe2 component displays an interactive 3D globe using the Earth component
export default function Globe2() {
  return (
    <>
      <div className="bg-background flex flex-col items-center justify-center overflow-hidden rounded-3xl mb-7">
        <article className="relative mx-auto h-[350px] min-h-60 max-w-[100%] overflow-hidden rounded-3xl border bg-gradient-to-b from-[#4EB5A9] to-[#4EB5A9]/5 p-6 text-3xl tracking-tight text-black md:h-[450px] md:min-h-80 md:p-8 md:text-4xl md:leading-[1.05] lg:text-5xl">
          {/* Where AI meets wanderlust. Your journey starts here. */}
          Discover the world with intelligent trip planning at your fingertips.
          <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
            <Earth
              baseColor={[0.2, 0.6, 0.3]}
              markerColor={[1.0, 0.42, 0.21]}
              glowColor={[0.2, 0.6, 0.3]}
            />
          </div>
        </article>
      </div>
    </>
  );
}
