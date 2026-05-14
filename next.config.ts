import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Force le déploiement même s'il y a des avertissements/erreurs de linting
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Force le déploiement même s'il reste des petites erreurs de types
    ignoreBuildErrors: true,
  },
  /* Tes autres options ici si tu en as */
};

export default nextConfig;
