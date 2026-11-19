import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';

/**
 * Modern Design System - Palette (Neutral / Slate & Indigo Tech)
 * Replaces legacy institutional colors with a clean, high-contrast engineering theme.
 */
export const PRIMARY_COLOR = '#0F172A';        // Slate 900
export const SECONDARY_COLOR = '#1E293B';      // Slate 800
export const THIRD_COLOR = '#F1F5F9';          // Slate 100
export const FOURTH_COLOR = '#E2E8F0';         // Slate 200

export const ACCENT_COLOR = '#3B82F6';         // Blue 500
export const PRIMARY_TEXT_COLOR = '#0284C7';   // Sky 600 / Accent
export const SECONDARY_TEXT_COLOR = '#FFFFFF';
export const THIRD_TEXT_COLOR = '#0F172A';
export const FOURTH_TEXT_COLOR = '#64748B';    // Slate 500

export const BACKGROUND_LOGIN_GOOGLE = '#FFFFFF';
export const BACKGROUND_LOGIN_FACEBOOK = '#1877F2';

// Metro Line Badges & Indicators
export const BACKGROUND_LINE_EXPRESS_RED = '#DC2626';     // Express Line 1
export const BACKGROUND_LINE_RAPID_PURPLE = '#7C3AED';   // Rapid Line 2
export const BACKGROUND_LINE_LOOP_ORANGE = '#EA580C';    // Loop Line 4
export const BACKGROUND_LINE_LOCAL_BLUE = '#2563EB';     // Regular/Parador

// Legacy route aliases for backward compatibility
export const BACKGROUND_T01_EXPRES = BACKGROUND_LINE_EXPRESS_RED;
export const BACKGROUND_T02_EXPRES = BACKGROUND_LINE_RAPID_PURPLE;
export const BACKGROUND_T04_EXPRES = BACKGROUND_LINE_LOOP_ORANGE;
export const BACKGROUND_T05_PARADOR = BACKGROUND_LINE_LOCAL_BLUE;

// Status & Switch Indicators
export const SWITCH_COLOR_CIRCLE = '#10B981';  // Emerald 500
export const SWITCH_COLOR_TRUE = '#6EE7B7';    // Emerald 300
export const PENDIENTE_COLOR = '#F59E0B';      // Amber 500
export const APROBADA_COLOR = '#10B981';       // Emerald 500
export const DENEGADA_COLOR = '#EF4444';       // Rose 500

/**
 * Network Endpoints & API Keys (Sanitized for Demo Portfolio)
 * Configurable via environment variables or mock servers.
 */
export const APITB = process.env.API_BASE_URL || 'https://api.metrotransit.dev/v1/';
export const API_MESSAGES = process.env.API_MESSAGES_URL || 'https://api.metrotransit.dev/v1/messages/';
export const BASE_URL = process.env.BASE_URL || 'https://api.metrotransit.dev';

// Public dummy key placeholder - replace with your own API key in .env
export const API_KEY_GOOGLE = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDUMMY_KEY_FOR_DEMO_PURPOSES_ONLY';
