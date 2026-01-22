import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollText, Accessibility, CheckCircle, Mail, Globe, Monitor } from 'lucide-react';

const AccessibilityPage = () => {
  const sections = [
    { id: 'commitment', title: '1. Our Commitment' },
    { id: 'conformance', title: '2. Conformance Status' },
    { id: 'feedback', title: '3. Feedback' },
    { id: 'compatibility', title: '4. Compatibility' },
    { id: 'specs', title: '5. Technical Specifications' },
    { id: 'limitations', title: '6. Limitations & Alternatives' },
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
            Inclusivity
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Accessibility Statement</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone.
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
            
            <div id="commitment" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Our Commitment
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AdventureNexus believes that the internet should be available and accessible to anyone, and we are committed to providing a website that is accessible to the widest possible audience, regardless of circumstance and ability.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To fulfill this commitment, we aim to adhere as strictly as possible to the World Wide Web Consortium's (W3C) Web Content Accessibility Guidelines 2.1 (WCAG 2.1) at the AA level.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="conformance" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Conformance Status
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
              </p>
              <div className="flex items-start gap-4 p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                  <CheckCircle size={24} />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-green-800 dark:text-green-300 mb-1">Partially Conformant</h4>
                   <p className="text-green-700 dark:text-green-400 text-sm">
                     AdventureNexus is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not yet fully conform to the accessibility standard, but we are actively working to address them.
                   </p>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div id="feedback" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> Feedback
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We welcome your feedback on the accessibility of AdventureNexus. Please let us know if you encounter accessibility barriers on AdventureNexus:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg flex items-center gap-3 hover:bg-muted/50 transition-colors">
                  <Mail className="text-primary" />
                  <div>
                    <div className="text-sm font-semibold">Email Us</div>
                    <div className="text-sm text-muted-foreground">accessibility@adventurenexus.com</div>
                  </div>
                </div>
                <div className="p-4 border border-border rounded-lg flex items-center gap-3 hover:bg-muted/50 transition-colors">
                  <Globe className="text-primary" />
                  <div>
                    <div className="text-sm font-semibold">Contact Form</div>
                    <div className="text-sm text-muted-foreground">/contact/accessibility</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We try to respond to feedback within 2 business days.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="compatibility" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Compatibility
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AdventureNexus is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Google Chrome with NVDA or JAWS on Windows</li>
                <li>Safari with VoiceOver on macOS and iOS</li>
                <li>Firefox with NVDA on Windows</li>
                <li>Edge with Narrator on Windows</li>
              </ul>
            </div>

            <Separator className="my-8" />

            <div id="specs" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Technical Specifications
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Accessibility of AdventureNexus relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
              </p>
              <div className="flex gap-4 flex-wrap">
                 <Badge variant="secondary" className="px-4 py-2 text-base"><Monitor size={16} className="mr-2"/> HTML</Badge>
                 <Badge variant="secondary" className="px-4 py-2 text-base">WAI-ARIA</Badge>
                 <Badge variant="secondary" className="px-4 py-2 text-base">CSS</Badge>
                 <Badge variant="secondary" className="px-4 py-2 text-base">JavaScript</Badge>
              </div>
            </div>

             <div id="limitations" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Limitations & Alternatives
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Despite our best efforts to ensure accessibility of AdventureNexus, there may be some limitations. Below is a description of known limitations and potential solutions. Please contact us if you observe an issue not listed below.
              </p>
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
                <ul className="space-y-4">
                  <li>
                    <strong className="text-foreground">User-generated content:</strong> Images uploaded by users may not strictly have text alternatives. We monitor user content and typically repair these issues within 2 business days.
                  </li>
                  <li>
                     <strong className="text-foreground">Archived documents:</strong> Older PDF documents might not work with current screen readers. Please support if you need access to these documents.
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccessibilityPage;
