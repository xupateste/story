/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://ferreteros.app/ferrisur',
        permanent: false,
        basePath: false
      },
    ]
  },
};
