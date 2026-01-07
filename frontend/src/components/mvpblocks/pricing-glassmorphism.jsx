import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Data for pricing plans
const pricingPlans = [
  {
    name: "Starter",
    price: { monthly: "Free", annual: "Free" },
    description: "Perfect for individuals getting started",
    features: [
      "Up to 5 projects",
      "10GB storage",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started",
    link: "#",
    tag: "Free Plan",
  },
  {
    name: "Professional",
    price: { monthly: "$49", annual: "$39" },
    description: "For growing teams and businesses",
    features: [
      "Unlimited projects",
      "50GB storage",
      "Advanced analytics",
      "Priority email support",
      "API access",
    ],
    cta: "Start Free Trial",
    link: "#",
    tag: "Standard Plan",
  },
  {
    name: "Enterprise",
    price: { monthly: "$99", annual: "$79" },
    description: "For large scale organizations",
    features: [
      "Unlimited projects",
      "Unlimited storage",
      "Advanced analytics",
      "24/7 phone support",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    link: "#",
    tag: "Premium Plan",
    highlight: true,
  },
];

// Animation variants for container staggering
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Animation variants for individual pricing cards
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 150 },
  },
};

// PricingPage component renders the pricing section with monthly/annual toggle
const PricingPage = ({ plans = pricingPlans, className }) => {
  const [isAnnual, setIsAnnual] = React.useState(true);
  return (
    // 1. ADDED bg-black and text-white here
    <div className={cn("relative w-full overflow-hidden bg-black text-white min-h-screen", className)}>

      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="bg-primary/20 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        <div className="bg-primary/20 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />

        {/* Adjusted Title color for dark mode (subtle white) */}
        <h1 className="text-center text-[7rem] font-bold md:text-[10rem] text-white select-none">
          Pricing
        </h1>
      </div>

      {/* Pricing Container */}
      <div className="relative container pt-28 md:pt-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          // 2. CHANGED Grid to Flex + Justify Center
          className="relative z-10 flex flex-wrap justify-center gap-8"
        >
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              variants={itemVariants}
              plan={plan}
              isAnnual={isAnnual}
            />
          ))}
        </motion.div>
      </div>

      <BillingToggle
        isAnnual={isAnnual}
        onCheckedChange={setIsAnnual}
        className="mb-12"
      />
    </div>
  );
};

// Component to display the price based on billing cycle
const PriceDisplay = ({ price, isAnnual, className }) => {
  return (
    <div className={cn("relative mb-8", className)}>
      <div
        className={cn(
          "mt-2 text-6xl font-bold",
          // 3. UPDATED Gradient to start from white
          "from-white bg-gradient-to-r to-transparent bg-clip-text text-transparent"
        )}
      >
        {price.monthly === "Free" ? (
          <span>Free</span>
        ) : (
          <>
            <span>{isAnnual ? price.annual : price.monthly}</span>
            <span>/{isAnnual ? "y" : "m"}</span>
          </>
        )}
      </div>
    </div>
  );
};

// Component to list features of a pricing plan
const PricingFeatures = ({ features, className }) => {
  return (
    <ul className={cn("relative mb-8 space-y-3", className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-center text-zinc-300">
          {/* 4. UPDATED Checkbox background for dark mode */}
          <div className="bg-white/10 text-white mr-3 rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

// Component representing a single pricing card
const PricingCard = React.forwardRef(
  ({ plan, isAnnual, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 w-full max-w-sm",
          // 5. UPDATED Card Styles for Dark Mode (Zinc-900 borders, glass effect)
          "border border-white/10",
          "bg-zinc-900/50 backdrop-blur-md",
          "shadow-xl",
          "hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300",
          className
        )}
        whileHover={{ y: -8 }}
        {...props}
      >
        <div>
          <div className="py-2">
            <div className="text-zinc-400 text-sm font-medium">
              {plan.tag}
            </div>
          </div>

          <PriceDisplay price={plan.price} isAnnual={isAnnual} />
          <PricingFeatures features={plan.features} />
        </div>

        <div className="relative">
          <Button
            className={cn(
              "w-full bg-white text-black hover:bg-zinc-200",
              "shadow-lg shadow-white/10"
            )}
          >
            {plan.cta}
          </Button>
        </div>
      </motion.div>
    );
  }
);
PricingCard.displayName = "PricingCard";

// Switch component to toggle between monthly and annual billing
const BillingToggle = ({ isAnnual, onCheckedChange, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "flex flex-col items-center justify-center text-center mt-10",
        className
      )}
    >
      <div className="bg-zinc-900/80 border border-white/10 flex items-center gap-4 rounded-full p-2 px-6 backdrop-blur-sm">
        <Label htmlFor="billing-toggle" className="text-zinc-400 cursor-pointer">Monthly</Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="billing-toggle" className="text-white cursor-pointer">
          Annual <span className="text-primary font-bold">(20% off)</span>
        </Label>
      </div>
    </motion.div>
  );
};

export default PricingPage;
export { pricingPlans, PriceDisplay, PricingFeatures, PricingCard, BillingToggle };