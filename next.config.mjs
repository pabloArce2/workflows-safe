/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true, // Ignorar errores de compilación de TypeScript
    },
    i18n: {
        locales: ["en", "es", "fr"],
        defaultLocale: "en",
    },
}

export default nextConfig
