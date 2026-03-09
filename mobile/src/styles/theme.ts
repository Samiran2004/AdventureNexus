export const theme = {
    colors: {
        background: '#000000',
        primary: '#FFFFFF', // High contrast white for primary actions
        secondary: '#1A1A1A', // Charcoal gray for borders and secondary elements
        text: {
            primary: '#F5F5F7',
            secondary: '#A1A1AA',
            light: '#FFFFFF',
            muted: '#71717A',
        },
        card: {
            background: '#0A0A0A', // Deep black for cards to contrast against #000000
            border: 'rgba(255, 255, 255, 0.05)', // Inner glow / subtle subtle border
            shadow: 'rgba(0, 0, 0, 0.5)',
        },
        accent: '#2563EB', // Adding a neon blue accent commonly found in Antimatter
        star: '#FFD700',
        error: '#EF4444',
        success: '#10B981',
        divider: 'rgba(255, 255, 255, 0.1)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },
    borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
        xl: 40,
        round: 999,
    },
    typography: {
        fontFamily: {
            regular: undefined,      // system default
            medium: undefined,
            semiBold: undefined,
            bold: undefined,
        },
        fontWeight: {
            regular: '400' as const,
            medium: '500' as const,
            semiBold: '600' as const,
            bold: '700' as const,
        },
        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 24,
            xxl: 32,
        },
    },
};
