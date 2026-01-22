import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Lock,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Phone,
  FileCheck,
  HeartPulse
} from 'lucide-react';

const SafetyPage = () => {
  const safetyFeatures = [
    {
      title: "Verified Partners",
      description: "Every hotel, tour operator, and guide on our platform undergoes a rigorous background check and verification process.",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Secure Payments",
      description: "We use bank-level encryption (SSL/TLS) to ensure your financial data is protected during every transaction.",
      icon: Lock,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "24/7 Global Support",
      description: "Our dedicated support team is available around the clock to assist you with any issues, anywhere in the world.",
      icon: Headphones,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Travel Insurance",
      description: "Comprehensive travel insurance options are integrated directly into your booking for peace of mind.",
      icon: ShieldCheck,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />

      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464039397837-2e2a6c174305?w=1600&auto=format&fit=crop&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-md">
            Trust & Safety
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-3xl">
            Explore the World with <br />
            <span className="text-emerald-400">Complete Confidence</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-light">
            Your safety is our top priority. From verified listings to 24/7 support, we've built a platform you can trust for every step of your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 text-lg">
              Visit Safety Center
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {safetyFeatures.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-8">
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Resources */}
      <div className="bg-muted/30 py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Emergency Resources</h2>
              <p className="text-muted-foreground max-w-xl">
                Quick access to important information if you encounter an urgent situation during your trip.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20">
              <AlertTriangle size={18} /> Report an Incident
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 flex gap-4 items-start">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Emergency Service</h4>
                <p className="text-sm text-muted-foreground mb-3">Local police, fire, and ambulance numbers for your current destination.</p>
                <a href="#" className="text-primary text-sm font-medium hover:underline">View Local Numbers</a>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 flex gap-4 items-start">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg shrink-0">
                <HeartPulse size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Medical Assistance</h4>
                <p className="text-sm text-muted-foreground mb-3">Find nearby hospitals, clinics, and pharmacies trusted by travelers.</p>
                <a href="#" className="text-primary text-sm font-medium hover:underline">Find Medical Help</a>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 flex gap-4 items-start">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-lg shrink-0">
                <FileCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Travel Advisories</h4>
                <p className="text-sm text-muted-foreground mb-3">Real-time alerts and safety warnings for your destination.</p>
                <a href="#" className="text-primary text-sm font-medium hover:underline">Check Alerts</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Promo */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">Don't Leave Home Unprotected</h2>
            <p className="text-lg md:text-xl text-blue-100">
              We've partnered with top global insurers to offer comprehensive coverage for trip cancellations, medical emergencies, and lost luggage.
            </p>
            <div className="pt-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
                Get a Quote
              </Button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SafetyPage;
