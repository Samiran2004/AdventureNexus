import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'AdventureNexus';
const SITE_URL = 'https://adventurenexus.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const DEFAULT_SEO = {
  title: `${SITE_NAME} - AI-Powered Travel Planner`,
  description:
    'Transform your travel planning with AI. Get personalized itineraries, smart budget breakdowns, and destination recommendations in minutes.',
  keywords:
    'AI travel planner, itinerary generator, travel planning app, personalized travel, budget travel planner',
};

const routeSeoConfig = [
  {
    test: (pathname) => pathname === '/',
    seo: {
      title: `${SITE_NAME} - Plan Your Perfect Trip in Minutes`,
      description:
        'Generate personalized trip plans, optimize your budget, and discover destinations with AI-powered recommendations.',
      keywords:
        'trip planner, AI itinerary, travel recommendations, personalized vacation planner',
    },
  },
  {
    test: (pathname) => pathname === '/about',
    seo: {
      title: `About - ${SITE_NAME}`,
      description:
        'Learn about AdventureNexus, the AI-powered travel planning platform helping travelers build smarter itineraries.',
      keywords: 'about AdventureNexus, AI travel platform, travel planning startup',
    },
  },
  {
    test: (pathname) => pathname === '/contact',
    seo: {
      title: `Contact - ${SITE_NAME}`,
      description:
        'Contact the AdventureNexus team for support, partnerships, and product inquiries.',
      keywords: 'contact AdventureNexus, travel planner support, travel app contact',
    },
  },
  {
    test: (pathname) => pathname === '/search',
    seo: {
      title: `Search Destinations - ${SITE_NAME}`,
      description:
        'Search and compare travel destinations with AI-assisted insights and smart trip suggestions.',
      keywords: 'destination search, AI destination finder, travel discovery',
    },
  },
  {
    test: (pathname) => pathname.startsWith('/destination/'),
    seo: {
      title: `Destination Details - ${SITE_NAME}`,
      description:
        'Explore destination-specific highlights, activities, and planning insights for your next trip.',
      keywords: 'destination details, travel highlights, city travel guide',
    },
  },
  {
    test: (pathname) => pathname.startsWith('/shared-plan/'),
    seo: {
      title: `Shared Travel Plan - ${SITE_NAME}`,
      description:
        'View and explore a shared AdventureNexus itinerary with day-by-day travel recommendations.',
      keywords: 'shared itinerary, travel plan sharing, trip collaboration',
    },
  },
];

const upsertMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertCanonical = (url) => {
  let canonical = document.head.querySelector("link[rel='canonical']");

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', url);
};

const getSeoForPathname = (pathname) => {
  const match = routeSeoConfig.find((route) => route.test(pathname));
  return match ? match.seo : DEFAULT_SEO;
};

const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoForPathname(location.pathname);
    const canonicalUrl = `${SITE_URL}${location.pathname}`;

    document.title = seo.title;

    upsertMetaTag("meta[name='description']", {
      name: 'description',
      content: seo.description,
    });

    upsertMetaTag("meta[name='keywords']", {
      name: 'keywords',
      content: seo.keywords,
    });

    upsertMetaTag("meta[property='og:title']", {
      property: 'og:title',
      content: seo.title,
    });

    upsertMetaTag("meta[property='og:description']", {
      property: 'og:description',
      content: seo.description,
    });

    upsertMetaTag("meta[property='og:url']", {
      property: 'og:url',
      content: canonicalUrl,
    });

    upsertMetaTag("meta[property='og:image']", {
      property: 'og:image',
      content: DEFAULT_IMAGE,
    });

    upsertMetaTag("meta[name='twitter:title']", {
      name: 'twitter:title',
      content: seo.title,
    });

    upsertMetaTag("meta[name='twitter:description']", {
      name: 'twitter:description',
      content: seo.description,
    });

    upsertMetaTag("meta[name='twitter:image']", {
      name: 'twitter:image',
      content: DEFAULT_IMAGE,
    });

    upsertCanonical(canonicalUrl);
  }, [location.pathname]);

  return null;
};

export default SEO;
