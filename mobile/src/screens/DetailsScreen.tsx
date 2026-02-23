import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { theme } from '../styles/theme';
import BentoCard from '../components/common/BentoCard';
import { ChevronLeft, Star, Clock, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DetailsScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ── Immersive Photo with Curved Mask ── */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000' }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                    {/* Dark overlay */}
                    <View style={styles.imageOverlay} />

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>

                    {/* Weather badge */}
                    <View style={styles.weatherBadge}>
                        <Text style={styles.weatherBadgeText}>☀️  15 °C</Text>
                    </View>

                    {/* Alt tag + Title */}
                    <View style={styles.imageInfo}>
                        <View style={styles.altBadge}>
                            <Text style={styles.altBadgeText}>2,665m</Text>
                        </View>
                        <Text style={styles.imageTitle}>Tyrolean{'\n'}Alps</Text>
                    </View>

                    {/* Curved mask */}
                    <View style={styles.curvedMask} />
                </View>

                {/* ── Detail Content ── */}
                <View style={styles.content}>
                    {/* Country */}
                    <View style={styles.countryRow}>
                        <Text style={styles.countryFlag}>🇦🇹</Text>
                        <Text style={styles.country}>AUSTRIA</Text>
                    </View>

                    <Text style={styles.mainTitle}>Discovering the Magic of Austrian Mountains</Text>

                    {/* Quick stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statChip}>
                            <Clock size={14} color={theme.colors.primary} />
                            <Text style={styles.statChipText}>7 days</Text>
                        </View>
                        <View style={styles.statChip}>
                            <MapPin size={14} color={theme.colors.primary} />
                            <Text style={styles.statChipText}>10 km</Text>
                        </View>
                        <View style={styles.statChip}>
                            <Star size={14} color={theme.colors.primary} />
                            <Text style={styles.statChipText}>8/10</Text>
                        </View>
                    </View>

                    {/* Popular dates */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                        {['27/03 – 7/04', '7/04 – 17/04', '17/04 – 27/04'].map((d) => (
                            <View key={d} style={styles.datePill}>
                                <Text style={styles.datePillText}>📅 {d}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Hotel Bento Card */}
                    <Text style={styles.sectionLabel}>Where to Stay</Text>
                    <BentoCard style={styles.hotelCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' }}
                            style={styles.hotelImage}
                            resizeMode="cover"
                        />
                        <View style={styles.hotelBody}>
                            <Text style={styles.hotelName}>Lenas Donau Hotel</Text>
                            <View style={styles.hotelMeta}>
                                <MapPin size={12} color={theme.colors.text.secondary} />
                                <Text style={styles.hotelLocation}>22nd district, Vienna</Text>
                            </View>
                            <View style={styles.ratingRow}>
                                <Star size={12} color={theme.colors.star} fill={theme.colors.star} />
                                <Text style={styles.ratingText}>7.4 (Reviews)</Text>
                            </View>
                            <Text style={styles.price}>$89.00 / night</Text>
                        </View>
                    </BentoCard>

                    {/* CTA */}
                    <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Book This Trip ✨</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },

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
    imageInfo: { position: 'absolute', bottom: 80, left: 24 },
    altBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    altBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    imageTitle: {
        fontSize: 46,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 48,
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
    countryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    countryFlag: { fontSize: 16, marginRight: 8 },
    country: { fontSize: 12, fontWeight: '800', color: theme.colors.primary, letterSpacing: 2 },
    mainTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: theme.colors.text.primary,
        marginBottom: 20,
        lineHeight: 32,
    },

    // Stats
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
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
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    statChipText: { fontSize: 12, fontWeight: '700', color: theme.colors.text.primary },

    // Dates
    dateScroll: { marginBottom: 24 },
    datePill: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    datePillText: { fontSize: 12, fontWeight: '600', color: theme.colors.text.primary },

    // Hotel
    sectionLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text.primary,
        marginBottom: 14,
    },
    hotelCard: { padding: 0, marginBottom: 24, borderRadius: 28 },
    hotelImage: { width: '100%', height: 160, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
    hotelBody: { padding: 16 },
    hotelName: { fontSize: 16, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 6 },
    hotelMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    hotelLocation: { fontSize: 12, color: theme.colors.text.secondary },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
    ratingText: { fontSize: 12, color: theme.colors.text.secondary },
    price: { fontSize: 18, fontWeight: '800', color: theme.colors.text.primary },

    // CTA
    bookBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 40,
        alignItems: 'center',
    },
    bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
