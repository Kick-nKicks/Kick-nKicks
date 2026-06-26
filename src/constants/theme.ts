export const colors = {
  brand: '#E63946',
  brandDark: '#C1121F',
  brandLight: '#FF6B6B',
  background: '#FFFDF5',
  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 253, 0.94)',
  text: '#1D3557',
  textMuted: '#6C757D',
  border: '#EDE8DC',
  success: '#2A9D8F',
  warning: '#F4A261',
} as const;

/** Pastel accents pulled from the sneaker skin artwork */
export const pastels = {
  rose: '#E8C4C4',
  blush: '#D4939A',
  sand: '#E8DFC8',
  lavender: '#C4B8D9',
  seafoam: '#A8D4CF',
  sage: '#B5C9B0',
} as const;

export const surfaceShadow = {
  shadowColor: '#1D3557',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 4,
} as const;

export const surfaceStyle = {
  backgroundColor: colors.surfaceGlass,
  borderColor: 'rgba(255, 255, 255, 0.85)',
  borderWidth: 1,
  ...surfaceShadow,
} as const;

export const tabBarShadow = {
  shadowColor: '#1D3557',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 8,
} as const;

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

const PASTEL_LIST = Object.values(pastels);

export function pastelForKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PASTEL_LIST[Math.abs(hash) % PASTEL_LIST.length];
}
