import dns from 'dns';

// Polyfill browser globals required by pdf-parse v2 in headless serverless environments
if (typeof globalThis.DOMMatrix === 'undefined') globalThis.DOMMatrix = class DOMMatrix {};
if (typeof globalThis.ImageData === 'undefined') globalThis.ImageData = class ImageData {};
if (typeof globalThis.Path2D === 'undefined') globalThis.Path2D = class Path2D {};

// Ensure Google & Cloudflare DNS resolvers are active for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {
  console.warn('[SERVERLESS DNS WARNING]', e?.message || e);
}

import app from '../server/index.js';

export default app;
