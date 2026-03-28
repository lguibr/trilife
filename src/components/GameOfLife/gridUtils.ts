import { GridState, GridConfig } from './types';

export const calculateGridDimensions = (width: number, height: number, s: number) => {
  const h = (s * Math.sqrt(3)) / 2;
  const cols = Math.ceil(width / (s / 2)) + 2;
  const rows = Math.ceil(height / h) + 2;
  return { cols, rows, h };
};

export const initGrids = (width: number, height: number, config: GridConfig): GridState => {
  const s = config.triangleSize;
  const { cols, rows, h } = calculateGridDimensions(width, height, s);

  const grid = Array(cols).fill(0).map(() => Array(rows).fill(0));
  const nextGrid = Array(cols).fill(0).map(() => Array(rows).fill(0));
  const maskGrid = Array(cols).fill(false).map(() => Array(rows).fill(false));

  // Snap center to a grid vertex for perfect symmetry
  // Triangle vertices are at (c, r) where c + r is ODD
  let center_c = Math.floor(cols / 2);
  let center_r = Math.floor(rows / 2);
  if ((center_c + center_r) % 2 === 0) {
    center_c += 1;
  }
  const cx_px = center_c * s / 2;
  const cy_px = center_r * h;
  
  // Calculate K (number of vertical steps from center to edge)
  // We want the hexagon to fill about 85% of the screen
  const maxK_h = (height * 0.85) / (2 * h);
  const maxK_w = (width * 0.85) / (2 * s);
  const K = Math.floor(Math.min(maxK_h, maxK_w));

  const isPointInsideHex = (px: number, py: number) => {
    const dx = px - cx_px;
    const dy = py - cy_px;
    const eps = 0.1; // small epsilon for floating point precision
    return dy >= -K * h - eps && 
           dy <= K * h + eps && 
           dy + Math.sqrt(3) * dx >= -2 * K * h - eps && 
           dy + Math.sqrt(3) * dx <= 2 * K * h + eps && 
           dy - Math.sqrt(3) * dx >= -2 * K * h - eps && 
           dy - Math.sqrt(3) * dx <= 2 * K * h + eps;
  };

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x_offset = c * s / 2;
      const y_offset = r * h;
      const isUp = (c + r) % 2 === 0;
      
      let v1x, v1y, v2x, v2y, v3x, v3y;
      if (isUp) {
        v1x = x_offset; v1y = y_offset + h;
        v2x = x_offset + s / 2; v2y = y_offset;
        v3x = x_offset + s; v3y = y_offset + h;
      } else {
        v1x = x_offset; v1y = y_offset;
        v2x = x_offset + s / 2; v2y = y_offset + h;
        v3x = x_offset + s; v3y = y_offset;
      }
      
      // A triangle is only inside if ALL 3 of its vertices are inside the mathematical hexagon
      const isInside = isPointInsideHex(v1x, v1y) && 
                       isPointInsideHex(v2x, v2y) && 
                       isPointInsideHex(v3x, v3y);
                       
      if (isInside) {
        maskGrid[c][r] = true;
        if (Math.random() < config.initialDensity) {
          grid[c][r] = 1;
        }
      }
    }
  }

  return { grid, nextGrid, maskGrid, cols, rows, s, h };
};
