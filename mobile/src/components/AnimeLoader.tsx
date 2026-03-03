import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AnimeLoader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.gifContainer}>
                <Image
                    source={require('../../assets/Tracer logo.gif')}
                    style={styles.gif}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Changed back to white as per user request
    },
    gifContainer: {
        width: width * 0.6,
        height: width * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gif: {
        width: '100%',
        height: '100%',
    },
});

export default AnimeLoader;
