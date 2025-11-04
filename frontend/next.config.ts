/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignora erros de lint
  },
  typescript: {
    ignoreBuildErrors: true, // ignora erros de TypeScript
  },
}

module.exports = nextConfig

