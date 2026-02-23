import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../styles/theme';
import BentoCard from '../components/common/BentoCard';
import { ChevronLeft, Star, Clock, MapPin, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ navigation, route }: any) => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Immersive Photography with Curved Mask */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000' }}
                    style={styles.mainImage}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'transparent']}
                    style={styles.topGradient}
                />

                {/* Navigation Overlays */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <View style={styles.altTag}>
                        <Text style={styles.altText}>2,665m</Text>
                    </View>
                    <Text style={styles.title}>Tyrolean{"\n"}Alps</Text>
                </View>

                {/* Curved Bottom Mask Effect */}
                <View style={styles.curvedMask} />
            </View>

            <View style={styles.content}>
                <View style={styles.centerAlign}>
                    <Image
                        source={{ uri: 'https://flagcdn.com/w160/at.png' }}
                        style={styles.flag}
                    />
                    <Text style={styles.country}>AUSTRIA</Text>
                </View>

                <Text style={styles.mainHeadline}>Discovering the Magic of Austrian Mountains</Text>

                <View style={styles.quickStats}>
                    <View style={styles.statChip}>
                        <Clock size={16} color={theme.colors.primary} />
                        <Text style={styles.statChipText}>7 days</Text>
                    </View>
                    <View style={styles.statChip}>
                        <MapPin size={16} color={theme.colors.primary} />
                        <Text style={styles.statChipText}>10 km</Text>
                    </View>
                    <View style={styles.statChip}>
                        <Star size={16} color={theme.colors.primary} />
                        <Text style={styles.statChipText}>8/10</Text>
                    </View>
                </View>

                {/* Bento Info Grid */}
                <View style={styles.bentoGrid}>
                    <BentoCard style={styles.hotelCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500' }}
                            style={styles.hotelImage}
                        />
                        <View style={styles.hotelContent}>
                            <Text style={styles.hotelName}>Lenas Donau Hotel</Text>
                            <View style={styles.hotelMeta}>
                                <MapPin size={12} color={theme.colors.text.secondary} />
                                <Text style={styles.hotelLocation}>Vienna, Austria</Text>
                            </View>
                            <View style={styles.hotelRating}>
                                <Star size={12} color={theme.colors.star} fill={theme.colors.star} />
                                <Text style={styles.ratingText}>7.4 (Reviews)</Text>
                            </View>
                            <Text style={styles.priceText}>$89.00 / night</Text>
                        </View>
                    </BentoCard>

                    <View style={styles.gridColumn}>
                        <BentoCard style={styles.infoCard}>
                            <Info size={24} color={theme.colors.primary} />
                            <Text style={styles.infoTitle}>Guide</Text>
                            <Text style={styles.infoSub}>Available</Text>
                        </BentoCard>
                        <BentoCard style={styles.infoCard}>
                            <Star size={24} color={theme.colors.primary} />
                            <Text style={styles.infoTitle}>Score</Text>
                            <Text style={styles.infoSub}>High</Text>
                        </BentoCard>
                    </View>
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    imageContainer: {
        height: 500,
        width: '100%',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        position: 'absolute',
        bottom: 80,
        left: 24,
    },
    altTag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    altText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.bold,
    },
    title: {
        fontSize: 48,
        fontFamily: theme.typography.fontFamily.bold,
        color: '#FFF',
        lineHeight: 48,
    },
    curvedMask: {
        position: 'absolute',
        bottom: -1,
        width: '100%',
        height: 60,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    centerAlign: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    flag: {
        width: 20,
        height: 14,
        borderRadius: 2,
        marginRight: 8,
    },
    country: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: 12,
        color: theme.colors.primary,
        letterSpacing: 2,
    },
    mainHeadline: {
        fontSize: 28,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 34,
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
    },
    statChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    statChipText: {
        marginLeft: 6,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.text.primary,
    },
    bentoGrid: {
        flexDirection: 'row',
    },
    hotelCard: {
        flex: 3,
        padding: 0,
        marginRight: 12,
    },
    hotelImage: {
        width: '100%',
        height: 120,
    },
    hotelContent: {
        padding: 16,
    },
    hotelName: {
        fontSize: 16,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    hotelMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    hotelLocation: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginLeft: 4,
    },
    hotelRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingText: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginLeft: 4,
    },
    priceText: {
        fontSize: 16,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text.primary,
    },
    gridColumn: {
        flex: 1.5,
    },
    infoCard: {
        flex: 1,
        height: 120,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 14,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text.primary,
        marginTop: 8,
    },
    infoSub: {
        fontSize: 10,
        color: theme.colors.text.secondary,
    },
});

export default DetailsScreen;
