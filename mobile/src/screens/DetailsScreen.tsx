import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import BentoCard from '../components/common/BentoCard';
import { ChevronLeft, Star, Clock, MapPin, Sparkles } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import { planService } from '../services/planService';

const { width } = Dimensions.get('window');

export default function DetailsScreen({ navigation, route }: any) {
    const { plan } = route.params || {};
    const { getToken } = useAuth();
    const [images, setImages] = useState<string[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);

    useEffect(() => {
        if (plan?.name) {
            loadImages();
        }
    }, [plan?.name]);

    const loadImages = async () => {
        try {
            setIsLoadingImages(true);
            const token = await getToken();
            if (token) {
                const res = await planService.getDestinationImages(token, plan.name);
                if (res?.data) {
                    setImages(res.data);
                }
            }
        } catch (err) {
            console.error('Failed to load images:', err);
        } finally {
            setIsLoadingImages(false);
        }
    };

    if (!plan) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Plan not found</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backLink}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const mainImage = images.length > 0 ? images[0] : plan.image_url;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ── Immersive Photo with Curved Mask ── */}
                <View style={styles.imageContainer}>
                    {mainImage ? (
                        <Image
                            source={{ uri: mainImage }}
                            style={styles.mainImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.mainImage, { backgroundColor: theme.colors.accent }]} />
                    )}
                    {/* Dark overlay */}
                    <View style={styles.imageOverlay} />

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>

                    {/* AI Score badge */}
                    {plan.ai_score && (
                        <View style={styles.weatherBadge}>
                            <Text style={styles.weatherBadgeText}>✨ {plan.ai_score} AI Score</Text>
                        </View>
                    )}

                    {/* Title */}
                    <View style={styles.imageInfo}>
                        <Text style={styles.imageTitle}>{plan.name}</Text>
                    </View>

                    {/* Curved mask */}
                    <View style={styles.curvedMask} />
                </View>

                {/* ── Detail Content ── */}
                <View style={styles.content}>
                    {/* Country/Category */}
                    <View style={styles.countryRow}>
                        <Sparkles size={14} color={theme.colors.primary} />
                        <Text style={styles.country}>AI GENERATED PLAN</Text>
                    </View>

                    <Text style={styles.mainTitle}>{plan.destination_overview || plan.name}</Text>

                    {/* Quick stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statChip}>
                            <Clock size={14} color={theme.colors.primary} />
                            <Text style={styles.statChipText}>{plan.days || plan.duration || '?'} days</Text>
                        </View>
                        {plan.cost && (
                            <View style={styles.statChip}>
                                <Text style={styles.statChipText}>💰 ${plan.cost.toLocaleString()}</Text>
                            </View>
                        )}
                        <View style={styles.statChip}>
                            <Star size={14} color={theme.colors.primary} />
                            <Text style={styles.statChipText}>{plan.rating || '4.8'}/5</Text>
                        </View>
                    </View>

                    {/* Photo Gallery */}
                    <Text style={styles.sectionLabel}>Photo Gallery</Text>
                    {isLoadingImages ? (
                        <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 20 }} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                            {images.map((img, idx) => (
                                <View key={idx} style={styles.galleryItem}>
                                    <Image source={{ uri: img }} style={styles.galleryImage} />
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    {/* Itinerary/Overview */}
                    <Text style={styles.sectionLabel}>Plan Overview</Text>
                    <BentoCard style={{ padding: 20, marginBottom: 24 }}>
                        <Text style={{ fontSize: 14, color: theme.colors.text.secondary, lineHeight: 22 }}>
                            {plan.itinerary || plan.destination_overview || 'No detailed itinerary available for this plan.'}
                        </Text>
                    </BentoCard>

                    {/* CTA */}
                    <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Save to My Trips ✨</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 18, color: theme.colors.text.primary, marginBottom: 10 },
    backLink: { color: theme.colors.primary, fontWeight: '700' },

    // Image Section
    imageContainer: { height: 480, width: '100%' },
    mainImage: { width: '100%', height: '100%', position: 'absolute' },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.30)',
    },
    backBtn: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    weatherBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    weatherBadgeText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
    imageInfo: { position: 'absolute', bottom: 80, left: 24, right: 24 },
    imageTitle: {
        fontSize: 38,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 42,
    },
    curvedMask: {
        position: 'absolute',
        bottom: -1,
        width: '100%',
        height: 60,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },

    // Content
    content: { paddingHorizontal: 24, paddingBottom: 40 },
    countryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
    country: { fontSize: 12, fontWeight: '800', color: theme.colors.primary, letterSpacing: 2 },
    mainTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.text.primary,
        marginBottom: 20,
        lineHeight: 28,
    },

    // Stats
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    statChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statChipText: { fontSize: 12, fontWeight: '700', color: theme.colors.text.primary },

    // Gallery
    dateScroll: { marginBottom: 24 },
    galleryItem: {
        width: 150,
        height: 200,
        borderRadius: 20,
        marginRight: 12,
        overflow: 'hidden',
    },
    galleryImage: { width: '100%', height: '100%' },

    sectionLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text.primary,
        marginBottom: 14,
    },

    // CTA
    bookBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 40,
        alignItems: 'center',
    },
    bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
