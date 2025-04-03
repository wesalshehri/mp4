/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['lastfm.freetls.fastly.net'], // ✅ allow album cover image host
    },
};

module.exports = nextConfig;
