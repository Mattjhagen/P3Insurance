/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure server runs on Render's PORT
  output: 'standalone',
}

module.exports = nextConfig
