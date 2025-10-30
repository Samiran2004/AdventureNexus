'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MapPin, Plane, Hotel, Calendar, Compass, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

interface BentoGridItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  web_link: string;
  requireAuth?: boolean; // Optional: require authentication
}

const BentoGridItem = ({
  title,
  description,
  icon,
  className,
  web_link,
  size = 'small',
  requireAuth = false,
}: BentoGridItemProps) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 25 },
    },
  };

  const handleCardClick = () => {
    // Check authentication if required
    if (requireAuth && !isSignedIn) {
      navigate('/login');
      return;
    }

    navigate(web_link);
  };

  return (
    <motion.div
      variants={variants}
      onClick={handleCardClick}
      className={cn(
        'group border-primary/10 bg-background hover:border-primary/30 relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border px-6 pt-6 pb-10 shadow-md transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]',
        className,
      )}
    >
      {/* Background pattern */}
      <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

      {/* Large background icon */}
      <div className="text-primary/5 group-hover:text-primary/10 absolute right-1 bottom-3 scale-[6] transition-all duration-700 group-hover:scale-[6.2]">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="bg-primary/10 text-primary shadow-primary/10 group-hover:bg-primary/20 group-hover:shadow-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow transition-all duration-500">
            {icon}
          </div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground text-sm group-hover:text-muted-foreground/80 transition-colors duration-300">{description}</p>
        </div>
        <div className="text-primary mt-4 flex items-center text-sm font-medium">
          <span className="mr-1">
            {requireAuth && !isSignedIn ? 'Sign in to access' : 'Learn more'}
          </span>
          <ArrowRight className="size-4 transition-all duration-500 group-hover:translate-x-2" />
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="from-primary to-primary/30 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
    </motion.div>
  );
};

const items = [
  {
    title: 'AI Trip Planning',
    description: 'Let our smart AI create personalized itineraries based on your preferences and budget.',
    icon: <Compass className="size-6" />,
    size: 'large' as const,
    web_link: '/build-trip',
    requireAuth: true
  },
  {
    title: 'Flight Search',
    description: 'Find the best flight deals from multiple airlines with real-time pricing.',
    icon: <Plane className="size-6" />,
    size: 'small' as const,
    web_link: '/hotels',
    requireAuth: false
  },
  {
    title: 'Hotel Booking',
    description: 'Discover and book accommodations that match your style and budget.',
    icon: <Hotel className="size-6" />,
    size: 'medium' as const,
    web_link: '/hotels',
    requireAuth: false
  },
  {
    title: 'Smart Scheduling',
    description: 'AI-optimized daily schedules that maximize your time and experiences.',
    icon: <Calendar className="size-6" />,
    size: 'medium' as const,
    web_link: '/destinations',
    requireAuth: true
  },
  {
    title: 'Popular Destinations',
    description: 'Explore trending locations and hidden gems with insider recommendations.',
    icon: <MapPin className="size-6" />,
    size: 'small' as const,
    web_link: '/destinations',
    requireAuth: false
  },
  {
    title: 'Trip Documentation',
    description: 'Capture and organize your travel memories with our integrated tools.',
    icon: <Camera className="size-6" />,
    size: 'large' as const,
    web_link: '/memories',
    requireAuth: true
  },
];

export default function BentoGrid1() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            icon={item.icon}
            size={item.size}
            web_link={item.web_link}
            requireAuth={item.requireAuth}
            className={cn(
              item.size === 'large'
                ? 'col-span-4'
                : item.size === 'medium'
                  ? 'col-span-3'
                  : 'col-span-2',
              'h-full',
            )}
          />
        ))}
      </motion.div>
    </div>
  );
}
