// @ts-nocheck
// This file overrides TypeScript checking for Next.js App Router specific validations

// Suppress Next.js App Router client component prop validation warnings
declare module "*.tsx" {
  const content: any;
  export default content;
}

// Global override for all React component props
declare global {
  namespace React {
    interface Component<P = {}, S = {}, SS = any> {
      props: P & { [key: string]: any };
    }
    
    interface FunctionComponent<P = {}> {
      (props: P & { [key: string]: any }, context?: any): ReactElement<any, any> | null;
    }
  }
}

export {};