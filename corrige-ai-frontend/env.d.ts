interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ANOTHER_ENV_VARIABLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
