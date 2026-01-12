import React from 'react';
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
  ChevronRight,
  HelpCircle
} from 'lucide-react';

const HelpPage = () => {
  const categories = [
    { title: "Booking & Trips", icon: Plane, description: "Managing itineraries, changes, and cancellations." },
    { title: "Payments & Refunds", icon: CreditCard, description: "Invoices, receipts, and refund policies." },
    { title: "Account & Security", icon: User, description: "Profile settings, login issues, and privacy." },
    { title: "Safety & Insurance", icon: Shield, description: "Travel insurance, emergency contacts, and guidelines." },
    { title: "Using the App", icon: BookOpen, description: "Guides on how to use our AI and trip builder." },
    { title: "Partner Support", icon: HelpCircle, description: "Help for hotels, airlines, and tour operators." }
  ];

  const faqs = [
    {
      question: "How do I cancel my booking?",
      answer: "You can cancel your booking by going to 'My Trips', selecting the trip, and clicking 'Cancel Booking'. Please check the cancellation policy for specific refund details."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption to protect your payment details. We verify all transactions through secure payment gateways."
    },
    {
      question: "Can I change my itinerary after booking?",
      answer: "Minor changes like dates can sometimes be made depending on availability. Contact our support team or use the 'Modify Trip' option in your dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-primary/5 py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1">
             Support Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you today?</h1>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              type="text" 
              placeholder="Search for articles, guides, or questions..." 
              className="pl-12 py-6 text-lg rounded-full shadow-lg border-primary/10 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Browse by Topic</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <category.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-card border-y border-border/50">
        <div className="container mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-6">
              Quick answers to the most common questions our support team receives.
            </p>
            <Button variant="outline" className="gap-2">
              Visit Full FAQ <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-xl p-6 hover:bg-muted/30 transition-colors">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Still Need Help? */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Still need help?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="pt-8 pb-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <MessageCircle size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Chat with our AI assistant or a support agent.
              </p>
              <Button className="w-full" variant="outline">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="pt-8 pb-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <Mail size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Email Support</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Get a response within 24 hours.
              </p>
              <Button className="w-full" variant="outline">Send Email</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="pt-8 pb-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Phone size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Phone Support</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Available Mon-Fri, 9am - 6pm EST.
              </p>
              <Button className="w-full" variant="outline">Call Us</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};



export default HelpPage;
