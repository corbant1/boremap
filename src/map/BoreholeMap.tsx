/**
 * Map component for displaying and editing boreholes
 * Currently shows a placeholder grid map with toolbar controls
 */

import { useState } from 'react';
import type { Borehole } from '../data/types';
import { CursorIcon, PlusIcon, RefreshIcon, LayersIcon } from '../components/icons';

interface BoreholeMapProps {
  boreholes: Borehole[];
  selectedBorehole: Borehole | null;
  mode: 'select' | 'add';
  onModeChange: (mode: 'select' | 'add') => void;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (borehole: Borehole) => void;
  center: [number, number] | null;
  onCenterChange: () => void;
}

export function BoreholeMap({
  boreholes,
  selectedBorehole,
  mode,
  onModeChange,
  onMapClick,
  onMarkerClick,
}: BoreholeMapProps) {
  const [zoomLevel, setZoomLevel] = useState(14);

  // Calculate approximate scale based on zoom
  const getScaleLabel = (zoom: number): string => {
    const metersPerPixel = 156543.03392 * Math.cos(0) / Math.pow(2, zoom);
    const scaleMeters = metersPerPixel * 200;
    if (scaleMeters >= 1000) {
      return `${Math.round(scaleMeters / 1000)}km`;
    }
    return `${Math.round(scaleMeters)}m`;
  };

  // Handle click on placeholder map
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'add') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to approximate lat/lng
    // Using Auckland as default center (-36.8485, 174.7633)
    const centerLat = -36.8485;
    const centerLng = 174.7633;
    const scale = 0.0001 * (20 - zoomLevel);
    
    const lat = centerLat + (rect.height / 2 - y) * scale;
    const lng = centerLng + (x - rect.width / 2) * scale;
    
    onMapClick(lat, lng);
  };

  return (
    <div className="h-full relative bg-slate-100">
      {/* Placeholder map with grid */}
      <div 
        className={`h-full w-full relative overflow-hidden ${mode === 'add' ? 'cursor-crosshair' : 'cursor-default'}`}
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundColor: '#f1f5f9',
        }}
      >
        {/* Borehole markers */}
        {boreholes.map((borehole) => {
          const num = borehole.code.replace(/\D/g, '');
          const isSelected = borehole.id === selectedBorehole?.id;
          
          // Position markers in a grid pattern for the placeholder
          const index = boreholes.indexOf(borehole);
          const cols = 5;
          const row = Math.floor(index / cols);
          const col = index % cols;
          const x = 80 + col * 133;
          const y = 100 + row * 138;
          
          return (
            <button
              key={borehole.id}
              onClick={(e) => {
                e.stopPropagation();
                onMarkerClick(borehole);
              }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary-600 text-white scale-110 shadow-lg shadow-primary-600/40'
                  : 'bg-white text-primary-600 border-2 border-primary-600 hover:scale-110 shadow-md'
              }`}
              style={{ left: x, top: y }}
            >
              {num.padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {/* Style toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-md border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <LayersIcon className="w-4 h-4" />
          Street
        </button>
      </div>

      {/* Bottom toolbar */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
        {/* Mode toggle */}
        <div className="flex bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <button
            onClick={() => onModeChange('select')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'select' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CursorIcon className="w-4 h-4" />
            Select
          </button>
          <button
            onClick={() => onModeChange('add')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${
              mode === 'add' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <PlusIcon className="w-4 h-4" />
            Add borehole
          </button>
        </div>

        {/* Reset view */}
        <button
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshIcon className="w-4 h-4" />
          Reset v
        </button>

        {/* Zoom slider */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md border border-slate-200">
          <input
            type="range"
            min="10"
            max="20"
            step="0.5"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <span className="text-sm text-slate-600 w-12">{getScaleLabel(zoomLevel)}</span>
        </div>
      </div>

      {/* Empty state overlay */}
      {boreholes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No boreholes yet</h3>
            <p className="text-slate-500 mb-4">Click "Add borehole" then click on the map to add your first borehole</p>
          </div>
        </div>
      )}
    </div>
  );
}
