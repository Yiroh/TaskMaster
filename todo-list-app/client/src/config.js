const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const SERVER_URL = isDev
  ? 'http://localhost:5000'
  : ''; // In production, the server is served from the same origin
