/**
 * Project workspace page - map and borehole table
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar } from '../components/AppBar';
import { BoreholeMap } from '../map/BoreholeMap';
import { BoreholeTable } from '../components/BoreholeTable';
import { BoreholeDrawer } from '../components/BoreholeDrawer';
import { ExportCSVModal } from '../components/ExportCSVModal';
import { ProjectSettingsModal } from '../components/ProjectSettingsModal';
import { DownloadIcon, ChevronDownIcon, CogIcon } from '../components/icons';
import { useProjects } from '../hooks/useProjects';
import type { Borehole } from '../data/types';

type MapMode = 'select' | 'add';

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { 
    currentProject, 
    loadProject, 
    selectedBorehole, 
    selectBorehole,
    addBorehole,
    updateBorehole,
    deleteBorehole,
    updateProject,
  } = useProjects();

  const [mapMode, setMapMode] = useState<MapMode>('select');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [newBoreholeData, setNewBoreholeData] = useState<{ lat: number; lng: number } | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Load project on mount
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  // Redirect if project not found
  useEffect(() => {
    if (projectId && currentProject === null) {
      // Wait a bit for loading, then redirect
      const timer = setTimeout(() => {
        if (!currentProject) {
          navigate('/');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [projectId, currentProject, navigate]);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Handle map click in add mode
  const handleMapClick = (lat: number, lng: number) => {
    if (mapMode === 'add') {
      setNewBoreholeData({ lat, lng });
      setIsDrawerOpen(true);
      selectBorehole(null);
    }
  };

  // Handle borehole selection from map or table
  const handleSelectBorehole = (borehole: Borehole | null) => {
    selectBorehole(borehole);
    setNewBoreholeData(null);
    if (borehole) {
      setIsDrawerOpen(true);
    }
  };

  // Handle borehole marker click
  const handleMarkerClick = (borehole: Borehole) => {
    handleSelectBorehole(borehole);
    setMapMode('select');
  };

  // Handle table row click
  const handleTableRowClick = (borehole: Borehole) => {
    handleSelectBorehole(borehole);
    setMapCenter([borehole.longitude, borehole.latitude]);
  };

  // Handle save from drawer
  const handleSaveBorehole = (data: Partial<Borehole>) => {
    if (newBoreholeData) {
      // Creating new borehole
      addBorehole({
        latitude: newBoreholeData.lat,
        longitude: newBoreholeData.lng,
        code: data.code,
        name: data.name,
        status: data.status,
        groundLevel: data.groundLevel,
        totalDepth: data.totalDepth,
        notes: data.notes,
      });
      setNewBoreholeData(null);
      setMapMode('select');
    } else if (selectedBorehole) {
      // Updating existing borehole
      updateBorehole(selectedBorehole.id, data);
    }
    setIsDrawerOpen(false);
  };

  // Handle delete from drawer
  const handleDeleteBorehole = (boreholeId: string) => {
    deleteBorehole(boreholeId);
    setIsDrawerOpen(false);
  };

  // Handle drawer close
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setNewBoreholeData(null);
    selectBorehole(null);
  };

  // Handle project settings save
  const handleSaveProjectSettings = (data: { name: string; client: string; locationDescription: string }) => {
    updateProject(currentProject.id, data);
    setIsSettingsModalOpen(false);
  };

  // Filter boreholes for table
  const filteredBoreholes = currentProject.boreholes.filter(bh => {
    const query = tableSearchQuery.toLowerCase();
    return (
      bh.code.toLowerCase().includes(query) ||
      (bh.name?.toLowerCase().includes(query)) ||
      (bh.notes?.toLowerCase().includes(query))
    );
  });

  return (
    <div className="h-full flex flex-col">
      <AppBar />

      {/* Project header */}
      <div className="shrink-0 px-4 lg:px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{currentProject.name}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {currentProject.client && <span>{currentProject.client}</span>}
              {currentProject.client && <span>•</span>}
              <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-600">
                {currentProject.coordinateSystem}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
          >
            <DownloadIcon className="w-4 h-4" />
            Export CSV
          </button>

          <div className="relative">
            <button
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
            >
              <CogIcon className="w-4 h-4" />
              Project settings
              <ChevronDownIcon className="w-3 h-3" />
            </button>

            {isSettingsDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsSettingsDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                  <button
                    onClick={() => {
                      setIsSettingsDropdownOpen(false);
                      setIsSettingsModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Edit project details
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsDropdownOpen(false);
                      if (confirm('Are you sure you want to delete this project?')) {
                        navigate('/');
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content: Map + Table */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Map */}
        <div className="flex-1 lg:w-3/5 relative min-h-[300px]">
          <BoreholeMap
            boreholes={currentProject.boreholes}
            selectedBorehole={selectedBorehole}
            mode={mapMode}
            onModeChange={setMapMode}
            onMapClick={handleMapClick}
            onMarkerClick={handleMarkerClick}
            center={mapCenter}
            onCenterChange={() => setMapCenter(null)}
          />
        </div>

        {/* Table */}
        <div className="lg:w-2/5 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 bg-white min-h-[300px]">
          <BoreholeTable
            boreholes={filteredBoreholes}
            selectedBorehole={selectedBorehole}
            searchQuery={tableSearchQuery}
            onSearchChange={setTableSearchQuery}
            onRowClick={handleTableRowClick}
            onDeleteBorehole={handleDeleteBorehole}
          />
        </div>
      </div>

      {/* Borehole Details Drawer */}
      <BoreholeDrawer
        isOpen={isDrawerOpen}
        borehole={selectedBorehole}
        newBoreholeCoords={newBoreholeData}
        projectId={currentProject.id}
        onClose={handleCloseDrawer}
        onSave={handleSaveBorehole}
        onDelete={handleDeleteBorehole}
      />

      {/* Export CSV Modal */}
      <ExportCSVModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={currentProject}
        filteredBoreholes={filteredBoreholes}
        hasFilters={tableSearchQuery !== ''}
      />

      {/* Project Settings Modal */}
      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        project={currentProject}
        onSave={handleSaveProjectSettings}
      />
    </div>
  );
}

