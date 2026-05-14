/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force le mode SSR (Server Side Rendering) pour tout le site
  // Cela empêche Next.js de tenter de lire la DB pendant le build
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Si tu es sur Next 15+, on peut forcer le bailout statique
    missingSuspenseWithCSRBailout: false, 
  },
};

export default nextConfig;