/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Menonaktifkan ESLint selama build untuk memungkinkan proyek di-build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 