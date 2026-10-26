import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  // The dev overlay badge sits inside every section screenshot units diff against the mockup.
  devIndicators: false,
  // Keeps /etc/sablia-site/build.env (VITE_ name) untouched on the deploy host.
  env: { NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY },
}

export default nextConfig
