/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com", "res.cloudinary.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
