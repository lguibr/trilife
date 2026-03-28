import { GridState } from './types';

export const renderGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GridState,
  mouse: { x: number, y: number, isEnabled: boolean, radius: number, isErasing?: boolean }
) => {
  // Clear canvas with a very dark background
  ctx.fillStyle = '#050907'; // Very dark green-tinted black
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  
  const { grid, maskGrid, cols, rows, s, h } = state;

  // 1. Draw all grid lines in one batch
  ctx.beginPath();
  for (let c = 0; c < cols; c++) {
    const x_offset_base = c * s / 2;
    for (let r = 0; r < rows; r++) {
      if (!maskGrid[c][r]) continue;
      
      const y_offset = r * h;
      const isUp = (c + r) % 2 === 0;
      
      if (isUp) {
        ctx.moveTo(x_offset_base, y_offset + h);
        ctx.lineTo(x_offset_base + s / 2, y_offset);
        ctx.lineTo(x_offset_base + s, y_offset + h);
        ctx.lineTo(x_offset_base, y_offset + h);
      } else {
        ctx.moveTo(x_offset_base, y_offset);
        ctx.lineTo(x_offset_base + s / 2, y_offset + h);
        ctx.lineTo(x_offset_base + s, y_offset);
        ctx.lineTo(x_offset_base, y_offset);
      }
    }
  }
  ctx.strokeStyle = 'rgba(0, 230, 118, 0.35)';
  ctx.stroke();

  // 2. Draw all alive cells in another batch
  ctx.beginPath();
  for (let c = 0; c < cols; c++) {
    const x_offset_base = c * s / 2;
    for (let r = 0; r < rows; r++) {
      if (!maskGrid[c][r] || grid[c][r] !== 1) continue;
      
      const y_offset = r * h;
      const isUp = (c + r) % 2 === 0;
      
      if (isUp) {
        ctx.moveTo(x_offset_base, y_offset + h);
        ctx.lineTo(x_offset_base + s / 2, y_offset);
        ctx.lineTo(x_offset_base + s, y_offset + h);
        ctx.lineTo(x_offset_base, y_offset + h);
      } else {
        ctx.moveTo(x_offset_base, y_offset);
        ctx.lineTo(x_offset_base + s / 2, y_offset + h);
        ctx.lineTo(x_offset_base + s, y_offset);
        ctx.lineTo(x_offset_base, y_offset);
      }
    }
  }
  
  ctx.fillStyle = 'rgba(0, 230, 118, 0.9)';
  ctx.fill();

  // Draw mouse bubble
  if (mouse.isEnabled && mouse.x > -100) {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
    
    if (mouse.isErasing) {
      ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
      ctx.fillStyle = 'rgba(255, 50, 50, 0.1)';
    } else {
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.6)';
      ctx.fillStyle = 'rgba(0, 230, 118, 0.1)';
    }
    
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
  }
};
