/* eslint-disable */
// Suppress all Next.js App Router client component validation warnings
declare module 'next' {
  interface NextConfig {
    experimental?: {
      appDir?: boolean
      serverComponentsExternalPackages?: string[]
      strictNextHead?: boolean
      serverActions?: {
        bodySizeLimit?: boolean | number
      }
    }
  }
}

// Disable TypeScript warnings for function props in client components
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      [key: string]: any
    }
  }
}

export {}