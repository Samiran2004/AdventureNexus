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
        padding: theme.spacing.md,
        margin: theme.spacing.xs,
        shadowColor: theme.colors.card.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
        overflow: 'hidden',
    },
});

export default BentoCard;
