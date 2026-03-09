import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../styles/theme';

const BentoCard = ({ children, style, onPress, flex, height }: any) => {
    const CardContainer = onPress ? TouchableOpacity : View;

    return (
        <CardContainer
            style={[
                styles.card,
                { flex, height: height || 'auto' },
                style
            ]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {children}
        </CardContainer>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: theme.spacing.md,
        margin: 0,
        overflow: 'hidden',
    },
});

export default BentoCard;
