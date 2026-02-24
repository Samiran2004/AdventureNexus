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
    Modal,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../styles/theme';
import BentoCard from '../components/common/BentoCard';
import { ChevronLeft, Star, Clock, MapPin, Sparkles, X, Info, CheckCircle2, Sunrise, Sun, Sunset } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import { planService } from '../services/planService';

const { width } = Dimensions.get('window');

export default function DetailsScreen({ navigation, route }: any) {
    const { plan } = route.params || {};
    const { getToken } = useAuth();
    const [images, setImages] = useState<string[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [isMapVisible, setIsMapVisible] = useState(false);

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
                            <Sparkles size={14} color="#FFD700" />
                            <Text style={styles.weatherBadgeText}>{plan.ai_score}% Match</Text>
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
                                <TouchableOpacity key={idx} style={styles.galleryItem} onPress={() => setSelectedImage(img)}>
                                    <Image source={{ uri: img }} style={styles.galleryImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {/* Perfect For / Tags */}
                    {plan.perfect_for && plan.perfect_for.length > 0 && (
                        <View style={styles.tagContainer}>
                            {plan.perfect_for.map((tag: string, idx: number) => (
                                <View key={idx} style={styles.tag}>
                                    <Text style={styles.tagText}>#{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Day by Day Itinerary */}
                    {plan.suggested_itinerary && plan.suggested_itinerary.length > 0 && (
                        <>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionLabel}>📅 Trip Timeline</Text>
                                <TouchableOpacity style={styles.mapTrigger} onPress={() => setIsMapVisible(true)}>
                                    <MapPin size={16} color={theme.colors.primary} />
                                    <Text style={styles.mapTriggerText}>View Map</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.timelineContainer}>
                                {plan.suggested_itinerary.map((day: any, idx: number) => (
                                    <View key={idx} style={styles.timelineItem}>
                                        {/* Timeline Left: Massive Day Indicator */}
                                        <View style={styles.timelineLeftColumn}>
                                            <View style={styles.dayCircle}>
                                                <Text style={styles.dayCircleLabel}>DAY</Text>
                                                <Text style={styles.dayCircleNumber}>{idx + 1}</Text>
                                            </View>
                                            {idx < plan.suggested_itinerary.length - 1 && <View style={styles.timelineVerticalLine} />}
                                        </View>

                                        {/* Timeline Right: Content */}
                                        <View style={styles.timelineRightColumn}>
                                            <View style={styles.dayHeader}>
                                                <Text style={styles.dayTitleText}>{day.title || `Exploring ${plan.to}`}</Text>
                                                <Text style={styles.dayBriefText} numberOfLines={2}>{day.description}</Text>
                                            </View>

                                            <View style={styles.slotsWrapper}>
                                                {['morning', 'afternoon', 'evening'].map((slot) => {
                                                    if (!day[slot]) return null;
                                                    const Icon = slot === 'morning' ? Sunrise : slot === 'afternoon' ? Sun : Sunset;
                                                    const bgColor = slot === 'morning' ? '#FFF7ED' : slot === 'afternoon' ? '#FEFCE8' : '#FAF5FF';
                                                    const iconColor = slot === 'morning' ? '#EA580C' : slot === 'afternoon' ? '#CA8A04' : '#9333EA';

                                                    return (
                                                        <View key={slot} style={[styles.premiumSlotCard, { backgroundColor: '#FFF' }]}>
                                                            <View style={[styles.slotIconBox, { backgroundColor: bgColor }]}>
                                                                <Icon size={18} color={iconColor} />
                                                            </View>
                                                            <View style={styles.slotContentBox}>
                                                                <Text style={[styles.slotTimeLabel, { color: iconColor }]}>{slot}</Text>
                                                                <Text style={styles.slotDescriptionText}>{day[slot]}</Text>
                                                            </View>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {/* Trip Highlights */}
                    {plan.trip_highlights && plan.trip_highlights.length > 0 && (
                        <>
                            <Text style={styles.sectionLabel}>✨ Trip Highlights</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                                {plan.trip_highlights.map((item: any, idx: number) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => {
                                            if (item.geo_coordinates) {
                                                setSelectedLocation(item);
                                                setIsMapVisible(true);
                                            }
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <BentoCard style={styles.highlightCard}>
                                            <Text style={styles.highlightName}>{item.name}</Text>
                                            <Text style={styles.highlightDesc} numberOfLines={3}>{item.description}</Text>
                                            <View style={styles.matchBadge}>
                                                <MapPin size={12} color={theme.colors.primary} />
                                                <Text style={styles.matchText}>{item.match_reason}</Text>
                                            </View>
                                        </BentoCard>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Local Tips */}
                    {plan.local_tips && plan.local_tips.length > 0 && (
                        <>
                            <Text style={styles.sectionLabel}>💡 Local Tips</Text>
                            <BentoCard style={{ padding: 20, marginBottom: 24 }}>
                                {plan.local_tips.map((tip: string, idx: number) => (
                                    <View key={idx} style={styles.tipRow}>
                                        <CheckCircle2 size={16} color={theme.colors.primary} />
                                        <Text style={styles.tipText}>{tip}</Text>
                                    </View>
                                ))}
                            </BentoCard>
                        </>
                    )}

                    {/* Plan Overview Fallback */}
                    {(!plan.suggested_itinerary || plan.suggested_itinerary.length === 0) && (
                        <>
                            <Text style={styles.sectionLabel}>Plan Overview</Text>
                            <BentoCard style={{ padding: 20, marginBottom: 24 }}>
                                <Text style={{ fontSize: 14, color: theme.colors.text.secondary, lineHeight: 22 }}>
                                    {plan.itinerary || plan.destination_overview || 'No detailed itinerary available for this plan.'}
                                </Text>
                            </BentoCard>
                        </>
                    )}

                    {/* CTA */}
                    <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Save to My Trips ✨</Text>
                    </TouchableOpacity>
                </View>

                {/* Image Modal */}
                <Modal
                    visible={!!selectedImage}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectedImage(null)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedImage(null)}>
                            <X size={30} color="#FFF" />
                        </TouchableOpacity>
                        {selectedImage && (
                            <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
                        )}
                    </View>
                </Modal>

                {/* Map Modal */}
                <Modal
                    visible={isMapVisible}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => {
                        setIsMapVisible(false);
                        setSelectedLocation(null);
                    }}
                >
                    <View style={styles.mapModalContainer}>
                        <View style={styles.mapHeader}>
                            <View>
                                <Text style={styles.mapTitle}>
                                    {selectedLocation ? selectedLocation.name : `${plan.to} Highlights`}
                                </Text>
                                <Text style={styles.mapSubtitle}>
                                    {selectedLocation ? 'Pinpoint Location' : 'Full Trip Overview'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.mapCloseBtn}
                                onPress={() => {
                                    setIsMapVisible(false);
                                    setSelectedLocation(null);
                                }}
                            >
                                <X size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: selectedLocation?.geo_coordinates?.lat || plan.trip_highlights[0]?.geo_coordinates?.lat || 0,
                                longitude: selectedLocation?.geo_coordinates?.lng || plan.trip_highlights[0]?.geo_coordinates?.lng || 0,
                                latitudeDelta: selectedLocation ? 0.01 : 0.1,
                                longitudeDelta: selectedLocation ? 0.01 : 0.1,
                            }}
                        >
                            {plan.trip_highlights.map((h: any, i: number) => (
                                h.geo_coordinates && (
                                    <Marker
                                        key={i}
                                        coordinate={{
                                            latitude: h.geo_coordinates.lat,
                                            longitude: h.geo_coordinates.lng,
                                        }}
                                        title={h.name}
                                        description={h.description}
                                        pinColor={selectedLocation?.name === h.name ? theme.colors.primary : '#F43F5E'}
                                    />
                                )
                            ))}
                        </MapView>
                    </View>
                </Modal>
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
        backgroundColor: '#F0F0F0',
    },
    galleryImage: { width: '100%', height: '100%' },

    sectionLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text.primary,
        marginBottom: 14,
        marginTop: 8,
    },

    // Tags
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    tag: {
        backgroundColor: 'rgba(74, 103, 65, 0.08)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    tagText: { fontSize: 13, color: theme.colors.primary, fontWeight: '700' },

    // Extreme Timeline
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
    mapTrigger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(26, 60, 52, 0.05)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    mapTriggerText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },

    timelineContainer: { marginBottom: 40 },
    timelineItem: { flexDirection: 'row' },
    timelineLeftColumn: { alignItems: 'center', width: 60 },
    dayCircle: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    dayCircleLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '800', marginBottom: -2 },
    dayCircleNumber: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    timelineVerticalLine: {
        flex: 1,
        width: 3,
        backgroundColor: 'rgba(26, 60, 52, 0.12)',
        marginVertical: 4,
        borderRadius: 2,
    },
    timelineRightColumn: { flex: 1, paddingLeft: 12, paddingBottom: 40 },
    dayHeader: { marginBottom: 16 },
    dayTitleText: { fontSize: 19, fontWeight: '900', color: theme.colors.text.primary, marginBottom: 4 },
    dayBriefText: { fontSize: 13, color: theme.colors.text.secondary, lineHeight: 20 },

    slotsWrapper: { gap: 12 },
    premiumSlotCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
    },
    slotIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    slotContentBox: { flex: 1 },
    slotTimeLabel: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
    slotDescriptionText: { fontSize: 14, color: theme.colors.text.primary, fontWeight: '500', lineHeight: 20 },

    // Highlights
    highlightCard: { width: 220, padding: 16, marginRight: 12 },
    highlightName: { fontSize: 15, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 6 },
    highlightDesc: { fontSize: 12, color: theme.colors.text.secondary, lineHeight: 18, marginBottom: 10 },
    matchBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.8 },
    matchText: { fontSize: 10, fontStyle: 'italic', color: theme.colors.primary, flex: 1 },

    // Tips
    tipRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    tipText: { fontSize: 14, color: theme.colors.text.primary, flex: 1, lineHeight: 20 },

    // CTA
    bookBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 10,
    },
    bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    modalImage: {
        width: width,
        height: width * 1.5,
    },
    // Map Modal
    mapModalContainer: { flex: 1, backgroundColor: '#FFF' },
    mapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    mapTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.text.primary },
    mapSubtitle: { fontSize: 12, color: theme.colors.text.secondary, fontWeight: '600' },
    mapCloseBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: { flex: 1 },
});
