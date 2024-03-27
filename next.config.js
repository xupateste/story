/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  
  async redirects() {
    return [
      {
        source: '/qr',
        destination: 'https://linkpop.com/ferrisur',
        permanent: false,
        basePath: false
      },
    ]
  },
};
