// Sycamore Church App Color Palette
import { theme } from 'antd';

// Destructure algorithms from antd theme
const { defaultAlgorithm, darkAlgorithm } = theme;

export const lightTheme = {
  // Primary colors
  darkBlue: '#001219',      // Deep navy - primary text, headers
  teal: '#005F73',          // Dark teal - secondary elements
  lightTeal: '#0A9396',     // Medium teal - buttons, links
  mint: '#94D2BD',          // Light mint - backgrounds, highlights
  
  // Accent colors
  darkRed: '#9B2226',       // Deep red - alerts, warnings
  red: '#AE2012',           // Medium red - error states
  brightRed: '#BB3E03',     // Bright red - call to action
  orange: '#CA6702',        // Orange - notifications, badges
  yellow: '#EE9B00',        // Golden yellow - success, achievements
  
  // Semantic colors
  primary: '#0A9396',       // Light teal for primary actions
  secondary: '#005F73',     // Dark teal for secondary actions
  success: '#EE9B00',       // Golden yellow for success states
  warning: '#CA6702',       // Orange for warnings
  error: '#AE2012',         // Red for errors
  info: '#94D2BD',          // Mint for info states
  
  // Background colors
  background: '#F8FAFB',    // Light gray background instead of white
  cardBackground: '#FFFFFF', // White for cards to provide contrast
  surfaceBackground: '#F0F4F6', // Slightly darker gray for surfaces
  
  // Text colors
  textPrimary: '#001219',   // Dark blue for primary text
  textSecondary: '#005F73', // Dark teal for secondary text
  textLight: '#0A9396',     // Light teal for muted text
  textWhite: '#FFFFFF',     // White text on dark backgrounds
};

export const darkTheme = {
  // Primary colors (adjusted for dark mode)
  darkBlue: '#E8F4F8',      // Light blue-gray for text
  teal: '#94D2BD',          // Light mint for secondary elements
  lightTeal: '#0A9396',     // Keep the same teal for consistency
  mint: '#005F73',          // Darker mint for backgrounds
  
  // Accent colors (slightly adjusted)
  darkRed: '#FF6B6B',       // Lighter red for better contrast
  red: '#FF5252',           // Adjusted red for error states
  brightRed: '#FF4444',     // Bright red for call to action
  orange: '#FFA726',        // Lighter orange for notifications
  yellow: '#FFD54F',        // Lighter yellow for success
  
  // Semantic colors
  primary: '#0A9396',       // Keep primary teal
  secondary: '#94D2BD',     // Light mint for secondary
  success: '#FFD54F',       // Light yellow for success
  warning: '#FFA726',       // Light orange for warnings
  error: '#FF5252',         // Light red for errors
  info: '#81C784',          // Light green for info
  
  // Background colors
  background: '#0F1419',    // Very dark background
  cardBackground: '#1A1F24', // Dark gray for cards
  surfaceBackground: '#242A30', // Slightly lighter gray for surfaces
  
  // Text colors
  textPrimary: '#E8F4F8',   // Light text for primary
  textSecondary: '#B0BEC5', // Medium gray for secondary text
  textLight: '#78909C',     // Darker gray for muted text
  textWhite: '#FFFFFF',     // White text
};

// Function to get colors based on theme
export const getColors = (isDarkMode) => isDarkMode ? darkTheme : lightTheme;

// Ant Design theme generator
export const getAntdTheme = (isDarkMode) => {
  try {
    const themeColors = getColors(isDarkMode);
    
    return {
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      token: {
        colorPrimary: themeColors.primary,
        colorSuccess: themeColors.success,
        colorWarning: themeColors.warning,
        colorError: themeColors.error,
        colorInfo: themeColors.info,
        colorBgContainer: themeColors.cardBackground,
        colorBgBase: themeColors.background,
        colorText: themeColors.textPrimary,
        colorTextSecondary: themeColors.textSecondary,
        borderRadius: 8,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      components: {
        Button: {
          borderRadius: 8,
          controlHeight: 40,
        },
        Card: {
          borderRadius: 12,
          colorBgContainer: themeColors.cardBackground,
        },
        Input: {
          borderRadius: 8,
          controlHeight: 40,
        },
        Layout: {
          colorBgBody: themeColors.background,
          colorBgContainer: themeColors.cardBackground,
        },
        Menu: {
          colorBgContainer: themeColors.cardBackground,
        },
      },
    };
  } catch (error) {
    console.error('Error creating Ant Design theme:', error);
    // Fallback to basic theme without algorithm
    return {
      token: {
        colorPrimary: '#0A9396',
        borderRadius: 8,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    };
  }
};

// Legacy export for backward compatibility
export const colors = lightTheme;

export default getColors;
