/**
 * Global API Configuration for Neela Sathwik Portfolio
 *
 * For local development: Automatically connects to http://localhost:5000
 * For production: Set RENDER_API_URL to your Render Web Service URL
 * Example: 'https://neela-sathwik-backend.onrender.com'
 */
const RENDER_API_URL = 'https://neela-sathwik-backend.onrender.com';

const API_CONFIG = {
  BASE_URL: (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  )
    ? 'http://localhost:5000'
    : RENDER_API_URL
};

window.API_CONFIG = API_CONFIG;
