// @ts-check
import /** @type {import('next').NextConfig} */('next')

// export default {
//   reactStrictMode: true,
//   // …ほかの設定
// }

const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    config.externals.push({
      prisma: 'commonjs prisma',
      '@prisma/client': 'commonjs @prisma/client',
    });
    return config;
  },

  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/.prisma/**'],
    },
  },
};

export default nextConfig;