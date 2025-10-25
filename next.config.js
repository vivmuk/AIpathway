/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure proper output for Render
  output: 'standalone',
}

module.exports = nextConfig

