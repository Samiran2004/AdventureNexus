import Footer from '@/components/mvpblocks/footer-newsletter';
import NavBar from '@/components/NavBar';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUp,
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Globe,
  Heart,
  MapPin,
  PlayCircle,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

const ProNexus3D = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center py-24 bg-gray-950 overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(67,56,202,0.2),transparent_60%)]"></div>

      {/* Holographic Grid Floor */}
      <div className="absolute inset-0 [perspective:1000px] pointer-events-none">
        <div
          className="absolute bottom-0 w-full h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:rotateX(75deg)_translateZ(-200px)] opacity-20"
        />
      </div>

      <div className="relative w-80 h-80 [perspective:1200px] [transform-style:preserve-3d]">
        {/* The Core Nexus Globe (Holographic) */}
        <div className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-indigo-500/30 [transform-style:preserve-3d] animate-slow-spin">
          <div className="absolute inset-0 border border-indigo-400/20 rounded-full [transform:rotateY(90deg)]"></div>
          <div className="absolute inset-0 border border-indigo-400/20 rounded-full [transform:rotateX(90deg)]"></div>

          {/* Internal Glow */}
          <div className="absolute inset-0 m-auto w-24 h-24 bg-indigo-500/20 rounded-full blur-[40px] animate-pulse"></div>
        </div>

        {/* Dynamic 3D Flight Paths */}
        {[0, 120, 240].map((rotation, i) => (
          <div
            key={i}
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${rotation}deg)` }}
          >
            <div className="absolute inset-0 border border-emerald-500/10 rounded-full [transform:rotateX(80deg)]">
              {/* The "Pro" Plane - CSS/SVG Hybrid */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 animate-flight-pro"
                style={{ animationDelay: `${i * -4}s` }}
              >
                <div className="relative [transform-style:preserve-3d]">
                  {/* Plane Icon */}
                  <div className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] [transform:rotateX(-90deg)_scale(1.5)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </div>
                  {/* Engine Flare */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-transparent via-cyan-500/40 to-cyan-400 blur-[2px]"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* AI Scanning Beam */}
        <div className="absolute inset-0 [transform-style:preserve-3d] animate-scan-sweep">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.8)]"></div>
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-indigo-500/10 to-transparent [transform:rotateX(10deg)]"></div>
        </div>

        {/* Global Travel Data Points */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`hub-${i}`}
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${i * 45}deg) rotateX(${30 + i * 5}deg)` }}
          >
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-sm flex items-center justify-center animate-hub-flicker">
              <div className="w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,1)]"></div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slow-spin {
          from { transform: rotateY(0deg) rotateX(15deg); }
          to { transform: rotateY(360deg) rotateX(15deg); }
        }
        
        @keyframes flight-pro {
          0% { transform: translateX(-50%) rotate(0deg) translate(120px) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg) translate(120px) rotate(-360deg); }
        }
        
        @keyframes scan-sweep {
          0%, 100% { transform: translateY(-50%) rotateX(-20deg); opacity: 0; }
          40%, 60% { opacity: 1; }
          50% { transform: translateY(150%) rotateX(20deg); }
        }
        
        @keyframes hub-flicker {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

const VideoShowcase = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <section ref={containerRef} className="py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)] opacity-50"></div>

      <motion.div
        style={{
          perspective: "1000px",
          opacity
        }}
        className="max-w-6xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            Visual Intelligence
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Experience the Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">of Travel Planning</span>
          </h2>
        </motion.div>

        <motion.div
          style={{
            rotateX: springRotateX,
            scale: springScale,
            transformStyle: "preserve-3d"
          }}
          className="relative group mt-12"
        >
          {/* Decorative Elements */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
            {/* Pure CSS 3D Visual Centerpiece */}
            <ProNexus3D />

            {/* Custom 3D Background Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
              style={{ backgroundImage: "url('/home/zephyrus/.gemini/antigravity/brain/89310916-f9c4-4ed0-b191-8abe1fbe94cb/futuristic_3d_travel_showcase_1769093668054.png')" }}
            ></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div className="text-left space-y-2">
                <div className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Neural Engine v2.0</div>
                <div className="text-white text-xl font-bold">Scanning Global Destinations...</div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>

          {/* Floater Icons */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hidden md:block"
          >
            <Bot className="w-8 h-8 text-emerald-400" />
          </motion.div>

          <motion.div
            initial={{ x: 0, y: 0 }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -left-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hidden md:block"
          >
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('planning');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const heroRef = useRef(null);

  // Back to Top Logic
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Tell Us Your Dream",
      description: "Share your preferences, budget, and desired destinations.",
      details: "Our AI analyzes millions of travel data points to create the perfect journey.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      icon: Bot,
      title: "AI Analysis",
      description: "Our advanced AI creates personalized itineraries just for you.",
      details: "Algorithms consider weather, events, and your interests.",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      icon: Calendar,
      title: "Perfect Planning",
      description: "Get detailed day-by-day schedules with optimized routes.",
      details: "Intelligent scheduling ensures you maximize your experience.",
      color: "from-pink-500 to-purple-500",
    },
    {
      id: 4,
      icon: CreditCard,
      title: "Book & Go",
      description: "Seamlessly book hotels and flights in one place.",
      details: "Real-time pricing and instant confirmation.",
      color: "from-orange-500 to-yellow-500",
    }
  ];

  const features = {
    planning: [
      {
        icon: Sparkles,
        title: "Smart Suggestions",
        description: "Personalized recommendations based on your unique style.",
        stat: "10M+ analyzed"
      },
      {
        icon: Globe,
        title: "Global Reach",
        description: "Explore over 10,000+ destinations with local insights.",
        stat: "195 countries"
      },
      {
        icon: Clock,
        title: "Live Updates",
        description: "Stay informed with real-time weather and event updates.",
        stat: "Real-time"
      }
    ],
    booking: [
      {
        icon: Shield,
        title: "Secure Payments",
        description: "Bank-level security ensures your data is protected.",
        stat: "Encrypted"
      },
      {
        icon: Star,
        title: "Best Prices",
        description: "We scan thousands of providers for the best deals.",
        stat: "Save 40%"
      },
      {
        icon: CheckCircle,
        title: "Instant Confirm",
        description: "Receive immediate booking confirmations.",
        stat: "Instant"
      }
    ],
    support: [
      {
        icon: Users,
        title: "24/7 Support",
        description: "Our expert travel team is always available to help.",
        stat: "24/7"
      },
      {
        icon: MapPin,
        title: "Local Guides",
        description: "Connect with locals for authentic experiences.",
        stat: "5,000+"
      },
      {
        icon: PlayCircle,
        title: "Companion App",
        description: "Navigate with offline maps and guidance.",
        stat: "4.9★"
      }
    ]
  };

  // Simplified Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Simplified Card Component
  const SimpleCard = ({ children, className = "", onClick, active }) => {
    return (
      <div
        className={`bg-card border border-border rounded-xl p-6 transition-all duration-300 ${active ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md hover:border-primary/50'
          } ${className}`}
        onClick={onClick}
        onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : undefined}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <NavBar />

      {/* Hero Section */}

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How AdventureNexus Works
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Your journey from dream to destination in 4 simple steps.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Users, label: "Travelers", value: "500K+" },
              { icon: Globe, label: "Places", value: "10K+" },
              { icon: Star, label: "Rating", value: "4.9" },
              { icon: TrendingUp, label: "Success", value: "98%" }
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="p-4 rounded-lg bg-muted/30">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <VideoShowcase />

      {/* Steps Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Simple Process
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <SimpleCard
                key={step.id}
                className="h-full relative"
                onClick={() => setActiveStep(index)}
                active={activeStep === index}
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 text-white shadow-md`}>
                  <step.icon className="w-7 h-7" />
                </div>

                <div className="text-sm font-semibold text-primary mb-2">STEP {step.id}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{step.description}</p>

                <AnimatePresence>
                  {activeStep === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border pt-3 mt-3">
                        <p className="text-sm text-muted-foreground">{step.details}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 z-20 text-muted-foreground/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </SimpleCard>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Core Features
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(features).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 capitalize ${activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {features[activeTab].map((feature, index) => (
                <div key={index} className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-muted-foreground">
                      {feature.stat}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-8">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Join 500k+ Travelers</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Everything you need for the perfect trip, all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Plan My Trip
            </button>
            <button className="px-8 py-4 bg-card text-foreground border border-input rounded-lg font-bold hover:bg-accent hover:text-accent-foreground transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg z-50 hover:bg-primary/90 transition-colors"
            onClick={scrollToTop}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default HowItWorks;
