/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? '/fifa' : '',
  images: {
    unoptimized: true // Optional if using next/image
  }
};

module.exports = nextConfig;

