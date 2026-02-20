import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  BookOpen,
  CreditCard,
  User,
  Shield,
  Plane,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MapPin,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bot,
  Star,
  Headphones
} from 'lucide-react';

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '< 2 min', label: 'Avg. Response Time', icon: Clock },
    { value: '98%', label: 'Issues Resolved', icon: CheckCircle2 },
    { value: '24/7', label: 'AI Support Available', icon: Bot },
    { value: '4.9★', label: 'Support Rating', icon: Star },
  ];

  const categories = [
    { title: 'Booking & Trips', icon: Plane, description: 'Managing itineraries, changes, and cancellations.', color: 'bg-blue-500/10 text-blue-500' },
    { title: 'Payments & Refunds', icon: CreditCard, description: 'Invoices, receipts, and refund policies.', color: 'bg-emerald-500/10 text-emerald-500' },
    { title: 'Account & Security', icon: User, description: 'Profile settings, login issues, and privacy.', color: 'bg-purple-500/10 text-purple-500' },
    { title: 'Safety & Insurance', icon: Shield, description: 'Travel insurance, emergency contacts, and guidelines.', color: 'bg-red-500/10 text-red-500' },
    { title: 'Using the App', icon: BookOpen, description: 'Guides on how to use our AI and trip builder.', color: 'bg-amber-500/10 text-amber-500' },
    { title: 'Destinations', icon: MapPin, description: 'Country guides, visa info, and local tips.', color: 'bg-cyan-500/10 text-cyan-500' },
    { title: 'AI Trip Planner', icon: Bot, description: 'How to get the best from our AI assistant.', color: 'bg-indigo-500/10 text-indigo-500' },
    { title: 'Partner Support', icon: HelpCircle, description: 'Help for hotels, airlines, and tour operators.', color: 'bg-orange-500/10 text-orange-500' },
    { title: 'Quick Actions', icon: Zap, description: 'Shortcuts and power-user features explained.', color: 'bg-pink-500/10 text-pink-500' },
  ];

  const faqs = [
    {
      question: 'How do I cancel my booking?',
      answer: "Go to 'My Trips', select the trip, and click 'Cancel Booking'. Refunds depend on the cancellation policy of each booking. Most bookings cancelled 48+ hours in advance receive a full refund.",
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes. We use AES-256 encryption and never store your raw card details. All transactions are processed through PCI-DSS compliant payment gateways with 3D Secure authentication.',
    },
    {
      question: 'Can I modify my itinerary after booking?',
      answer: "Minor changes like travel dates can sometimes be made depending on availability. Use the 'Modify Trip' option in your dashboard or contact our support team for assistance.",
    },
    {
      question: 'How does the AI trip planner work?',
      answer: 'Our AI analyses your preferences, budget, travel dates, and past trips to generate a personalised itinerary. It considers weather patterns, crowd levels, local events, and partner availability in real time.',
    },
    {
      question: 'What happens if my flight is delayed or cancelled?',
      answer: 'We monitor your booked flights and send real-time alerts. If a flight is cancelled, we automatically show alternative options. Contact our 24/7 emergency line for urgent rebooking assistance.',
    },
    {
      question: 'How do I become a verified partner?',
      answer: "Visit our Partners page and click 'Become a Partner'. Fill in your business details and we'll review your application within 48 hours. Approved partners gain access to our full dashboard and traveller network.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />

      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1600&auto=format&fit=crop&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-md">
            Support Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            How can we <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              help you today?
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Search our knowledge base, browse topics, or connect with our support team directly.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={20} />
            <Input
              type="text"
              placeholder="Search articles, guides, FAQs..."
              className="pl-14 py-7 text-lg rounded-full shadow-2xl bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-blue-400 focus-visible:bg-white/15"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90 px-6 h-11">
              Search
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
                  <stat.icon size={22} />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Browse by Topic */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Topic</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find answers quickly by selecting the category that matches your question.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg group hover:-translate-y-1 duration-300"
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${category.color} transition-transform group-hover:scale-110 duration-300`}>
                  <category.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
                </div>
                <ChevronDown
                  size={16}
                  className="ml-auto flex-shrink-0 -rotate-90 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 py-20 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1">
              Common Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Quick answers to the questions our support team hears most often.
            </p>
            <Button variant="outline" className="gap-2 group">
              Visit Full FAQ
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40"
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-base">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp size={18} className="flex-shrink-0 text-primary" />
                  ) : (
                    <ChevronDown size={18} className="flex-shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Still Need Help? */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Still need help?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Our team is ready to assist you through multiple support channels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Live Chat */}
          <Card className="text-center hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl border-border group">
            <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center">
              <div className="w-18 h-18 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Chat with our AI assistant or a human agent instantly.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Chat</Button>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="text-center hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl border-border group">
            <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Email Support</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Send us a message and we'll respond within 24 hours.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Send Email</Button>
            </CardContent>
          </Card>

          {/* Phone Support */}
          <Card className="text-center hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl border-border group">
            <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Headphones size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Phone Support</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Speak directly with a specialist, Mon–Fri 9am–6pm.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Call Us</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpPage;
