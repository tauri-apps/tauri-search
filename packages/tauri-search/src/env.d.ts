import { Stage } from "~/types";

export interface ImportMeta {
  env: {
    VITE_TITLE?: string;
    VITE_GH_USER?: string;
    VITE_GH_TOKEN?: string;
    VITE_ADMIN_KEY?: string;
    VITE_STAGE?: Stage;
    BASE_URL: string;
    MODE: string;
    PROD: boolean;
    DEV: boolean;
  };
}
