/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/d4xwcj148/**",
      },
    ],
  },
};

module.exports = nextConfig;
