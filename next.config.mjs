/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use the SWC compiler for minification
  i18n: {
    locales: ["en", "es", "fr"],
    defaultLocale: "en",
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // Example to handle SVGs
    })
    return config
  },
  distDir: "build", // Custom build directory
  env: {
    CUSTOM_API_KEY: process.env.CUSTOM_API_KEY,
  },
}

export default nextConfig
