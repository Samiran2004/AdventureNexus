import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollText, Lock, Eye, Database, Shield } from 'lucide-react';

const PrivacyPage = () => {
  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'collection', title: '2. Information We Collect' },
    { id: 'usage', title: '3. How We Use Your Data' },
    { id: 'sharing', title: '4. Information Sharing' },
    { id: 'security', title: '5. Data Security' },
    { id: 'cookies', title: '6. Cookies & Tracking' },
    { id: 'rights', title: '7. Your Rights' },
    { id: 'contact', title: '8. Contact Us' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary uppercase tracking-widest">
            Privacy & Data
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
          </p>
          <div className="mt-8 text-sm text-muted-foreground">
            Last Updated: <span className="font-medium text-foreground">January 12, 2026</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Sidebar Navigation (Sticky) */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-2">
              <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                <ScrollText size={20} /> Table of Contents
              </h3>
              <nav className="space-y-1 border-l-2 border-border pl-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block text-left py-2 text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl prose prose-slate dark:prose-invert">
            
            <div id="introduction" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At AdventureNexus, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains our practices regarding the data we collect from you when you use our website and services.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="collection" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information that you provide directly to us, such as when you create an account, make a booking, or contact support. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Personal Identity:</strong> Name, email address, phone number.</li>
                <li><strong>Payment Information:</strong> Credit card details (processed securely by third parties).</li>
                <li><strong>Travel Details:</strong> Passport information, travel preferences, and itinerary details.</li>
              </ul>
            </div>

            <Separator className="my-8" />

            <div id="usage" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> How We Use Your Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Process and confirm your bookings.</li>
                <li>Provide customer support and respond to your requests.</li>
                <li>Send you updates, travel alerts, and marketing communications (which you can opt out of).</li>
                <li>Improve our AI algorithms to provide better travel recommendations.</li>
              </ul>
            </div>

            <Separator className="my-8" />

            <div id="sharing" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Information Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We share your information with travel suppliers (airlines, hotels, tour operators) only as necessary to fulfill your bookings. We do not sell your personal data to third parties for their marketing purposes.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="security" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Data Security
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-blue-700 dark:text-blue-300 text-sm font-medium flex gap-2">
                  <Lock size={18} /> Secure Transmission
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                  We use industry-standard SSL/TLS encryption to protect your data during transmission and storage.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                While we implement strong security measures, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <Separator className="my-8" />

             <div id="cookies" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Cookies & Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                 We use cookies and similar technologies to track usage patterns and provide a personalized experience. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="rights" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your data.
              </p>
            </div>

             <div id="contact" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">8.</span> Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For any privacy-related questions or to exercise your rights, please contact our Data Protection Officer at:
              </p>
               <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 inline-block pr-12">
                <div className="font-bold mb-1">Data Privacy Team</div>
                <div className="text-primary hover:underline cursor-pointer">privacy@adventurenexus.com</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
