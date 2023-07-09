import { FitItem, FitResult, MeasurementResult } from "../types/types";
import { Arrow, FitRange, ItemDrawing } from "../types/productModel";

declare class ProductModelClass {
  constructor(item: FitItem);
  arrows: Record<string, Arrow>;
  itemDrawing: ItemDrawing;
  static getFit: (measurementResult: FitResult, overflowFits?: boolean) => FitRange | null;
}

declare namespace ProductModel {
  const humanMeasurementMap: Map<string, string>;
  const fitRanges: FitRange[];
  const getResult: (
    measurement: string,
    value: number,
    matchItem: MeasurementResult
  ) => {
    fitValue: number;
    fitText: string;
    fit: FitRange;
    isPinched: boolean;
    isLongFit: boolean;
  };
  const stretchFactor: (measurement: string) => number;
  const isStretching: () => boolean;
  const DEFAULT_OPTIMAL_FIT: number;
  const DEFAULT_OPTIMAL_STRETCH: number;
  const fitLabelsAndColors: { label: string; arrowColor: string }[];
  const pinchedFits: string[];
}

export = ProductModelClass;
