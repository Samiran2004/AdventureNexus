import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Globe2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Building2,
  Plane,
  Users2,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';

const PartnersPage = () => {
  const stats = [
    { value: "500+", label: "Global Partners", icon: Briefcase },
    { value: "1M+", label: "Active Travelers", icon: Users2 },
    { value: "150+", label: "Countries Covered", icon: Globe2 },
    { value: "40%", label: "Avg. Revenue Growth", icon: TrendingUp },
  ];

  const benefits = [
    {
      title: "Global Reach",
      description: "Access our diverse audience of adventure seekers from over 150 countries.",
      icon: Globe2
    },
    {
      title: "Data-Driven Insights",
      description: "Leverage our AI analytics to understand travel trends and optimize your offerings.",
      icon: BarChart3
    },
    {
      title: "Seamless Integration",
      description: "Easy-to-use API and dashboard tools to manage bookings and inventory.",
      icon: Zap
    },
    {
      title: "Verified Trust",
      description: "Join a network of vetted, high-quality providers trusted by our community.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />

      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&auto=format&fit=crop&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-md">
            Partnership Program
          </Badge>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
            Grow Your Business with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AdventureNexus</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Join the world's fastest-growing AI travel platform. Connect with millions of travelers and take your business to new heights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 text-lg h-14">
              Become a Partner
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue hover:!text-white rounded-full px-8 text-lg h-14 bg-blue/10 backdrop-blur-sm">
              Login to Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/90 backdrop-blur-md border-border shadow-xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3 text-primary">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Partner With Us?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We provide the tools, technology, and audience you need to scale your travel business in the digital age.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-colors group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Partnership Types */}
      <div className="bg-muted/30 py-24 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">Solutions for Every Provider</h2>
              <p className="text-lg text-muted-foreground">
                Whether you manage a boutique hotel, run a local tour agency, or operate a global airline, we have a tailored solution for you.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Hotels & Accommodations</h4>
                    <p className="text-muted-foreground">Fill rooms faster with our high-intent traveler traffic.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                    <Users2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Tour Operators & Guides</h4>
                    <p className="text-muted-foreground">Showcase your unique experiences to a global audience.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <Plane size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Airlines & Transport</h4>
                    <p className="text-muted-foreground">Seamlessly integrate your inventory into our trip builder.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80"
                  alt="Business Meeting"
                  className="relative rounded-3xl shadow-2xl border border-white/10"
                />

                <Card className="absolute -bottom-6 -left-6 w-64 shadow-xl border-border animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Partner Success</div>
                      <div className="text-sm text-muted-foreground">+128% Bookings</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8 p-12 rounded-[3rem] bg-gradient-to-b from-primary/5 to-transparent border border-primary/10">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of successful partners who are redefining travel with AdventureNexus.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-6 text-lg h-auto shadow-lg hover:shadow-primary/25 transition-all hover:scale-105">
            Join Partner Network <ArrowRight className="ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground">
            No credit card required for registration. Approval within 48 hours.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PartnersPage;
