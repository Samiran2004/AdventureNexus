import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
    TextInput, Linking, Alert, Animated, Dimensions,
    KeyboardAvoidingView, Platform, RefreshControl, ActivityIndicator, AppState
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import { theme } from '../styles/theme';
import BentoCard from '../components/common/BentoCard';
import {
    MapPin, Plane, Star, Search, Users, Bot, CheckCircle, Globe,
    Clock, Award, Sparkles, Zap, TrendingUp, Mail, Phone,
    MessageCircle, ArrowRight, Play, Instagram, Twitter, Linkedin,
    Youtube, Calendar, Sun, Cloud, CloudRain, CloudLightning,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const WIKI_HEADERS = { 'User-Agent': 'AdventureNexus/1.0 (https://adventurenexus.com; support@adventurenexus.com)' };

// ─── Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = ['Hiking', 'Kayaking', 'Biking', 'Camping', 'Beach', 'Culture'];

const FEATURED_DESTINATIONS = [
    {
        id: '1',
        title: "Heart of Norway's Majestic Forests",
        country: 'NORWAY',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        days: 7, distance: '10 km', rating: '8/10',
    },
    {
        id: '2',
        title: 'Discovering Austrian Mountains',
        country: 'AUSTRIA',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
        days: 10, distance: '15 km', rating: '9/10',
    },
    {
        id: '3',
        title: 'The Sounds of Nature',
        country: 'BELGIUM',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
        days: 5, distance: '8 km', rating: '7/10',
    },
];

const TESTIMONIALS = [
    {
        name: 'Samiran Samanta', role: 'Journey Lover', rating: 5,
        location: 'Bangkok, Thailand',
        content: '"Great tool! Very easy to use and gives smart, personalized travel plans. Adding more customization options would make it perfect."',
    },
    {
        name: 'Ritam Maity', role: 'Family Traveler', rating: 4,
        location: 'Tokyo, Japan',
        content: 'Wow! This AI Adventure Planner is seriously cool! It planned my whole trip in seconds and gave ideas I wouldn\'t have thought of.',
    },
    {
        name: 'Shounak Santra', role: 'Adventure Seeker', rating: 4,
        location: 'Argentina & Barcelona',
        content: 'A really helpful planner with clear itineraries and creative suggestions. The interface is simple and smooth. Great experience!',
    },
];

const PRICING_PLANS = [
    {
        name: 'Explorer', price: 'Free', period: '', popular: false,
        description: 'Perfect for occasional travelers',
        buttonText: 'Start Free',
        features: ['3 AI trip plans / month', 'Basic itinerary creation', 'Flight price alerts', 'Community support'],
    },
    {
        name: 'Adventurer', price: '₹999', period: '/year', popular: true,
        description: 'Most popular for frequent travelers',
        buttonText: 'Start Free Trial',
        features: ['Unlimited AI trip plans', 'Price tracking for flights', 'Local transport suggestions', 'Region-aware recommendations'],
    },
    {
        name: 'Premium Pro', price: '₹2999', period: '/year', popular: false,
        description: 'For travel professionals',
        buttonText: 'Go Premium Pro',
        features: ['Everything in Adventurer', 'Unlimited Group Planning', 'Custom integrations', 'Priority Booking', 'Guided Planning With AI', 'Smart Hotel & Flight Redirection'],
    },
];

const FOOTER_LINKS = [
    { group: 'Explore', links: ['Popular Destinations', 'Trip Planner', 'Travel Guides', 'Adventure Tours'] },
    { group: 'Company', links: ['About Us', 'How It Works', 'Partners', 'Press & Media'] },
    { group: 'Support', links: ['Help Center', 'Contact Us', 'Safety Guidelines', 'Community'] },
];

// ─── Sub-components ─────────────────────────────────────────────────────────
function StarRow({ count }: { count: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={13} color={n <= count ? '#FFD700' : '#DDD'} fill={n <= count ? '#FFD700' : 'transparent'} />
            ))}
        </View>
    );
}

// Animated counter
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let c = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
            c = Math.min(c + step, target);
            setCount(c);
            if (c >= target) clearInterval(timer);
        }, 40);
        return () => clearInterval(timer);
    }, [target]);
    return <Text style={styles.counterText}>{count}{suffix}</Text>;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }: any) {
    const [activeCategory, setActiveCategory] = useState(0);
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const { user } = useUser();
    const [refreshing, setRefreshing] = useState(false);
    const [weather, setWeather] = useState<{ temp: number; icon: string; city: string } | null>(null);
    const [dateTime, setDateTime] = useState({ time: '', date: '' });
    const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
    const [loadingWeather, setLoadingWeather] = useState(false);
    const appState = useRef(AppState.currentState);

    const fetchWeather = async () => {
        try {
            setLoadingWeather(true);
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setLocationEnabled(false);
                setLoadingWeather(false);
                return;
            }

            // Check if location services are enabled to avoid "unsatisfied device settings" error
            const servicesEnabled = await Location.hasServicesEnabledAsync();
            if (!servicesEnabled) {
                console.log("Location services are disabled");
                setLocationEnabled(false);
                setLoadingWeather(false);
                return;
            }

            setLocationEnabled(true);
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            const { latitude, longitude } = location.coords;

            // Reverse Geocode to get city name with timeout
            let city = 'Somewhere';
            try {
                const geocodePromise = Location.reverseGeocodeAsync({ latitude, longitude });
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Geocode timeout')), 5000)
                );

                const results: any = await Promise.race([geocodePromise, timeoutPromise]);
                if (Array.isArray(results) && results.length > 0) {
                    const address = results[0];
                    city = address?.city || address?.region || 'Somewhere';
                }
            } catch (err) {
                console.warn("Geocoding failed or timed out:", err);
            }

            // Fetch weather from Open-Meteo
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherRes.json();

            if (weatherData.current_weather) {
                setWeather({
                    temp: Math.round(weatherData.current_weather.temperature),
                    icon: getWeatherEmoji(weatherData.current_weather.weathercode),
                    city: city
                });
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            setLocationEnabled(false);
        } finally {
            setLoadingWeather(false);
        }
    };

    useEffect(() => {
        // Update clock every minute
        const updateClock = () => {
            const now = new Date();
            setDateTime({
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: now.toLocaleDateString([], { month: 'short', day: 'numeric' })
            });
        };

        updateClock();
        const timer = setInterval(updateClock, 60000);

        // Initial fetch
        fetchWeather();

        // Listen for AppState changes to handle permission updates
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App has come to the foreground, check location again
                fetchWeather();
            }
            appState.current = nextAppState;
        });

        return () => {
            clearInterval(timer);
            subscription.remove();
        };
    }, []);

    const getWeatherEmoji = (code: number) => {
        if (code === 0) return '☀️'; // Clear sky
        if (code <= 3) return '🌤️'; // Partly cloudy
        if (code <= 48) return '🌫️'; // Fog
        if (code <= 67) return '🌧️'; // Rain
        if (code <= 77) return '❄️'; // Snow
        if (code <= 82) return '🌦️'; // Showers
        if (code <= 99) return '⛈️'; // Thunderstorm
        return '☀️';
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchWeather();
        setTimeout(() => setRefreshing(false), 1500);
    }, [locationEnabled]);

    const handleSubscribe = async () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        try {
            setSubscribing(true);
            const res = await fetch('https://adventurenexus.onrender.com/api/v1/mail/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMail: email.trim() }),
            });
            const data = await res.json();
            Alert.alert('Subscribed! 🎉', data.message || data.data || 'You\'ll receive travel tips soon!');
            setEmail('');
        } catch {
            Alert.alert('Error', 'Could not subscribe. Try again later.');
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {/* ─── 1. HEADER ─────────────────────────────────────────────────── */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hi, {user?.firstName || user?.username || 'Explorer'} 👋</Text>
                        <Text style={styles.subGreeting}>Where to next?</Text>
                    </View>
                    <View style={styles.weatherWidget}>
                        {loadingWeather ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : locationEnabled && weather ? (
                            <>
                                <Text style={styles.weatherEmoji}>{weather.icon}</Text>
                                <View>
                                    <Text style={styles.weatherLabel} numberOfLines={1}>{weather.city}</Text>
                                    <Text style={styles.weatherValue}>{weather.temp} °C</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <Clock size={18} color={theme.colors.primary} />
                                <View>
                                    <Text style={styles.weatherLabel}>{dateTime.date}</Text>
                                    <Text style={styles.weatherValue}>{dateTime.time}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* ─── 2. HERO ───────────────────────────────────────────────────── */}
                <View style={styles.heroSection}>
                    <View style={styles.aiBadge}>
                        <Sparkles size={12} color={theme.colors.primary} />
                        <Text style={styles.aiBadgeText}>AI-Powered Travel Planning</Text>
                        <Zap size={11} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.heroTitle}>Your Dream{'\n'}Adventure</Text>
                    <Text style={styles.heroTitleAccent}>Starts Here</Text>

                    <Text style={styles.heroSubtitle}>
                        Intelligent travel planning powered by AI. Personalized itineraries,
                        hidden destinations, perfect trips — all in one place.
                    </Text>

                    {/* CTA Buttons */}
                    <View style={styles.heroButtons}>
                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => navigation.navigate('Search')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.primaryBtnText}>Start Planning Free</Text>
                            <ArrowRight size={18} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.85}>
                            <Play size={16} color={theme.colors.primary} />
                            <Text style={styles.outlineBtnText}>See How It Works</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Trust badges */}
                    <View style={styles.trustRow}>
                        {['Free to start', 'AI-powered', 'No credit card'].map(t => (
                            <View key={t} style={styles.trustItem}>
                                <CheckCircle size={12} color="#22C55E" />
                                <Text style={styles.trustText}>{t}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ─── 3. AI STATS CARD ──────────────────────────────────────────── */}
                <BentoCard style={styles.statsCard}>
                    <View style={styles.statsCardHeader}>
                        <Text style={styles.statsCardTitle}>Trip Planner Dashboard</Text>
                        <View style={styles.aiActiveBadge}>
                            <View style={styles.aiDot} />
                            <Text style={styles.aiActiveText}>AI Active</Text>
                        </View>
                    </View>
                    <View style={styles.statsRow}>
                        <BentoCard style={styles.statMini}>
                            <MapPin size={20} color={theme.colors.primary} />
                            <AnimatedCounter target={195} />
                            <Text style={styles.statMiniLabel}>Countries</Text>
                        </BentoCard>
                        <BentoCard style={styles.statMini}>
                            <Users size={20} color="#22C55E" />
                            <AnimatedCounter target={5} suffix="+" />
                            <Text style={styles.statMiniLabel}>Happy Travelers</Text>
                        </BentoCard>
                    </View>
                    <View style={styles.aiProgressRow}>
                        <Bot size={16} color={theme.colors.primary} />
                        <View style={styles.aiProgressBar}>
                            <Text style={styles.aiProgressText}>Planning your 7-day Japan adventure…</Text>
                            <View style={styles.progressTrack}>
                                <View style={styles.progressFill} />
                            </View>
                        </View>
                    </View>
                </BentoCard>

                {/* ─── 4. SEARCH BAR ─────────────────────────────────────────────── */}
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => navigation.navigate('Search')}
                    activeOpacity={0.8}
                >
                    <Search size={18} color={theme.colors.text.secondary} />
                    <Text style={styles.searchPlaceholder}>Search destinations with AI…</Text>
                    <View style={styles.searchSparkle}>
                        <Sparkles size={14} color={theme.colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* ─── 5. CATEGORY PILLS ─────────────────────────────────────────── */}
                <ScrollView
                    horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {CATEGORIES.map((cat, i) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.pill, i === activeCategory && styles.pillActive]}
                            onPress={() => setActiveCategory(i)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.pillText, i === activeCategory && styles.pillTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ─── 6. HERO FEATURED CARD ─────────────────────────────────────── */}
                <BentoCard
                    style={styles.heroCard}
                    onPress={() => navigation.navigate('Details', { plan: FEATURED_DESTINATIONS[0] })}
                >
                    <Image source={{ uri: FEATURED_DESTINATIONS[0].image, headers: WIKI_HEADERS }} style={styles.heroImage} resizeMode="cover" />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContentBox}>
                        <Text style={styles.heroCountry}>🇳🇴  {FEATURED_DESTINATIONS[0].country}</Text>
                        <Text style={styles.heroCardTitle}>{FEATURED_DESTINATIONS[0].title}</Text>
                        <Text style={styles.heroCardSub}>
                            A real adventure where nature reveals its grandeur in its purest form.
                        </Text>
                        <View style={styles.heroStatRow}>
                            <Text style={styles.heroStat}>📅 {FEATURED_DESTINATIONS[0].days} days</Text>
                            <Text style={styles.heroStat}>📍 {FEATURED_DESTINATIONS[0].distance}</Text>
                            <Text style={styles.heroStat}>⭐ {FEATURED_DESTINATIONS[0].rating}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.startBtn}
                            onPress={() => navigation.navigate('Search')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.startBtnText}>Start Trip →</Text>
                        </TouchableOpacity>
                    </View>
                </BentoCard>

                {/* ─── 7. POPULAR BENTO GRID ─────────────────────────────────────── */}
                <Text style={styles.sectionTitle}>Popular</Text>
                {FEATURED_DESTINATIONS.slice(1).map(dest => (
                    <BentoCard
                        key={dest.id}
                        style={styles.bentoCard}
                        onPress={() => navigation.navigate('Details', { plan: dest })}
                    >
                        <Image source={{ uri: dest.image, headers: WIKI_HEADERS }} style={styles.bentoImage} resizeMode="cover" />
                        <View style={styles.bentoOverlay} />
                        <View style={styles.bentoInfo}>
                            <Text style={styles.bentoCountry}>{dest.country}</Text>
                            <Text style={styles.bentoTitle}>{dest.title}</Text>
                            <Text style={styles.bentoStat}>📅 {dest.days} days  📍 {dest.distance}</Text>
                        </View>
                    </BentoCard>
                ))}

                {/* ─── 8. TESTIMONIALS ───────────────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Star size={20} color={theme.colors.primary} fill={theme.colors.primary} />
                    <Text style={styles.sectionTitle}>Travelers Love AdventureNexus</Text>
                    <Star size={20} color={theme.colors.secondary} fill={theme.colors.secondary} />
                </View>
                <Text style={styles.sectionSubtitle}>See what our community of adventurers is saying</Text>
                {TESTIMONIALS.map((t, i) => (
                    <BentoCard key={i} style={styles.testimonialCard}>
                        <StarRow count={t.rating} />
                        <Text style={styles.testimonialContent}>{t.content}</Text>
                        <View style={styles.testimonialFooter}>
                            <View style={styles.testimonialAvatar}>
                                <Text style={styles.avatarInitials}>
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </Text>
                                <View style={styles.onlineDot} />
                            </View>
                            <View>
                                <Text style={styles.testimonialName}>{t.name}</Text>
                                <Text style={styles.testimonialMeta}>{t.role} • {t.location}</Text>
                            </View>
                        </View>
                    </BentoCard>
                ))}

                {/* ─── 9. PRICING ────────────────────────────────────────────────── */}
                <View style={[styles.sectionHeader, { marginTop: 12 }]}>
                    <TrendingUp size={20} color={theme.colors.primary} />
                    <Text style={styles.sectionTitle}>Simple, Transparent Pricing</Text>
                </View>
                <Text style={styles.sectionSubtitle}>Choose the plan that fits your travel style</Text>
                {PRICING_PLANS.map((plan, i) => (
                    <View key={i} style={[styles.pricingCard, plan.popular && styles.pricingCardPopular]}>
                        {plan.popular && (
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularBadgeText}>⭐ Most Popular</Text>
                            </View>
                        )}
                        <View style={styles.pricingHeader}>
                            <Text style={styles.planName}>{plan.name}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.planPrice}>{plan.price}</Text>
                                <Text style={styles.planPeriod}>{plan.period}</Text>
                            </View>
                            <Text style={styles.planDesc}>{plan.description}</Text>
                        </View>
                        <View style={styles.pricingDivider} />
                        <View style={styles.featuresList}>
                            {plan.features.map((f, j) => (
                                <View key={j} style={styles.featureRow}>
                                    <CheckCircle size={14} color="#22C55E" />
                                    <Text style={styles.featureText}>{f}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={[styles.planBtn, plan.popular && styles.planBtnPopular]}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('Search')}
                        >
                            <Text style={[styles.planBtnText, plan.popular && styles.planBtnTextPopular]}>
                                {plan.buttonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* ─── 10. CTA SECTION ───────────────────────────────────────────── */}
                <View style={styles.ctaSection}>
                    <Text style={styles.ctaEmoji}>✨</Text>
                    <Text style={styles.ctaTitle}>Ready to Plan Your{'\n'}Next Adventure?</Text>
                    <Text style={styles.ctaSubtitle}>
                        Join thousands of adventurers who trust AdventureNexus to create unforgettable journeys.
                    </Text>
                    <TouchableOpacity
                        style={styles.ctaPrimaryBtn}
                        onPress={() => navigation.navigate('Search')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.ctaPrimaryBtnText}>Start Planning Now →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.ctaSecondaryBtn}
                        onPress={() => navigation.navigate('Reviews')}
                        activeOpacity={0.85}
                    >
                        <MessageCircle size={16} color="#FFF" />
                        <Text style={styles.ctaSecondaryBtnText}>Talk to Community</Text>
                    </TouchableOpacity>
                    <View style={styles.ctaTrustRow}>
                        <Text style={styles.ctaTrustItem}><Award size={12} color="rgba(255,255,255,0.8)" /> Smart AI</Text>
                        <Text style={styles.ctaTrustItem}><Clock size={12} color="rgba(255,255,255,0.8)" /> Instant plans</Text>
                        <Text style={styles.ctaTrustItem}><Globe size={12} color="rgba(255,255,255,0.8)" /> 195+ destinations</Text>
                    </View>
                </View>

                {/* ─── 11. NEWSLETTER / SUBSCRIBE ────────────────────────────────── */}
                <BentoCard style={styles.subscribeCard}>
                    <Text style={styles.subscribeTitle}>Start Your Next Adventure 🌍</Text>
                    <Text style={styles.subscribeSubtitle}>
                        Join thousands of adventurers. Get personalized trip recommendations and exclusive travel deals.
                    </Text>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=600&auto=format&fit=crop' }}
                        style={styles.subscribeImage}
                        resizeMode="cover"
                    />
                    <TextInput
                        style={styles.emailInput}
                        placeholder="Enter your email address"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={[styles.subscribeBtn, subscribing && { opacity: 0.7 }]}
                        onPress={handleSubscribe}
                        disabled={subscribing}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.subscribeBtnText}>
                            {subscribing ? 'Subscribing…' : '🚀 Get Travel Tips'}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.subscribeNote}>No spam. Unsubscribe anytime.</Text>
                </BentoCard>

                {/* ─── 12. FOOTER ────────────────────────────────────────────────── */}
                <View style={styles.footer}>
                    <Text style={styles.footerBrand}>🧭 AdventureNexus</Text>
                    <Text style={styles.footerTagline}>
                        AI-powered travel planning for unforgettable adventures worldwide.
                    </Text>

                    {/* Contact */}
                    <View style={styles.footerContact}>
                        <View style={styles.footerContactRow}>
                            <Mail size={13} color={theme.colors.primary} />
                            <Text style={styles.footerContactText}>adventurenexus.org@gmail.com</Text>
                        </View>
                        <View style={styles.footerContactRow}>
                            <Phone size={13} color={theme.colors.primary} />
                            <Text style={styles.footerContactText}>00000 00000</Text>
                        </View>
                        <View style={styles.footerContactRow}>
                            <MapPin size={13} color={theme.colors.primary} />
                            <Text style={styles.footerContactText}>AdventureNexus HQ</Text>
                        </View>
                    </View>

                    {/* Social */}
                    <View style={styles.socialRow}>
                        {[
                            { Icon: Instagram, url: 'https://instagram.com/adventurenexus' },
                            { Icon: Twitter, url: 'https://twitter.com/adventurenexus' },
                            { Icon: Linkedin, url: 'https://linkedin.com/company/adventurenexus' },
                            { Icon: Youtube, url: 'https://youtube.com/adventurenexus' },
                        ].map(({ Icon, url }, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.socialIcon}
                                onPress={() => Linking.openURL(url)}
                            >
                                <Icon size={18} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer columns */}
                    {FOOTER_LINKS.map(col => (
                        <View key={col.group} style={styles.footerColumn}>
                            <Text style={styles.footerColumnTitle}>{col.group}</Text>
                            {col.links.map(link => (
                                <Text key={link} style={styles.footerLink}>{link}</Text>
                            ))}
                        </View>
                    ))}

                    {/* Trust badges */}
                    <View style={styles.trustBadges}>
                        {['✈️ 5+ Trips Planned', '🌍 200+ Destinations', '⭐ 4.9/5 Rating', '🔒 Secure & Trusted'].map(b => (
                            <View key={b} style={styles.trustBadge}>
                                <Text style={styles.trustBadgeText}>{b}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.footerDivider} />
                    <Text style={styles.footerCopyright}>© 2025 AdventureNexus. All rights reserved.</Text>
                    <Text style={styles.footerMadeWith}>Made with ❤️ for adventurous souls worldwide</Text>
                    <View style={styles.legalRow}>
                        {['Terms', 'Privacy', 'Cookies', 'Accessibility'].map(l => (
                            <Text key={l} style={styles.legalLink}>{l}</Text>
                        ))}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </Animated.ScrollView>

            {/* ─── BOTTOM TAB BAR placeholder (handled by navigator) ─────────── */}
        </SafeAreaView>
    );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const C = theme.colors;
const R = theme.borderRadius;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    container: { flex: 1 },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 20, marginBottom: 24,
    },
    greeting: { fontSize: 22, fontWeight: '700', color: C.text.primary },
    subGreeting: { fontSize: 13, color: C.text.secondary, marginTop: 2 },
    weatherWidget: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 10, paddingHorizontal: 14,
        borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    weatherEmoji: { fontSize: 20 },
    weatherLabel: { fontSize: 10, color: C.text.secondary },
    weatherValue: { fontSize: 14, fontWeight: '700', color: C.text.primary },

    // ── Hero ────────────────────────────────────────────────────────────────
    heroSection: { paddingHorizontal: 20, marginBottom: 24 },
    aiBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(37,99,235,0.3)',
        paddingVertical: 6, paddingHorizontal: 14, borderRadius: R.round, marginBottom: 14,
    },
    aiBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
    heroTitle: { fontSize: 44, fontWeight: '900', color: C.text.primary, lineHeight: 46 },
    heroTitleAccent: { fontSize: 44, fontWeight: '900', color: C.primary, lineHeight: 46, marginBottom: 14 },
    heroSubtitle: { fontSize: 14, color: C.text.secondary, lineHeight: 21, marginBottom: 24 },
    heroButtons: { gap: 12, marginBottom: 20 },
    primaryBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        backgroundColor: '#FFF', paddingVertical: 16, borderRadius: R.round,
        shadowColor: 'rgba(255,255,255,0.15)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20,
    },
    primaryBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
    outlineBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 14, borderRadius: R.round,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    outlineBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
    trustRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
    trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    trustText: { fontSize: 11, color: C.text.secondary, fontWeight: '600' },

    // ── AI Stats Card ────────────────────────────────────────────────────────
    statsCard: { marginHorizontal: 20, marginBottom: 20, padding: 20 },
    statsCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    statsCardTitle: { fontSize: 15, fontWeight: '800', color: C.text.primary },
    aiActiveBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(34,197,94,0.1)', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20,
    },
    aiDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.success },
    aiActiveText: { fontSize: 11, color: theme.colors.success, fontWeight: '700' },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statMini: { flex: 1, alignItems: 'center', padding: 16 },
    counterText: { fontSize: 26, fontWeight: '900', color: C.text.primary, marginTop: 6 },
    statMiniLabel: { fontSize: 11, color: C.text.secondary, marginTop: 2, fontWeight: '600' },
    aiProgressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    aiProgressBar: { flex: 1 },
    aiProgressText: { fontSize: 12, color: C.text.secondary, marginBottom: 8 },
    progressTrack: { height: 6, backgroundColor: C.accent, borderRadius: 10, overflow: 'hidden' },
    progressFill: { height: '100%', width: '75%', backgroundColor: C.primary, borderRadius: 10 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: R.round,
        paddingVertical: 14, paddingHorizontal: 20, marginHorizontal: 20, marginBottom: 20,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    searchPlaceholder: { flex: 1, color: C.text.secondary, fontSize: 13 },
    searchSparkle: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center',
    },

    categoryScroll: { paddingLeft: 20, paddingRight: 10, paddingBottom: 20, gap: 10 },
    pill: {
        paddingVertical: 10, paddingHorizontal: 22, borderRadius: R.round,
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    pillActive: { backgroundColor: '#FFF' },
    pillText: { fontSize: 13, fontWeight: '600', color: C.text.primary },
    pillTextActive: { color: '#000' },

    // ── Hero featured card ───────────────────────────────────────────────────
    heroCard: { height: 400, padding: 0, marginHorizontal: 20, marginBottom: 28, borderRadius: R.xl },
    heroImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: R.xl },
    heroOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: R.xl,
        backgroundColor: 'rgba(0,0,0,0.38)',
    },
    heroContentBox: { flex: 1, justifyContent: 'flex-end', padding: 24 },
    heroCountry: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 1.5, marginBottom: 8 },
    heroCardTitle: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 8 },
    heroCardSub: { fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 19, marginBottom: 14 },
    heroStatRow: { flexDirection: 'row', gap: 14, marginBottom: 18 },
    heroStat: { fontSize: 12, color: '#FFF', fontWeight: '600' },
    startBtn: {
        backgroundColor: '#FFF', paddingVertical: 14, borderRadius: R.round, alignItems: 'center', width: '50%',
        shadowColor: 'rgba(255,255,255,0.2)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15,
    },
    startBtnText: { color: '#000', fontWeight: '800', fontSize: 15 },

    // ── Section headers ──────────────────────────────────────────────────────
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginBottom: 4 },
    sectionTitle: { fontSize: 26, fontWeight: '800', color: C.text.primary, paddingHorizontal: 20, marginBottom: 16 },
    sectionSubtitle: { fontSize: 14, color: C.text.secondary, paddingHorizontal: 20, marginBottom: 20, lineHeight: 20 },

    // ── Bento cards ──────────────────────────────────────────────────────────
    bentoCard: { height: 200, padding: 0, marginHorizontal: 20, marginBottom: 14, borderRadius: R.lg },
    bentoImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: R.lg },
    bentoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: R.lg, backgroundColor: 'rgba(0,0,0,0.36)' },
    bentoInfo: { flex: 1, justifyContent: 'flex-end', padding: 18 },
    bentoCountry: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 1.5, marginBottom: 4 },
    bentoTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 5 },
    bentoStat: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

    // ── Testimonials ─────────────────────────────────────────────────────────
    testimonialCard: { padding: 20, marginHorizontal: 20, marginBottom: 14, borderRadius: R.lg },
    testimonialContent: { fontSize: 13, color: C.text.secondary, lineHeight: 20, fontStyle: 'italic', marginVertical: 12 },
    testimonialFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 14 },
    testimonialAvatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center',
    },
    avatarInitials: { color: '#FFF', fontWeight: '800', fontSize: 14 },
    onlineDot: {
        position: 'absolute', bottom: -1, right: -1,
        width: 11, height: 11, borderRadius: 6, backgroundColor: theme.colors.success,
        borderWidth: 2, borderColor: '#FFF',
    },
    testimonialName: { fontSize: 13, fontWeight: '800', color: C.text.primary },
    testimonialMeta: { fontSize: 11, color: C.text.secondary, marginTop: 1 },

    // ── Pricing ───────────────────────────────────────────────────────────────
    pricingCard: {
        marginHorizontal: 20, marginBottom: 16, padding: 24,
        backgroundColor: C.card.background, borderRadius: R.lg,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    },
    pricingCardPopular: { borderColor: C.primary, borderWidth: 2, transform: [{ scale: 1.02 }] },
    popularBadge: {
        alignSelf: 'center', backgroundColor: C.primary,
        paddingVertical: 5, paddingHorizontal: 16, borderRadius: R.round, marginBottom: 12,
    },
    popularBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
    pricingHeader: { marginBottom: 16 },
    planName: { fontSize: 22, fontWeight: '900', color: C.text.primary, marginBottom: 6 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 6 },
    planPrice: { fontSize: 36, fontWeight: '900', color: C.text.primary },
    planPeriod: { fontSize: 14, color: C.text.secondary },
    planDesc: { fontSize: 13, color: C.text.secondary },
    pricingDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: 16 },
    featuresList: { gap: 10, marginBottom: 20 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    featureText: { fontSize: 13, color: C.text.secondary, flex: 1 },
    planBtn: {
        paddingVertical: 14, borderRadius: R.round, alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    planBtnPopular: { backgroundColor: '#FFF', borderColor: '#FFF', shadowColor: 'rgba(255,255,255,0.2)', shadowOpacity: 1, shadowRadius: 15 },
    planBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
    planBtnTextPopular: { color: '#000' },

    // ── CTA Section ──────────────────────────────────────────────────────────
    ctaSection: {
        marginHorizontal: 20, marginBottom: 28, padding: 28,
        backgroundColor: '#0A0A0A', borderRadius: R.xl, alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    ctaEmoji: { fontSize: 40, marginBottom: 12 },
    ctaTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', textAlign: 'center', lineHeight: 32, marginBottom: 12 },
    ctaSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
    ctaPrimaryBtn: {
        backgroundColor: '#FFF', paddingVertical: 14, paddingHorizontal: 32,
        borderRadius: R.round, marginBottom: 12, width: '100%', alignItems: 'center',
        shadowColor: 'rgba(255,255,255,0.2)', shadowOpacity: 1, shadowRadius: 15,
    },
    ctaPrimaryBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
    ctaSecondaryBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: 'transparent',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, paddingHorizontal: 28,
        borderRadius: R.round, marginBottom: 20, width: '100%', justifyContent: 'center',
    },
    ctaSecondaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    ctaTrustRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
    ctaTrustItem: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },

    // ── Newsletter / Subscribe ────────────────────────────────────────────────
    subscribeCard: { marginHorizontal: 20, marginBottom: 28, padding: 24 },
    subscribeTitle: { fontSize: 22, fontWeight: '900', color: C.text.primary, marginBottom: 8 },
    subscribeSubtitle: { fontSize: 13, color: C.text.secondary, lineHeight: 20, marginBottom: 16 },
    subscribeImage: { width: '100%', height: 160, borderRadius: R.md, marginBottom: 20 } as const,
    emailInput: {
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: R.md, padding: 14,
        fontSize: 14, color: C.text.primary, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    subscribeBtn: {
        backgroundColor: '#FFF', paddingVertical: 14, borderRadius: R.round, alignItems: 'center',
        shadowColor: 'rgba(255,255,255,0.2)', shadowOpacity: 1, shadowRadius: 15,
    },
    subscribeBtnText: { color: '#000', fontSize: 15, fontWeight: '800' },
    subscribeNote: { textAlign: 'center', color: C.text.secondary, fontSize: 11, marginTop: 10 },

    // ── Footer ───────────────────────────────────────────────────────────────
    footer: { backgroundColor: C.background, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
    footerBrand: { fontSize: 22, fontWeight: '900', color: C.text.primary, marginBottom: 8 },
    footerTagline: { fontSize: 13, color: C.text.secondary, lineHeight: 20, marginBottom: 20 },
    footerContact: { gap: 8, marginBottom: 20 },
    footerContactRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    footerContactText: { fontSize: 12, color: C.text.secondary },
    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    socialIcon: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: C.accent,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    },
    footerColumn: { marginBottom: 20 },
    footerColumnTitle: { fontSize: 14, fontWeight: '800', color: C.text.primary, marginBottom: 10 },
    footerLink: { fontSize: 13, color: C.text.secondary, marginBottom: 6 },
    trustBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    trustBadge: {
        backgroundColor: C.accent, paddingVertical: 6, paddingHorizontal: 14, borderRadius: R.round,
    },
    trustBadgeText: { fontSize: 11, color: C.text.primary, fontWeight: '600' },
    footerDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.07)', marginBottom: 16 },
    footerCopyright: { fontSize: 12, color: C.text.secondary, textAlign: 'center', marginBottom: 4 },
    footerMadeWith: { fontSize: 11, color: C.text.secondary, textAlign: 'center', marginBottom: 16 },
    legalRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
    legalLink: { fontSize: 11, color: C.text.secondary },
});
