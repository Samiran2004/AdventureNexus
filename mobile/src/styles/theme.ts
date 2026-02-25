export const theme = {
    colors: {
        background: '#F5F7F0',
        primary: '#1A3C34',
        secondary: '#4A5D4E',
        text: {
            primary: '#1A2421',
            secondary: '#6B7280',
            light: '#FFFFFF',
            muted: '#9CA3AF',
        },
        card: {
            background: '#FFFFFF',
            border: '#F0F2EB',
            shadow: 'rgba(0, 0, 0, 0.08)',
        },
        accent: '#E6EAD3',
        star: '#FFD700',
        error: '#FF4E6A',
        success: '#22C55E',
        divider: '#E5E7EB',
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
