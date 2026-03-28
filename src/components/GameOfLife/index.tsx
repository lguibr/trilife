import React, { useState, useCallback } from 'react';
import { Canvas } from './Canvas';
import { Controls } from './Controls';
import { GridConfig, UiGridConfig, RuntimeConfig } from './types';

const GameOfLifeBackground: React.FC = () => {
  // Grid Config requires a full re-initialization of the canvas arrays
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    triangleSize: 35,
    initialDensity: 0.15,
    reloadKey: 0,
  });

  // UI draft state for Grid Config
  const [uiGridConfig, setUiGridConfig] = useState<UiGridConfig>({
    triangleSize: 35,
    initialDensity: 0.15,
  });

  // Runtime Config applies instantly without re-initializing the grid
  const [runtimeConfig, setRuntimeConfig] = useState<RuntimeConfig>({
    fps: 2.5,
    isPlaying: true,
    mouseEnabled: true,
    mouseRadius: 80,
  });

  const handleReload = useCallback(() => {
    setGridConfig(prev => ({
      ...uiGridConfig,
      reloadKey: prev.reloadKey + 1,
    }));
  }, [uiGridConfig]);

  return (
    <>
      <Canvas 
        gridConfig={gridConfig} 
        runtimeConfig={runtimeConfig} 
      />
      <Controls 
        uiGridConfig={uiGridConfig} 
        setUiGridConfig={setUiGridConfig} 
        runtimeConfig={runtimeConfig}
        setRuntimeConfig={setRuntimeConfig}
        handleReload={handleReload} 
      />
    </>
  );
};

export default GameOfLifeBackground;
