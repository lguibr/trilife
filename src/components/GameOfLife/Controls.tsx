import React from 'react';
import { Play, Pause, RotateCcw, MousePointer2 } from 'lucide-react';
import { UiGridConfig, RuntimeConfig } from './types';

interface ControlsProps {
  uiGridConfig: UiGridConfig;
  setUiGridConfig: (config: UiGridConfig) => void;
  runtimeConfig: RuntimeConfig;
  setRuntimeConfig: (config: RuntimeConfig) => void;
  handleReload: () => void;
}

export const Controls: React.FC<ControlsProps> = React.memo(({ 
  uiGridConfig, 
  setUiGridConfig, 
  runtimeConfig, 
  setRuntimeConfig, 
  handleReload 
}) => {
  return (
    <div className="fixed top-6 left-6 z-10 bg-[#050907]/90 backdrop-blur-md border border-[#0F9D58]/40 p-5 rounded-xl shadow-2xl shadow-[#0F9D58]/20 text-white w-80 font-sans flex flex-col gap-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tighter mb-1 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 drop-shadow-sm">
          Triangular Life
        </h1>
        <p className="text-xs text-green-100/60 font-light tracking-wide leading-relaxed">
          A custom Conway's Game of Life simulation running on a rhombus triangular grid.
        </p>
      </div>

      <hr className="border-[#0F9D58]/30" />

      {/* Runtime Controls */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#00E676] tracking-wide">Runtime</h3>
          <button 
            onClick={() => setRuntimeConfig({...runtimeConfig, isPlaying: !runtimeConfig.isPlaying})}
            className="p-2 bg-[#0F9D58]/20 hover:bg-[#0F9D58]/40 text-[#00E676] rounded-full transition-colors active:scale-90"
            title={runtimeConfig.isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {runtimeConfig.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-300 mb-2 flex justify-between">
            <span>Speed (FPS)</span>
            <span className="text-[#00E676]">{runtimeConfig.fps.toFixed(1)}</span>
          </label>
          <input 
            type="range" min="0.5" max="60" step="0.5"
            value={runtimeConfig.fps}
            onChange={(e) => setRuntimeConfig({...runtimeConfig, fps: parseFloat(e.target.value)})}
            className="w-full accent-[#00E676] cursor-pointer"
          />
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-2">
              <MousePointer2 size={14} />
              Gravity Bubble
            </label>
            <button 
              onClick={() => setRuntimeConfig({...runtimeConfig, mouseEnabled: !runtimeConfig.mouseEnabled})}
              className={`text-xs px-2 py-1 rounded transition-colors ${runtimeConfig.mouseEnabled ? 'bg-[#00E676] text-black font-bold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {runtimeConfig.mouseEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          {runtimeConfig.mouseEnabled && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-2">
              <label className="block text-xs font-medium text-gray-400 mb-1 flex justify-between">
                <span>Bubble Radius</span>
                <span>{runtimeConfig.mouseRadius}px</span>
              </label>
              <input 
                type="range" min="5" max="200" step="5"
                value={runtimeConfig.mouseRadius}
                onChange={(e) => setRuntimeConfig({...runtimeConfig, mouseRadius: parseInt(e.target.value)})}
                className="w-full accent-[#00E676] cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      <hr className="border-[#0F9D58]/30" />

      {/* Grid Controls */}
      <div>
        <h3 className="text-lg font-bold text-[#00E676] mb-4 tracking-wide">Grid Config</h3>
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-300 mb-2 flex justify-between">
            <span>Triangle Size (px)</span>
            <span className="text-[#00E676]">{uiGridConfig.triangleSize}</span>
          </label>
          <input 
            type="range" min="4" max="120" step="1"
            value={uiGridConfig.triangleSize}
            onChange={(e) => setUiGridConfig({...uiGridConfig, triangleSize: parseInt(e.target.value)})}
            className="w-full accent-[#00E676] cursor-pointer"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-300 mb-2 flex justify-between">
            <span>Initial Density</span>
            <span className="text-[#00E676]">{Math.round(uiGridConfig.initialDensity * 100)}%</span>
          </label>
          <input 
            type="range" min="0" max="1" step="0.01"
            value={uiGridConfig.initialDensity}
            onChange={(e) => setUiGridConfig({...uiGridConfig, initialDensity: parseFloat(e.target.value)})}
            className="w-full accent-[#00E676] cursor-pointer"
          />
        </div>

        <button 
          onClick={handleReload}
          className="w-full py-2.5 bg-[#0F9D58] hover:bg-[#00E676] text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-[#0F9D58]/30 flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Reload Grid
        </button>
      </div>
    </div>
  );
});
