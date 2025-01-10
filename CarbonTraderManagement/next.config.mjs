import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async redirects() {
    return [
      {source: '/en', destination: '/', permanent: true},
      {source: `/${process.env.NEXT_PUBLIC_DISCOVER_NAME}/1`, destination: `/${process.env.NEXT_PUBLIC_DISCOVER_NAME}`, permanent: true},
      {source: `/${process.env.NEXT_PUBLIC_DISCOVER_NAME}/0`, destination: `/${process.env.NEXT_PUBLIC_DISCOVER_NAME}`, permanent: true},
      {source: `/:locale/${process.env.NEXT_PUBLIC_DISCOVER_NAME}/1`, destination: `/:locale/${process.env.NEXT_PUBLIC_DISCOVER_NAME}`, permanent: true},
      {source: `/:locale/${process.env.NEXT_PUBLIC_DISCOVER_NAME}/0`, destination: `/:locale/${process.env.NEXT_PUBLIC_DISCOVER_NAME}`, permanent: true},
    ];
  },
};

export default withNextIntl(nextConfig);
