export interface FitRange {
  label: string;
  start: number;
  end: number;
  arrowColor: string;
  matches: (value: number) => boolean;
}

export interface Coord {
  X: number;
  Y: number;
}

export interface Line extends Coord {
  cp1X: number;
  cp1Y: number;
  cp2X: number;
  cp2Y: number;
}

export interface Circle extends Coord {
  R: number;
}

export interface Arrow {
  mirror: boolean;
  coords: Coord[];
  lift: boolean;
  style: string;
  midCircle?: Coord;
  num: string;
}

export interface Accent {
  type: string;
  coords: Coord[];
  noMirror: boolean;
}

export interface ItemDrawing {
  mirror: boolean;
  coords: Coord[];
  accents: Accent[];
}
