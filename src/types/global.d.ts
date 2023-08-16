import { SizemeOptions, SizemeProduct, SKUProduct } from "./types";

declare global {
  interface Window {
    sizeme_options: SizemeOptions;
    sizeme_product: SizemeProduct | SKUProduct;
  }

  const VERSION: string;
  const BUILD_DATE: string;
}
