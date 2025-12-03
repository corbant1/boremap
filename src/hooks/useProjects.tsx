/**
 * React context and hooks for project state management
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Project, Borehole, BoreholeStatus } from '../data/types';
import * as storage from '../data/storage';

interface ProjectContextValue {
  projects: Project[];
  currentProject: Project | null;
  selectedBorehole: Borehole | null;
  isLoading: boolean;
  error: string | null;
  
  // Project operations
  loadProjects: () => void;
  loadProject: (projectId: string) => void;
  createProject: (data: { name: string; client?: string; locationDescription?: string }) => Project | null;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  
  // Borehole operations
  addBorehole: (data: { latitude: number; longitude: number; code?: string; status?: BoreholeStatus }) => Borehole | null;
  updateBorehole: (boreholeId: string, updates: Partial<Borehole>) => void;
  deleteBorehole: (boreholeId: string) => void;
  selectBorehole: (borehole: Borehole | null) => void;
  
  // UI state
  clearError: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedBorehole, setSelectedBorehole] = useState<Borehole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all projects
  const loadProjects = useCallback(() => {
    setIsLoading(true);
    try {
      const data = storage.getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load a specific project
  const loadProject = useCallback((projectId: string) => {
    setIsLoading(true);
    try {
      const project = storage.getProject(projectId);
      setCurrentProject(project);
      setSelectedBorehole(null);
      setError(null);
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new project
  const createProject = useCallback((data: { name: string; client?: string; locationDescription?: string }) => {
    try {
      const project = storage.createProject(data);
      loadProjects();
      return project;
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
      return null;
    }
  }, [loadProjects]);

  // Update a project
  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    try {
      storage.updateProject(projectId, updates);
      loadProjects();
      if (currentProject?.id === projectId) {
        loadProject(projectId);
      }
    } catch (err) {
      setError('Failed to update project');
      console.error(err);
    }
  }, [loadProjects, loadProject, currentProject]);

  // Delete a project
  const deleteProject = useCallback((projectId: string) => {
    try {
      storage.deleteProject(projectId);
      loadProjects();
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
    }
  }, [loadProjects, currentProject]);

  // Add a borehole to current project
  const addBorehole = useCallback((data: { latitude: number; longitude: number; code?: string; status?: BoreholeStatus }) => {
    if (!currentProject) return null;
    try {
      const borehole = storage.addBorehole(currentProject.id, data);
      loadProject(currentProject.id);
      return borehole;
    } catch (err) {
      setError('Failed to add borehole');
      console.error(err);
      return null;
    }
  }, [currentProject, loadProject]);

  // Update a borehole
  const updateBorehole = useCallback((boreholeId: string, updates: Partial<Borehole>) => {
    if (!currentProject) return;
    try {
      const updated = storage.updateBorehole(currentProject.id, boreholeId, updates);
      loadProject(currentProject.id);
      if (selectedBorehole?.id === boreholeId && updated) {
        setSelectedBorehole(updated);
      }
    } catch (err) {
      setError('Failed to update borehole');
      console.error(err);
    }
  }, [currentProject, loadProject, selectedBorehole]);

  // Delete a borehole
  const deleteBorehole = useCallback((boreholeId: string) => {
    if (!currentProject) return;
    try {
      storage.deleteBorehole(currentProject.id, boreholeId);
      loadProject(currentProject.id);
      if (selectedBorehole?.id === boreholeId) {
        setSelectedBorehole(null);
      }
    } catch (err) {
      setError('Failed to delete borehole');
      console.error(err);
    }
  }, [currentProject, loadProject, selectedBorehole]);

  // Select a borehole
  const selectBorehole = useCallback((borehole: Borehole | null) => {
    setSelectedBorehole(borehole);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const value: ProjectContextValue = {
    projects,
    currentProject,
    selectedBorehole,
    isLoading,
    error,
    loadProjects,
    loadProject,
    createProject,
    updateProject,
    deleteProject,
    addBorehole,
    updateBorehole,
    deleteBorehole,
    selectBorehole,
    clearError,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}

