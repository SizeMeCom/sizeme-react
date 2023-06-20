import { MeasurementResult } from "../types/types";

interface FitRange {
  label: string;
  start: number;
  end: number;
  arrowColor: string;
  matches: (value: number) => boolean;
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

export = ProductModel;
