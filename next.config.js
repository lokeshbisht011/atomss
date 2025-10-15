/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    config.resolve.alias = {
      ...config.resolve.alias,
      'phaser3spectorjs': false,
    };
    return config;
  },
};

module.exports = nextConfig;
