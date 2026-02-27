import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G, Ellipse, Circle, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const AnimeLoader = () => {
    const rotation = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(0.3)).current;
    const needleMove = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 1. Globe Rotation
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 15000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // 2. Pulse Nodes
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0.3,
                    duration: 1200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                })
            ])
        ).start();

        // 3. Compass Needle "Searching"
        Animated.loop(
            Animated.sequence([
                Animated.timing(needleMove, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(needleMove, {
                    toValue: -0.5,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(needleMove, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.elastic(1),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const rotateData = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const needleRotate = needleMove.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-45deg', '135deg'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.glassCard}>
                <View style={styles.svgContainer}>
                    <Svg height="150" width="150" viewBox="0 0 100 100">
                        <Defs>
                            <LinearGradient id="needle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0" stopColor="#FF7B31" />
                                <Stop offset="1" stopColor="#FFC800" />
                            </LinearGradient>
                        </Defs>

                        {/* Background Globe Grid */}
                        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: rotateData }] }]}>
                            <Svg height="150" width="150" viewBox="0 0 100 100">
                                <G opacity="0.1">
                                    <Ellipse cx="50" cy="50" rx="45" ry="15" stroke="#FF7B31" strokeWidth="0.5" fill="none" />
                                    <Ellipse cx="50" cy="50" rx="15" ry="45" stroke="#FF7B31" strokeWidth="0.5" fill="none" />
                                    <Circle cx="50" cy="50" r="45" stroke="#FF7B31" strokeWidth="0.5" fill="none" />
                                </G>

                                {/* Nexus Nodes */}
                                <G>
                                    <Circle cx="20" cy="50" r="1.5" fill="#FF7B31" opacity="0.4" />
                                    <Circle cx="80" cy="50" r="1.5" fill="#FF7B31" opacity="0.4" />
                                    <Circle cx="50" cy="20" r="1.5" fill="#FF7B31" opacity="0.4" />
                                </G>
                            </Svg>
                        </Animated.View>

                        {/* Compass Frame */}
                        <G>
                            <Circle cx="50" cy="50" r="40" stroke="#667085" strokeWidth="0.5" fill="none" strokeDasharray="2,4" opacity="0.3" />
                            <SvgText x="50" y="8" fontSize="6" fill="#FF7B31" textAnchor="middle" fontWeight="bold">N</SvgText>
                        </G>

                        {/* Animating Compass Needle */}
                        <Animated.View style={{ transform: [{ rotate: needleRotate }], width: 150, height: 150, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                            <Svg height="150" width="150" viewBox="0 0 100 100">
                                <G>
                                    <Path d="M50 15 L 45 50 L 50 55 L 55 50 Z" fill="url(#needle-grad)" />
                                    <Path d="M50 85 L 55 50 L 50 45 L 45 50 Z" fill="#2D3142" />
                                    <Circle cx="50" cy="50" r="1" fill="white" />
                                </G>
                            </Svg>
                        </Animated.View>
                    </Svg>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.brandText}>AdventureNexus</Text>
                    <View style={styles.progressBar}>
                        <Animated.View style={[styles.progressFill, { opacity: pulse }]} />
                    </View>
                    <Text style={styles.loadingMsg}>Preparing your journey...</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B0E14',
    },
    glassCard: {
        width: width * 0.8,
        paddingVertical: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
    },
    svgContainer: {
        height: 150,
        width: 150,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    brandText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    progressBar: {
        height: 2,
        width: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 1,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        width: '100%',
        backgroundColor: '#FF7B31',
    },
    loadingMsg: {
        fontSize: 10,
        color: '#98A2B3',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});

export default AnimeLoader;
