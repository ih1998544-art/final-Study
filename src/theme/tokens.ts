/**
 * Study Zone Design Tokens & System Guidelines
 * One cohesive visual language for the $70k+ EdTech platform.
 */

export const DESIGN_TOKENS = {
  colors: {
    // 60% Dominant Canvas
    canvas: {
      default: '#F8FAFC', // Slate 50
      subtle: '#F1F5F9',  // Slate 100
      dark: '#0F172A',    // Slate 900
    },
    // 30% Structural Surfaces
    surface: {
      card: '#FFFFFF',
      borderSubtle: '#E2E8F0', // Slate 200
      borderStrong: '#CBD5E1', // Slate 300
      divider: 'rgba(15, 23, 42, 0.06)',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#64748B',
    },
    // 10% High-Intent Brand Accent
    brand: {
      primary: '#059669',       // Emerald 600
      hover: '#047857',         // Emerald 700
      active: '#065F46',        // Emerald 800
      subtle: '#ECFDF5',        // Emerald 50
      border: '#A7F3D0',        // Emerald 200
      contrastText: '#FFFFFF',
    },
    // Semantic States (Dual-coded with text & icons)
    semantic: {
      success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
      warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
      error: { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' },
      info: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    }
  },
  typography: {
    display: "'Cabinet Grotesk', 'Plus Jakarta Sans', sans-serif",
    body: "'Plus Jakarta Sans', -apple-system, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
  },
  shadows: {
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
    elevated: '0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
    dropdown: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
  }
} as const;
