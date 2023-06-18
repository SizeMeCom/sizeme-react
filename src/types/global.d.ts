import { SizemeOptions } from "./types";

declare global {
  interface Window {
    sizeme_options?: SizemeOptions;
  }

  const VERSION: string;
  const BUILD_DATE: string;
}
