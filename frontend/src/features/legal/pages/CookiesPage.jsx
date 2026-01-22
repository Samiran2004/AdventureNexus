import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollText, Cookie, Settings, Info, MousePointerClick } from 'lucide-react';

const CookiesPage = () => {
  const sections = [
    { id: 'what-are-cookies', title: '1. What Are Cookies?' },
    { id: 'how-we-use', title: '2. How We Use Cookies' },
    { id: 'essential', title: '3. Essential Cookies' },
    { id: 'performance', title: '4. Performance & Analytics' },
    { id: 'advertising', title: '5. Advertising & Targeting' },
    { id: 'managing', title: '6. Managing Preferences' },
    { id: 'updates', title: '7. Policy Updates' },
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
            Policy
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            This policy explains how AdventureNexus uses cookies and similar technologies to recognize you when you visit our website.
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
            
            <div id="what-are-cookies" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> What Are Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Cookie className="text-primary shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Cookies set by the website owner (in this case, AdventureNexus) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies".
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            <div id="how-we-use" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> How We Use Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="essential" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> Essential Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Session Identifiers</li>
                <li>Authentication Tokens</li>
                <li>Shopping Cart Contents</li>
              </ul>
            </div>

            <Separator className="my-8" />

            <div id="performance" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Performance & Analytics
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are at customizing our Website for you.
              </p>
            </div>

            <Separator className="my-8" />

            <div id="advertising" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Advertising & Targeting
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.
              </p>
            </div>

            <Separator className="my-8" />

             <div id="managing" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Managing Preferences
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                 You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager.
              </p>
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
                 <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Settings size={18} /> Browser Controls
                 </h4>
                 <p className="text-sm text-muted-foreground mb-4">
                    Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies.
                 </p>
              </div>
            </div>

            <Separator className="my-8" />

            <div id="updates" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Policy Updates
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons.
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiesPage;
