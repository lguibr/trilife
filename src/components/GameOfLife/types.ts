export interface GridConfig {
  triangleSize: number;
  initialDensity: number;
  reloadKey: number;
}

export interface UiGridConfig {
  triangleSize: number;
  initialDensity: number;
}

export interface RuntimeConfig {
  fps: number;
  isPlaying: boolean;
  mouseEnabled: boolean;
  mouseRadius: number;
}

export interface GridState {
  grid: number[][];
  nextGrid: number[][];
  maskGrid: boolean[][];
  cols: number;
  rows: number;
  s: number; // triangleSize
  h: number; // triangleHeight
}
