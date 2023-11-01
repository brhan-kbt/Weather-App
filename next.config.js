/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: "https",
            hostname: "weatherbit.io",
        },
    ]},
  reactStrictMode: true,
}

module.exports = nextConfig
