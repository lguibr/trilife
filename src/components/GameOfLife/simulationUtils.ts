import { GridState, GridConfig } from './types';

// 12-neighbor offsets for triangular grid (flattened: [dc1, dr1, dc2, dr2, ...])
const upOffsets = [
  0, -1, -1, -1, 1, -1,
  -1, 0, 1, 0, -2, 0, 2, 0,
  0, 1, -1, 1, 1, 1, -2, 1, 2, 1
];

const downOffsets = [
  0, 1, -1, 1, 1, 1,
  -1, 0, 1, 0, -2, 0, 2, 0,
  0, -1, -1, -1, 1, -1, -2, -1, 2, -1
];

export const updateSimulation = (state: GridState, config: GridConfig): GridState => {
  const { grid, nextGrid, maskGrid, cols, rows } = state;
  let activeCount = 0;
  let maskCount = 0;
  
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (!maskGrid[c][r]) continue;
      maskCount++;
      
      const isUp = (c + r) % 2 === 0;
      const offsets = isUp ? upOffsets : downOffsets;
      let neighbors = 0;

      for (let i = 0; i < 24; i += 2) {
        const nc = c + offsets[i];
        const nr = r + offsets[i + 1];
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && maskGrid[nc][nr]) {
          neighbors += grid[nc][nr];
        }
      }

      const alive = grid[c][r] === 1;
      // Stricter rules to prevent overpopulation (Conway-like: Survive 2,3; Birth 3)
      if (alive) {
        if (neighbors === 2 || neighbors === 3) {
          nextGrid[c][r] = 1;
          activeCount++;
        } else {
          nextGrid[c][r] = 0;
        }
      } else {
        if (neighbors === 3) {
          nextGrid[c][r] = 1;
        } else {
          nextGrid[c][r] = 0;
        }
      }
    }
  }

  // Swap grids
  return {
    ...state,
    grid: nextGrid,
    nextGrid: grid
  };
};

export const setInCircle = (state: GridState, cx: number, cy: number, radius: number, value: number): boolean => {
  const { grid, maskGrid, cols, rows, s, h } = state;
  let changed = false;
  const rSq = radius * radius;
  
  // Calculate bounding box in grid coordinates
  const minC = Math.max(0, Math.floor((cx - radius) / (s / 2)) - 1);
  const maxC = Math.min(cols - 1, Math.ceil((cx + radius) / (s / 2)) + 1);
  const minR = Math.max(0, Math.floor((cy - radius) / h) - 1);
  const maxR = Math.min(rows - 1, Math.ceil((cy + radius) / h) + 1);
  
  for (let c = minC; c <= maxC; c++) {
    for (let r = minR; r <= maxR; r++) {
      if (!maskGrid[c][r]) continue;
      
      const x_offset = c * s / 2;
      const y_offset = r * h;
      const isUp = (c + r) % 2 === 0;
      
      // Approximate triangle center
      const tri_cx = x_offset + s / 2;
      const tri_cy = isUp ? y_offset + h * 0.66 : y_offset + h * 0.33;
      
      const dx = tri_cx - cx;
      const dy = tri_cy - cy;
      
      if (dx * dx + dy * dy <= rSq) {
        if (grid[c][r] !== value) {
          grid[c][r] = value;
          changed = true;
        }
      }
    }
  }
  return changed;
};
