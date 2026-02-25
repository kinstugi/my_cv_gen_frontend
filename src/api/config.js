/** Production API URL — used by default so tests and dev always hit production, not localhost */
const PRODUCTION_API_URL = 'https://my-cv-gen-api.onrender.com';

/**
 * REST API base URL. Override with VITE_API_BASE_URL in .env only if you need a different backend (e.g. local).
 * Default is production so we never use localhost for the API.
 */
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? PRODUCTION_API_URL;
