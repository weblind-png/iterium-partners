/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supprime les options expérimentales si elles y sont
  output: 'standalone', 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
