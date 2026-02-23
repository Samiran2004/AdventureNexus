import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../styles/theme';
import BentoCard from '../components/common/BentoCard';
import { Search, Star, Cloud, MapPin, Hash } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hi, Morgan 👋</Text>
                    <View style={styles.locationContainer}>
                        <Image
                            source={{ uri: 'https://flagcdn.com/w160/no.png' }}
                            style={styles.flag}
                        />
                        <Text style={styles.countryLabel}>NORWAY</Text>
                    </View>
                </View>

                <BentoCard style={styles.weatherCard}>
                    <View style={styles.weatherRow}>
                        <Cloud size={20} color={theme.colors.primary} />
                        <View style={styles.weatherInfo}>
                            <Text style={styles.weatherLabel}>Weather</Text>
                            <Text style={styles.weatherTemp}>15 °C</Text>
                        </View>
                    </View>
                </BentoCard>
            </View>

            <Text style={styles.heroTitle}>Nature{"\n"}Power</Text>

            {/* Categories Toolbar */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {['Hiking', 'Kayaking', 'Biking', 'Camping'].map((cat, i) => (
                    <TouchableOpacity key={cat} style={[styles.categoryPill, i === 0 && styles.activePill]}>
                        <Hash size={14} color={i === 0 ? theme.colors.text.light : theme.colors.primary} />
                        <Text style={[styles.categoryText, i === 0 && styles.activeCategoryText]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Main Feature Card */}
            <BentoCard style={styles.heroCard}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000' }}
                    style={styles.heroImage}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.imageOverlay}
                />
                <View style={styles.heroContent}>
                    <Text style={styles.heroTag}>The Sounds of Nature</Text>
                    <Text style={styles.heroSub}>A real adventure where nature reveals its grandeur and beauty in its purest form.</Text>
                    <View style={styles.heroStats}>
                        <Text style={styles.statItem}>📅 7 days</Text>
                        <Text style={styles.statItem}>📍 10 km</Text>
                        <Text style={styles.statItem}>⭐ 8/10</Text>
                    </View>
                    <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start Trip</Text>
                    </TouchableOpacity>
                </View>
            </BentoCard>

            {/* Discovery Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular</Text>
            </View>

            <View style={styles.bentoGrid}>
                <BentoCard style={styles.gridCardSmall}>
                    <View style={styles.bentoIconContainer}>
                        <MapPin size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.bentoLabel}>Nearby</Text>
                </BentoCard>

                <BentoCard style={styles.gridCardLarge}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500' }}
                        style={styles.bentoImage}
                    />
                    <View style={styles.bentoInfo}>
                        <Text style={styles.bentoCountry}>BELGIUM</Text>
                        <Text style={styles.bentoTitle}>Forest Magic</Text>
                    </View>
                </BentoCard>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    greeting: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.text.primary,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    flag: {
        width: 20,
        height: 14,
        borderRadius: 2,
        marginRight: 6,
    },
    countryLabel: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: 10,
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    weatherCard: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherInfo: {
        marginLeft: 8,
    },
    weatherLabel: {
        fontSize: 10,
        color: theme.colors.text.secondary,
    },
    weatherTemp: {
        fontSize: 14,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text.primary,
    },
    heroTitle: {
        fontSize: 56,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text.primary,
        lineHeight: 56,
        paddingHorizontal: theme.spacing.lg,
        marginTop: 10,
        marginBottom: 20,
    },
    categoryScroll: {
        paddingLeft: theme.spacing.lg,
        marginBottom: 24,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: theme.borderRadius.xl,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    activePill: {
        backgroundColor: theme.colors.primary,
    },
    categoryText: {
        marginLeft: 6,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.text.primary,
    },
    activeCategoryText: {
        color: theme.colors.text.light,
    },
    heroCard: {
        height: 380,
        marginHorizontal: theme.spacing.lg,
        padding: 0,
        borderRadius: theme.borderRadius.xl,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 24,
    },
    heroTag: {
        fontSize: 24,
        fontFamily: theme.typography.fontFamily.bold,
        color: '#FFF',
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 16,
        lineHeight: 20,
    },
    heroStats: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statItem: {
        color: '#FFF',
        fontSize: 12,
        marginRight: 15,
    },
    startButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 12,
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    startButtonText: {
        color: '#FFF',
        fontFamily: theme.typography.fontFamily.bold,
    },
    sectionHeader: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: 32,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 28,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text.primary,
    },
    bentoGrid: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        marginBottom: 100,
    },
    gridCardSmall: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
    },
    gridCardLarge: {
        flex: 2,
        aspectRatio: 2,
        padding: 0,
    },
    bentoIconContainer: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
    },
    bentoLabel: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: 14,
        color: theme.colors.primary,
    },
    bentoImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    bentoInfo: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    bentoCountry: {
        color: '#FFF',
        fontSize: 8,
        fontFamily: theme.typography.fontFamily.bold,
        letterSpacing: 1,
    },
    bentoTitle: {
        color: '#FFF',
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: 16,
    },
});

export default HomeScreen;
