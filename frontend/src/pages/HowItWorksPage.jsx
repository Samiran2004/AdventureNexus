import FooterNewsletter from '@/components/mvpblocks/footer-newsletter';
import NavBar from '@/components/NavBar';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Bot,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Globe,
    MapPin,
    PlayCircle,
    Search,
    Shield,
    Sparkles,
    Star,
    Users
} from 'lucide-react';
import { useState } from 'react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('planning');

  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Tell Us Your Dream",
      description: "Share your travel preferences, budget, and desired destinations",
      details: "Our AI analyzes millions of travel data points to understand your unique preferences",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      icon: Bot,
      title: "AI Magic Happens",
      description: "Our advanced AI creates personalized itineraries tailored just for you",
      details: "Machine learning algorithms consider weather, local events, and your interests",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 3,
      icon: Calendar,
      title: "Perfect Planning",
      description: "Get detailed day-by-day schedules with optimized routes and timings",
      details: "Smart scheduling ensures you make the most of every moment",
      color: "from-pink-500 to-red-600"
    },
    {
      id: 4,
      icon: CreditCard,
      title: "Book & Go",
      description: "Seamlessly book hotels, flights, and activities all in one place",
      details: "Integrated booking system with real-time pricing and availability",
      color: "from-red-500 to-orange-600"
    }
  ];

  const features = {
    planning: [
      {
        icon: Sparkles,
        title: "AI-Powered Recommendations",
        description: "Get personalized suggestions based on your preferences, budget, and travel style."
      },
      {
        icon: Globe,
        title: "Global Destinations",
        description: "Explore over 10,000+ destinations worldwide with local insights and hidden gems."
      },
      {
        icon: Clock,
        title: "Real-Time Updates",
        description: "Stay informed with live updates on weather, events, and local conditions."
      }
    ],
    booking: [
      {
        icon: Shield,
        title: "Secure Payments",
        description: "Bank-level security ensures your payment information is always protected."
      },
      {
        icon: Star,
        title: "Best Price Guarantee",
        description: "We scan thousands of providers to ensure you get the best deals available."
      },
      {
        icon: CheckCircle,
        title: "Instant Confirmation",
        description: "Receive immediate booking confirmations with all your travel documents."
      }
    ],
    support: [
      {
        icon: Users,
        title: "24/7 Travel Support",
        description: "Our expert travel team is available around the clock to assist you."
      },
      {
        icon: MapPin,
        title: "Local Assistance",
        description: "Connect with local guides and get insider tips for authentic experiences."
      },
      {
        icon: PlayCircle,
        title: "Travel Companion App",
        description: "Navigate with our mobile app featuring offline maps and real-time guidance."
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        <NavBar/>
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How AdventureNexus Works
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From dream to reality in 4 simple steps. Let our AI create the perfect journey for you.
          </motion.p>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Steps Section */}
      <motion.section
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            Your Journey Simplified
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`relative group cursor-pointer ${activeStep === index ? 'scale-105' : ''}`}
                variants={itemVariants}
                onClick={() => setActiveStep(index)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Step {step.id}</div>
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-300 mb-4">{step.description}</p>

                    <AnimatePresence>
                      {activeStep === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-600 pt-4 mt-4">
                            <p className="text-sm text-gray-400">{step.details}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Tabs Section */}
      <motion.section
        className="py-20 px-4 bg-gray-900/30"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            Why Choose AdventureNexus?
          </motion.h2>

          {/* Tab Navigation */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            {Object.keys(features).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {features[activeTab].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Process Flow Section */}
      <motion.section
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-16"
            variants={itemVariants}
          >
            The Complete Experience
          </motion.h2>

          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            {[
              {
                step: "Input",
                title: "Share Your Vision",
                description: "Tell us about your ideal trip - destinations, budget, interests, and travel dates.",
                icon: "🎯"
              },
              {
                step: "Process",
                title: "AI Analysis",
                description: "Our algorithms analyze millions of data points to create your perfect itinerary.",
                icon: "🤖"
              },
              {
                step: "Customize",
                title: "Refine & Personalize",
                description: "Review and adjust your itinerary with our intuitive editing tools.",
                icon: "✨"
              },
              {
                step: "Book",
                title: "One-Click Booking",
                description: "Secure all your travel arrangements with our integrated booking system.",
                icon: "🎫"
              },
              {
                step: "Travel",
                title: "Enjoy Your Adventure",
                description: "Experience seamless travel with our mobile companion and 24/7 support.",
                icon: "🌍"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-blue-400 font-semibold mb-1">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Start Your Adventure?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of travelers who trust AdventureNexus for unforgettable journeys
          </motion.p>
          <motion.div
            className="space-x-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Start Planning Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition-colors duration-300">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </motion.section>
      <FooterNewsletter/>
    </div>
  );
};

export default HowItWorks;
