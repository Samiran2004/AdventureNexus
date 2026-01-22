import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollText, ShieldAlert, Scale, FileText } from 'lucide-react';

const TermsPage = () => {
  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'services', title: '2. Our Services' },
    { id: 'bookings', title: '3. Bookings & Payments' },
    { id: 'cancellations', title: '4. Cancellations & Refunds' },
    { id: 'responsibilities', title: '5. User Responsibilities' },
    { id: 'liability', title: '6. Limitation of Liability' },
    { id: 'privacy', title: '7. Privacy Policy' },
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
            Legal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our services. By accessing or using AdventureNexus, you agree to be bound by these terms.
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
                Welcome to AdventureNexus ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, mobile application, and services (collectively, the "Services").
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using our Services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not use our Services.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="services" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Our Services
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AdventureNexus provides an AI-powered travel planning platform that connects travelers with various travel service providers, including hotels, airlines, tour operators, and local guides ("Suppliers").
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We act as an intermediary between you and the Suppliers. We do not own, operate, or provide the travel services ourselves. Your contract for travel services is directly with the Supplier.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="bookings" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> Bookings & Payments
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>3.1 Booking Process:</strong> When you make a booking through our Services, you are making an offer to book a travel service at the specified price. The booking is confirmed only when you receive a confirmation email.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>3.2 Payment:</strong> You agree to pay all charges, fees, duties, taxes, and assessments arising out of your use of the Services. We use secure third-party payment processors to handle transactions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>3.3 Pricing:</strong> Prices are dynamic and subject to change until the booking is confirmed. We reserve the right to correct any pricing errors.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="cancellations" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Cancellations & Refunds
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cancellation policies vary by Supplier and the specific travel service booked. You must review the cancellation policy applicable to your booking before confirming it.
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 p-4 my-6">
                <p className="text-orange-700 dark:text-orange-300 text-sm font-medium flex gap-2">
                  <ShieldAlert size={18} /> Important Note
                </p>
                <p className="text-orange-600 dark:text-orange-400 text-sm mt-1">
                  Some bookings, such as "Non-Refundable" rates, cannot be cancelled or changed once booked. Please double-check your dates and details.
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            <div id="responsibilities" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> User Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must be at least 18 years old to use our Services.</li>
                <li>You are responsible for ensuring you have valid travel documents (passports, visas, etc.).</li>
                <li>You agree to provide accurate and complete information during the booking process.</li>
                <li>You agree not to use the Services for any fraudulent or illegal activity.</li>
              </ul>
            </div>

            <Separator className="my-8" />

             <div id="liability" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To the fullest extent permitted by law, AdventureNexus shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                 We are not responsible for the acts, errors, omissions, representations, warranties, breaches, or negligence of any Supplier or for any personal injuries, death, property damage, or other damages or expenses resulting there from.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="privacy" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your use of the Services is also subject to our Privacy Policy, which explains how we collect, use, and share your personal information. By using the Services, you consent to the terms of our Privacy Policy.
              </p>
            </div>

             <div id="contact" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">8.</span> Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 inline-block pr-12">
                <div className="font-bold mb-1">AdventureNexus Legal Team</div>
                <div className="text-muted-foreground mb-1">123 Adventure Way, Tech City</div>
                <div className="text-primary hover:underline cursor-pointer">legal@adventurenexus.com</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;
