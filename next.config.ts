
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Removidos os domínios da CoinGecko
      // {
      //   protocol: 'https',
      //   hostname: 'coin-images.coingecko.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'assets.coingecko.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
