export const theme = {
    colors: {
        background: '#F2F4E8',
        primary: '#1A3C34',
        secondary: '#4A5D4E',
        text: {
            primary: '#1A3C34',
            secondary: '#4A5D4E',
            light: '#FFFFFF',
        },
        card: {
            background: '#FFFFFF',
            shadow: 'rgba(0, 0, 0, 0.08)',
        },
        accent: '#E6EAD3',
        star: '#FFD700',
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
