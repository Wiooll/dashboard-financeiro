/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_NODE_ENV: 'development' | 'test' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 