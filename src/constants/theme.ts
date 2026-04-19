export const theme = {
  colors: {
    primary: '#6C63FF',       // Roxo vibrante principal
    primaryDark: '#5A52D5',   // Hover/pressed do primary
    primaryLight: '#E8E6FF',  // Background sutil
    secondary: '#00C9A7',     // Verde-menta para sucesso/destaques
    background: '#F8F9FE',    // Fundo claro geral
    surface: '#FFFFFF',       // Cards e surfaces
    text: '#1E1E2D',          // Texto principal (quase preto)
    textSecondary: '#6B7280', // Texto secundário/placeholder
    textLight: '#9CA3AF',     // Texto leve
    error: '#EF4444',         // Vermelho de erro
    errorLight: '#FEE2E2',    // Background de erro
    border: '#E5E7EB',        // Bordas
    white: '#FFFFFF',
    black: '#000000',
  },
  typography: {
    title: { fontSize: 28, fontWeight: '700' as const },
    subtitle: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
    small: { fontSize: 12, fontWeight: '400' as const },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
};
