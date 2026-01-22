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
