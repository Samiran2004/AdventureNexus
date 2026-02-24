import axios from 'axios';
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
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../styles/theme';
import BentoCard from '../components/common/BentoCard';
import { ChevronLeft, Star, Clock, MapPin, Sparkles, X, Info, CheckCircle2, Sunrise, Sun, Sunset, Plane, Train, Bus, Car, ArrowRight } from 'lucide-react-native';
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
    const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
    const [isFetchingRoute, setIsFetchingRoute] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSavePlan = async () => {
        try {
            setIsSaving(true);
            const token = await getToken();
            if (!token) {
                Alert.alert("Sign In", "Please sign in to save plans.");
                return;
            }

            if (!plan._id) {
                Alert.alert("Error", "This plan cannot be saved right now.");
                return;
            }

            const res = await planService.savePlan(token, plan._id);
            if (res.success) {
                Alert.alert("Success ✨", "Plan saved to your profile!");
            } else {
                Alert.alert("Error", res.message || "Failed to save plan.");
            }
        } catch (err: any) {
            console.error("Failed to save plan:", err);
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setIsSaving(false);
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

    // Nearest Neighbor (Greedy) algorithm for finding the shortest path between pins
    const getShortestPath = (highlights: any[]) => {
        if (!highlights || highlights.length <= 1) return highlights.map(h => ({
            latitude: h.geo_coordinates.lat,
            longitude: h.geo_coordinates.lng
        }));

        const points = highlights
            .filter(h => h.geo_coordinates)
            .map(h => ({
                latitude: h.geo_coordinates.lat,
                longitude: h.geo_coordinates.lng
            }));

        const path = [points[0]]; // Start with the first point (usually arrival point)
        const unvisited = points.slice(1);

        while (unvisited.length > 0) {
            let lastPoint = path[path.length - 1];
            let nearestIdx = 0;
            let minDist = Infinity;

            for (let i = 0; i < unvisited.length; i++) {
                // simple Euclidean distance for short trip distances (good enough for visualization)
                const d = Math.sqrt(
                    Math.pow(unvisited[i].latitude - lastPoint.latitude, 2) +
                    Math.pow(unvisited[i].longitude - lastPoint.longitude, 2)
                );
                if (d < minDist) {
                    minDist = d;
                    nearestIdx = i;
                }
            }
            path.push(unvisited[nearestIdx]);
            unvisited.splice(nearestIdx, 1);
        }

        return path;
    };
    const fetchRoadRoute = async (highlights: any[]) => {
        if (!highlights || highlights.length < 2) return;

        setIsFetchingRoute(true);
        try {
            // Filter highlights with coordinates and join them for OSRM
            const coords = highlights
                .filter(h => h.geo_coordinates)
                .map(h => `${h.geo_coordinates.lng},${h.geo_coordinates.lat}`)
                .join(';');

            if (!coords) return;

            const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
            const response = await axios.get(url);

            if (response.data?.routes?.[0]?.geometry?.coordinates) {
                const points = response.data.routes[0].geometry.coordinates.map((coord: any) => ({
                    latitude: coord[1],
                    longitude: coord[0]
                }));
                setRouteCoordinates(points);
            }
        } catch (error) {
            console.error("Error fetching road route:", error);
            // Fallback to straight lines if OSRM fails
            setRouteCoordinates(highlights
                .filter(h => h.geo_coordinates)
                .map(h => ({
                    latitude: h.geo_coordinates.lat,
                    longitude: h.geo_coordinates.lng
                }))
            );
        } finally {
            setIsFetchingRoute(false);
        }
    };

    useEffect(() => {
        if (isMapVisible && !selectedLocation && plan.trip_highlights?.length > 1) {
            fetchRoadRoute(plan.trip_highlights);
        }
    }, [isMapVisible, selectedLocation]);

    const getDateForDay = (index: number) => {
        if (!plan.date) return null;
        const startDate = new Date(plan.date);
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);

        return {
            dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: currentDate.getDate(),
            month: currentDate.toLocaleDateString('en-US', { month: 'short' }),
            fullDate: currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
    };

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

                    {/* How to Reach / Transport Section */}
                    {plan.how_to_reach && (
                        <>
                            <Text style={styles.sectionLabel}>🚉 How to Get There</Text>
                            <BentoCard style={styles.transportCard}>
                                <Text style={styles.transportBestWay}>💡 {plan.how_to_reach.best_way}</Text>

                                <View style={styles.transportModesContainer}>
                                    {plan.how_to_reach.modes?.map((mode: any, idx: number) => {
                                        const ModeIcon = mode.type === 'Flight' ? Plane : mode.type === 'Train' ? Train : mode.type === 'Bus' ? Bus : Car;
                                        return (
                                            <View key={idx} style={styles.transportModeItem}>
                                                <View style={styles.transportIconBox}>
                                                    <ModeIcon size={20} color={theme.colors.primary} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.transportModeTitle}>{mode.type}</Text>
                                                    <Text style={styles.transportModeDesc}>{mode.description}</Text>
                                                    <View style={styles.transportStatsRow}>
                                                        {mode.duration && <Text style={styles.transportStat}>⏱️ {mode.duration}</Text>}
                                                        {mode.estimated_cost && <Text style={styles.transportStat}>💰 {mode.estimated_cost}</Text>}
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>

                                {plan.how_to_reach.arrival_tips && (
                                    <View style={styles.arrivalTipsBox}>
                                        <Text style={styles.arrivalTipsTitle}>Arrival Tips:</Text>
                                        {plan.how_to_reach.arrival_tips.map((tip: string, idx: number) => (
                                            <View key={idx} style={styles.tipRow}>
                                                <Info size={14} color={theme.colors.primary} style={{ marginTop: 2 }} />
                                                <Text style={styles.arrivalTipText}>{tip}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </BentoCard>
                        </>
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

                            {/* Calendar-Style Day Selector */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.calendarStripe}
                                contentContainerStyle={{ paddingRight: 24, paddingLeft: 4 }}
                            >
                                {plan.suggested_itinerary.map((_: any, idx: number) => {
                                    const dateInfo = getDateForDay(idx);
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[
                                                styles.calendarCard,
                                                activeDayIndex === idx && styles.calendarCardActive
                                            ]}
                                            onPress={() => setActiveDayIndex(idx)}
                                        >
                                            <Text style={[
                                                styles.calendarMonth,
                                                activeDayIndex === idx && styles.calendarTextActive
                                            ]}>{dateInfo?.month || '---'}</Text>
                                            <Text style={[
                                                styles.calendarDate,
                                                activeDayIndex === idx && styles.calendarTextActive
                                            ]}>{dateInfo?.dayNumber || idx + 1}</Text>
                                            <Text style={[
                                                styles.calendarDayName,
                                                activeDayIndex === idx && styles.calendarTextActive
                                            ]}>{dateInfo?.dayName || `Day ${idx + 1}`}</Text>

                                            {activeDayIndex === idx && <View style={styles.activeDot} />}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            <View style={styles.timelineContainer}>
                                {(() => {
                                    const day = plan.suggested_itinerary[activeDayIndex];
                                    if (!day) return null;
                                    const dateInfo = getDateForDay(activeDayIndex);

                                    return (
                                        <View style={styles.activeDayContainer}>
                                            <View style={styles.dayHeader}>
                                                <View style={styles.dayTitleRow}>
                                                    <View style={styles.dayBadgeLarge}>
                                                        <Text style={styles.dayBadgeText}>DAY {activeDayIndex + 1}</Text>
                                                    </View>
                                                    <Text style={styles.dayFullDate}>{dateInfo?.fullDate || `Itinerary for Day ${activeDayIndex + 1}`}</Text>
                                                </View>
                                                <Text style={styles.dayTitleTextLarge}>{day.title || `Exploring ${plan.to}`}</Text>
                                                <Text style={styles.dayBriefTextLarge}>{day.description}</Text>
                                            </View>

                                            <View style={styles.scheduleWrapper}>
                                                {/* Vertical Timeline Line */}
                                                <View style={styles.verticalTimelineLine} />

                                                {['morning', 'afternoon', 'evening'].map((slot, index) => {
                                                    if (!day[slot]) return null;
                                                    const Icon = slot === 'morning' ? Sunrise : slot === 'afternoon' ? Sun : Sunset;
                                                    const bgColor = slot === 'morning' ? '#FFF7ED' : slot === 'afternoon' ? '#FEFCE8' : '#FAF5FF';
                                                    const iconColor = slot === 'morning' ? '#EA580C' : slot === 'afternoon' ? '#CA8A04' : '#9333EA';

                                                    return (
                                                        <View key={slot} style={styles.slotContainer}>
                                                            {/* Time Indicator Point */}
                                                            <View style={[styles.timePoint, { backgroundColor: iconColor }]} />

                                                            <BentoCard style={styles.modernSlotCard}>
                                                                <View style={[styles.slotIconBoxLarge, { backgroundColor: bgColor }]}>
                                                                    <Icon size={24} color={iconColor} />
                                                                </View>
                                                                <View style={styles.slotContentBox}>
                                                                    <View style={styles.slotHeaderRow}>
                                                                        <Text style={[styles.slotTimeLabel, { color: iconColor }]}>{slot}</Text>
                                                                        <ArrowRight size={14} color="#CBD5E1" />
                                                                    </View>
                                                                    <Text style={styles.slotDescriptionText}>{day[slot]}</Text>

                                                                    {day.activities?.filter((a: any) => a.time?.toLowerCase() === slot).map((act: any, aIdx: number) => {
                                                                        const matchingHighlight = plan.trip_highlights?.find((h: any) =>
                                                                            act.name.toLowerCase().includes(h.name.toLowerCase()) ||
                                                                            h.name.toLowerCase().includes(act.name.toLowerCase())
                                                                        );

                                                                        return (
                                                                            <TouchableOpacity
                                                                                key={aIdx}
                                                                                style={styles.subActivityBox}
                                                                                onPress={() => {
                                                                                    if (matchingHighlight?.geo_coordinates) {
                                                                                        setSelectedLocation(matchingHighlight);
                                                                                        setIsMapVisible(true);
                                                                                    }
                                                                                }}
                                                                                disabled={!matchingHighlight?.geo_coordinates}
                                                                                activeOpacity={0.7}
                                                                            >
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                                                    <Text style={[styles.subActivityName, matchingHighlight && { color: theme.colors.primary }]}>
                                                                                        • {act.name}
                                                                                    </Text>
                                                                                    {matchingHighlight && (
                                                                                        <MapPin size={10} color={theme.colors.primary} style={{ marginLeft: 4, opacity: 0.7 }} />
                                                                                    )}
                                                                                </View>
                                                                                {act.cost && <Text style={styles.subActivityCost}>{act.cost}</Text>}
                                                                            </TouchableOpacity>
                                                                        );
                                                                    })}
                                                                </View>
                                                            </BentoCard>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    );
                                })()}
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
                    <TouchableOpacity
                        style={[styles.bookBtn, isSaving && { opacity: 0.7 }]}
                        onPress={handleSavePlan}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.bookBtnText}>Save to My Trips ✨</Text>
                        )}
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
                                latitudeDelta: selectedLocation ? 0.01 : 0.2,
                                longitudeDelta: selectedLocation ? 0.01 : 0.2,
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

                            {/* Navigational Polyline (OSRM Road-Following Style) */}
                            {!selectedLocation && routeCoordinates.length > 0 && (
                                <Polyline
                                    coordinates={routeCoordinates}
                                    strokeColor="#4285F4" // Google Maps Blue
                                    strokeWidth={4}
                                />
                            )}
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

    // Extreme Timeline Styles (Restored and Integrated)
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
    mapTrigger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(26, 60, 52, 0.05)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    mapTriggerText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },

    // Transport Section
    transportCard: { padding: 20, marginBottom: 24, backgroundColor: '#FFF' },
    transportBestWay: { fontSize: 14, fontWeight: '700', color: theme.colors.primary, marginBottom: 16, lineHeight: 20 },
    transportModesContainer: { gap: 16, marginBottom: 16 },
    transportModeItem: { flexDirection: 'row', gap: 14 },
    transportIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(26, 60, 52, 0.05)', justifyContent: 'center', alignItems: 'center' },
    transportModeTitle: { fontSize: 13, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 2 },
    transportModeDesc: { fontSize: 12, color: theme.colors.text.secondary, lineHeight: 18 },
    transportStatsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    transportStat: { fontSize: 11, fontWeight: '700', color: theme.colors.primary },
    arrivalTipsBox: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 16 },
    arrivalTipsTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 10 },
    arrivalTipText: { fontSize: 13, color: theme.colors.text.secondary, lineHeight: 18, flex: 1 },

    // Calendar Stripe Redesign
    calendarStripe: { marginBottom: 24 },
    calendarCard: {
        width: 64,
        height: 84,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    calendarCardActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        shadowOpacity: 0.2,
        shadowColor: theme.colors.primary,
        elevation: 8,
    },
    calendarMonth: {
        fontSize: 10,
        fontWeight: '800',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    calendarDate: {
        fontSize: 20,
        fontWeight: '900',
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    calendarDayName: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.text.secondary,
    },
    calendarTextActive: {
        color: '#FFF',
    },
    activeDot: {
        position: 'absolute',
        bottom: 8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFF',
    },

    // Timeline Container Redesign
    timelineContainer: { marginBottom: 30 },
    activeDayContainer: { opacity: 1 },
    dayFullDate: { fontSize: 13, fontWeight: '700', color: theme.colors.primary, flex: 1 },
    dayTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    dayBadgeLarge: { backgroundColor: 'rgba(26, 60, 52, 0.1)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    dayBadgeText: { fontSize: 12, fontWeight: '900', color: theme.colors.primary, textTransform: 'uppercase' },
    dayTitleTextLarge: { fontSize: 24, fontWeight: '900', color: theme.colors.text.primary, flex: 1 },
    dayBriefTextLarge: { fontSize: 14, color: theme.colors.text.secondary, lineHeight: 22, marginBottom: 20 },

    // Calendar Schedule Styles
    scheduleWrapper: { paddingLeft: 12, position: 'relative' },
    verticalTimelineLine: {
        position: 'absolute',
        top: 24,
        bottom: 24,
        left: 0,
        width: 2,
        backgroundColor: 'rgba(26, 60, 52, 0.1)',
        borderRadius: 1,
    },
    slotContainer: { marginBottom: 14, flexDirection: 'row', alignItems: 'center' },
    timePoint: {
        width: 10,
        height: 10,
        borderRadius: 5,
        position: 'absolute',
        left: -4,
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    modernSlotCard: { flex: 1, padding: 18, marginLeft: 20, flexDirection: 'row', gap: 16, backgroundColor: '#FFF' },
    slotIconBoxLarge: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    slotHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    slotTimeLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
    slotDescriptionText: { fontSize: 15, color: theme.colors.text.primary, fontWeight: '600', lineHeight: 22, marginBottom: 8 },
    subActivityBox: { marginTop: 6, borderLeftWidth: 2, borderLeftColor: 'rgba(0,0,0,0.05)', paddingLeft: 10 },
    subActivityName: { fontSize: 13, color: theme.colors.text.secondary, fontWeight: '600' },
    subActivityCost: { fontSize: 11, color: theme.colors.primary, fontWeight: '700', marginTop: 2 },
    slotContentBox: { flex: 1 },

    // Highlights
    highlightCard: { width: 220, padding: 16, marginRight: 12 },
    highlightName: { fontSize: 15, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 6 },
    highlightDesc: { fontSize: 12, color: theme.colors.text.secondary, lineHeight: 18, marginBottom: 10 },
    matchBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.8 },
    matchText: { fontSize: 10, fontStyle: 'italic', color: theme.colors.primary, flex: 1 },

    // Old keys still used in code
    dayHeader: { marginBottom: 16 },
    slotsWrapper: { gap: 12 },
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
