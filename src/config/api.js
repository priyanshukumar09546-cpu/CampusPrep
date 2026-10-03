// ============================================================================
// PROFESSORVIRUS — CENTRAL API CLIENT CONFIGURATION
// Automatically handles development (localhost:5000) vs production (same-origin '')
// Supports optional override via VITE_API_URL or VITE_BACKEND_URL
// ============================================================================

const isDev = import.meta.env.DEV;
const configuredUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').trim();

export const API_URL = configuredUrl || (isDev ? 'http://localhost:5000' : '');
export default API_URL;
