/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    filestackApi: "Aj6fZpiFQviOse160yT0Tz",
    cloudName: "dgswa3kpt",
    preset: "inventory",
    apiKey: "554724966329866",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "cdn.filestackcontent.com",
      },
      { protocol: "https", hostname: "nextui.org" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
