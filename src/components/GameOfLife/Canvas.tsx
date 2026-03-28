import React, { useEffect, useRef } from 'react';
import { GridConfig, RuntimeConfig, GridState } from './types';
import { initGrids } from './gridUtils';
import { updateSimulation, setInCircle } from './simulationUtils';
import { renderGrid } from './renderUtils';

interface CanvasProps {
  gridConfig: GridConfig;
  runtimeConfig: RuntimeConfig;
}

export const Canvas: React.FC<CanvasProps> = React.memo(({ gridConfig, runtimeConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef(runtimeConfig);
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false, button: 0 });

  // Keep runtime ref updated without re-triggering the main effect
  useEffect(() => {
    runtimeRef.current = runtimeConfig;
  }, [runtimeConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize by disabling alpha on root
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let state: GridState = initGrids(width, height, gridConfig);

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      const currentRuntime = runtimeRef.current;
      const currentMouse = mouseRef.current;
      let needsRender = false;

      // Mouse interaction (Gravitational Bubble)
      if (currentRuntime.mouseEnabled && currentMouse.isDown) {
        const valueToSet = currentMouse.button === 2 ? 0 : 1;
        const changed = setInCircle(state, currentMouse.x, currentMouse.y, currentRuntime.mouseRadius, valueToSet);
        if (changed) needsRender = true;
      }

      // Simulation step
      const interval = 1000 / currentRuntime.fps;
      const deltaTime = time - lastTime;

      if (currentRuntime.isPlaying && deltaTime > interval) {
        state = updateSimulation(state, gridConfig);
        lastTime = time - (deltaTime % interval);
        needsRender = true;
      }

      // Always render if mouse is enabled to draw the bubble smoothly following the cursor
      if (needsRender || currentRuntime.mouseEnabled) {
        renderGrid(ctx, width, height, state, {
          x: currentMouse.x,
          y: currentMouse.y,
          isEnabled: currentRuntime.mouseEnabled,
          radius: currentRuntime.mouseRadius,
          isErasing: currentMouse.isDown && currentMouse.button === 2
        });
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      state = initGrids(width, height, gridConfig);
      // Force a render immediately
      renderGrid(ctx, width, height, state, {
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        isEnabled: runtimeRef.current.mouseEnabled,
        radius: runtimeRef.current.mouseRadius,
        isErasing: mouseRef.current.isDown && mouseRef.current.button === 2
      });
    };

    const updateMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseDown = (e: MouseEvent) => {
      updateMouse(e);
      mouseRef.current.isDown = true;
      mouseRef.current.button = e.button;
    };
    const handleMouseUp = () => { mouseRef.current.isDown = false; };
    const handleMouseMove = (e: MouseEvent) => { updateMouse(e); };
    const handleMouseLeave = () => { mouseRef.current.isDown = false; mouseRef.current.x = -1000; };
    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); };

    const updateTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      updateTouch(e);
      mouseRef.current.isDown = true;
      mouseRef.current.button = 0;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      updateTouch(e);
    };
    const handleTouchEnd = () => {
      mouseRef.current.isDown = false;
      mouseRef.current.x = -1000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('contextmenu', handleContextMenu);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('contextmenu', handleContextMenu);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridConfig]); // ONLY re-run when gridConfig changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 block"
      style={{ background: '#050907' }}
    />
  );
});
