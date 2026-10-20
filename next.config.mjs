/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    // Dashboard forms send cover images (max 5 MB) and long article bodies through
    // server actions; the default 1 MB limit rejects them.
    serverActions: { bodySizeLimit: '10mb' },
    // The dashboard's "Import original posts" reads these files at runtime.
    outputFileTracingIncludes: {
      '/dashboard': ['./content/blog/**/*', './content/case-studies/**/*'],
      '/dashboard/**/*': ['./content/blog/**/*', './content/case-studies/**/*'],
    },
  },
};
export default nextConfig;
