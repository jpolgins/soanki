// Lo-fi tech color palette and theme
export const COLORS = {
  primary: '#6E56CF',        // Purple as primary color
  secondary: '#FF8E3C',      // Orange as accent
  background: '#F2F0FF',     // Light purple background
  card: '#FFFFFF',           // White card background
  cardAlt: '#F7F5FF',        // Slightly purple card alt
  text: '#333344',           // Dark blue-gray for text
  textLight: '#666688',      // Lighter text
  success: '#4CAF50',        // Green for success actions
  error: '#FF6B6B',          // Red for errors
  warning: '#FFCA28',        // Yellow for warnings
  border: '#D0C9F0',         // Light purple borders
  shadow: 'rgba(110, 86, 207, 0.1)' // Purple shadow
};

// Spacing constants
export const SPACING = {
  xs: 4,
  sm: 8, 
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

// Font sizes
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28
};

// Emojis by category
export const EMOJIS = {
  deck: '📚',
  card: '📝',
  study: '🧠',
  create: '✨',
  delete: '🗑️',
  edit: '✏️',
  success: '🎉',
  error: '❌',
  warning: '⚠️',
  info: '💡',
  easy: '😊',
  medium: '😐',
  hard: '😓',
  question: '❓',
  answer: '✅',
  stats: '📊',
  settings: '⚙️',
  back: '⬅️',
  next: '➡️',
  menu: '☰'
};

// Shadow styles
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 6.68,
    elevation: 6
  }
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999
};
