import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FitItem, Measurements, SizemeProduct, SKUProduct } from "../types/types";
import ProductModel from "../api/ProductModel";
import { AppThunk } from "./store";
import { apiFetch, ApiError } from "../api/api";

type Product = SizemeProduct & { model: ProductModel; skuMap?: Map<string, string> };

interface State {
  resolved: boolean;
  product?: Product;
  error?: unknown;
}

const initialState: State = {
  resolved: false,
};

const setProductInfo = createAction("setProductInfo", (payload?: Product, error?: unknown) => ({
  payload,
  error,
}));

const getProductThunk = createAsyncThunk<Product, SKUProduct>(
  "getProductInfo",
  async (product: SKUProduct) => {
    const dbItem = await apiFetch<FitItem>("GET", `products/${encodeURIComponent(product.SKU)}`, {
      responseInterceptor: (res) => {
        if (res.status === 204) {
          throw new ApiError("Product not found", res);
        }
        return res;
      },
    });

    if (parseInt(dbItem.itemType[0]) === 0) {
      throw new Error("bad product");
    }

    const skuMap = new Map(Object.entries(product.item));
    const measurementEntries = Object.entries(dbItem.measurements)
      .map(([sku, val]) => {
        if (skuMap.has(sku)) {
          return [skuMap.get(sku), val];
        }
        return undefined;
      })
      .filter((i): i is [string, Measurements] => !!i);

    if (measurementEntries.length) {
      const measurements = Object.fromEntries(measurementEntries);
      const item = { ...dbItem, measurements };
      const model = new ProductModel(item);
      return { ...product, item, skuMap, model };
    } else {
      // eslint-disable-next-line no-console
      console.log("Initializing SizeMe failed: Couldn't map product measurements");
      throw new Error("Couldn't map product measurements");
    }
  }
);

const productInfoSlice = createSlice({
  name: "productInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(setProductInfo, (state, { payload, error }) => ({
        resolved: !error,
        product: payload,
        error,
      }))
      .addCase(getProductThunk.fulfilled, (state, { payload }) => ({
        resolved: true,
        product: payload,
      }))
      .addCase(getProductThunk.rejected, (state, { error }) => ({
        resolved: false,
        error,
      })),
});

export default productInfoSlice.reducer;

const isSKUProduct = (product: SizemeProduct | SKUProduct): product is SKUProduct =>
  !!(product as SKUProduct).SKU;

export const getProduct = (): AppThunk => async (dispatch, getState) => {
  if (getState().productInfo.resolved) {
    return true;
  }

  const product = window.sizeme_product;
  if (!product) {
    dispatch(setProductInfo(undefined, new Error("no product")));
    return false;
  }

  if (!isSKUProduct(product)) {
    if (!product.item.itemType) {
      dispatch(setProductInfo(undefined, new Error("no product")));
      return false;
    }
    if (parseInt(product.item.itemType[0]) === 0) {
      dispatch(setProductInfo(undefined, new Error("bad product")));
      return false;
    }
    const model = new ProductModel(product.item);
    dispatch(setProductInfo({ ...product, model }));
    return true;
  } else {
    try {
      await dispatch(getProductThunk(product)).unwrap();
      return true;
    } catch (e) {
      return false;
    }
  }
};
