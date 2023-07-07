export const UNIT_FACTORS = {
  cm: 10.0,
  in: 25.4,
};
export const INCH_FRACTION_PRECISION = 8;

export const INCH_FRACTION_OPTIONS = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞"];

export const convertToInches = (value: number) => {
  const inches = value / UNIT_FACTORS.in;
  return [
    Math.floor(Math.round(inches * INCH_FRACTION_PRECISION) / INCH_FRACTION_PRECISION),
    Math.round((inches % 1) * INCH_FRACTION_PRECISION) % INCH_FRACTION_PRECISION,
  ];
};
