/**
 * LocalStorage data persistence layer for BoreMap
 * Provides CRUD operations for projects and boreholes
 */

import { v4 as uuidv4 } from 'uuid';
import type { Project, Borehole, BoreholeStatus } from './types';

const STORAGE_KEY = 'boremap_projects';

/**
 * Get all projects from localStorage
 */
export function getProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Project[];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
}

/**
 * Get a single project by ID
 */
export function getProject(projectId: string): Project | null {
  const projects = getProjects();
  return projects.find(p => p.id === projectId) || null;
}

/**
 * Save all projects to localStorage
 */
function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
    throw new Error('Failed to save data');
  }
}

/**
 * Create a new project
 */
export function createProject(data: {
  name: string;
  client?: string;
  locationDescription?: string;
  coordinateSystem?: 'WGS84';
}): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: uuidv4(),
    name: data.name,
    client: data.client || '',
    locationDescription: data.locationDescription || '',
    coordinateSystem: data.coordinateSystem || 'WGS84',
    boreholes: [],
    createdAt: now,
    updatedAt: now,
    status: 'Active',
  };

  const projects = getProjects();
  projects.unshift(project); // Add to beginning
  saveProjects(projects);

  return project;
}

/**
 * Update an existing project
 */
export function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt' | 'boreholes'>>
): Project | null {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);

  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveProjects(projects);
  return projects[index];
}

/**
 * Delete a project
 */
export function deleteProject(projectId: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== projectId);

  if (filtered.length === projects.length) return false;

  saveProjects(filtered);
  return true;
}

/**
 * Generate the next borehole code for a project
 */
export function generateBoreholeCode(project: Project): string {
  const existingCodes = project.boreholes.map(b => b.code);
  let num = 1;

  while (existingCodes.includes(`BH${String(num).padStart(2, '0')}`)) {
    num++;
  }

  return `BH${String(num).padStart(2, '0')}`;
}

/**
 * Add a new borehole to a project
 */
export function addBorehole(
  projectId: string,
  data: {
    code?: string;
    name?: string;
    latitude: number;
    longitude: number;
    groundLevel?: number | null;
    totalDepth?: number | null;
    status?: BoreholeStatus;
    notes?: string;
  }
): Borehole | null {
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);

  if (!project) return null;

  const now = new Date().toISOString();
  const borehole: Borehole = {
    id: uuidv4(),
    code: data.code || generateBoreholeCode(project),
    name: data.name,
    latitude: data.latitude,
    longitude: data.longitude,
    groundLevel: data.groundLevel ?? null,
    totalDepth: data.totalDepth ?? null,
    status: data.status || 'Planned',
    notes: data.notes || '',
    createdAt: now,
    updatedAt: now,
  };

  project.boreholes.push(borehole);
  project.updatedAt = now;
  saveProjects(projects);

  return borehole;
}

/**
 * Update an existing borehole
 */
export function updateBorehole(
  projectId: string,
  boreholeId: string,
  updates: Partial<Omit<Borehole, 'id' | 'createdAt'>>
): Borehole | null {
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);

  if (!project) return null;

  const boreholeIndex = project.boreholes.findIndex(b => b.id === boreholeId);
  if (boreholeIndex === -1) return null;

  project.boreholes[boreholeIndex] = {
    ...project.boreholes[boreholeIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  project.updatedAt = new Date().toISOString();
  saveProjects(projects);

  return project.boreholes[boreholeIndex];
}

/**
 * Delete a borehole from a project
 */
export function deleteBorehole(projectId: string, boreholeId: string): boolean {
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);

  if (!project) return false;

  const initialLength = project.boreholes.length;
  project.boreholes = project.boreholes.filter(b => b.id !== boreholeId);

  if (project.boreholes.length === initialLength) return false;

  project.updatedAt = new Date().toISOString();
  saveProjects(projects);

  return true;
}

/**
 * Initialize with sample data if no projects exist
 */
export function initializeSampleData(): void {
  const projects = getProjects();
  if (projects.length > 0) return;

  // Create sample projects matching the Figma design
  const sampleProjects: Project[] = [
    {
      id: uuidv4(),
      name: 'Auckland Site Investigation',
      client: 'Acme Corp',
      locationDescription: 'Central Auckland, New Zealand',
      coordinateSystem: 'WGS84',
      status: 'Active',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      boreholes: [
        {
          id: uuidv4(),
          code: 'BH01',
          name: 'North Corner',
          latitude: 40.712800,
          longitude: -74.006000,
          groundLevel: 12.5,
          totalDepth: 15,
          status: 'Completed',
          notes: 'Sandy soil with groundwater at 8m',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'BH02',
          name: 'South Boundary',
          latitude: 40.714800,
          longitude: -74.008000,
          groundLevel: 11.8,
          totalDepth: 20,
          status: 'Completed',
          notes: 'Clay layer encountered at 12m',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'BH03',
          name: '',
          latitude: 40.710800,
          longitude: -74.004000,
          groundLevel: 13.2,
          totalDepth: 18.5,
          status: 'Drilling',
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'BH04',
          name: 'East Access',
          latitude: 40.713800,
          longitude: -74.002000,
          groundLevel: 12,
          totalDepth: 16,
          status: 'Planned',
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'BH05',
          name: '',
          latitude: 40.711800,
          longitude: -74.007000,
          groundLevel: 11.5,
          totalDepth: 14,
          status: 'Planned',
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'BH06',
          name: 'Central Plot',
          latitude: 40.715800,
          longitude: -74.005000,
          groundLevel: 12.8,
          totalDepth: 19,
          status: 'Completed',
          notes: 'Rock encountered at 17m depth',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'BH07',
          name: 'West Side',
          latitude: 40.713000,
          longitude: -74.009000,
          groundLevel: 10.5,
          totalDepth: 12,
          status: 'Completed',
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'BH08',
          name: '',
          latitude: 40.716000,
          longitude: -74.003500,
          groundLevel: 14.2,
          totalDepth: 22,
          status: 'Drilling',
          notes: 'Deep investigation required',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Wellington Geotechnical Survey',
      client: 'Globex Inc',
      locationDescription: 'Wellington CBD',
      coordinateSystem: 'WGS84',
      status: 'Active',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      boreholes: Array.from({ length: 8 }, (_, i) => ({
        id: uuidv4(),
        code: `BH${String(i + 1).padStart(2, '0')}`,
        name: '',
        latitude: -41.2865 + (Math.random() - 0.5) * 0.01,
        longitude: 174.7762 + (Math.random() - 0.5) * 0.01,
        groundLevel: 8 + Math.random() * 5,
        totalDepth: 10 + Math.random() * 15,
        status: (['Completed', 'Drilling', 'Planned'] as BoreholeStatus[])[Math.floor(Math.random() * 3)],
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    },
    {
      id: uuidv4(),
      name: 'Christchurch Foundation Study',
      client: 'BuildCo Ltd',
      locationDescription: 'Christchurch, New Zealand',
      coordinateSystem: 'WGS84',
      status: 'Active',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      boreholes: Array.from({ length: 15 }, (_, i) => ({
        id: uuidv4(),
        code: `BH${String(i + 1).padStart(2, '0')}`,
        name: '',
        latitude: -43.5320 + (Math.random() - 0.5) * 0.01,
        longitude: 172.6306 + (Math.random() - 0.5) * 0.01,
        groundLevel: 5 + Math.random() * 8,
        totalDepth: 8 + Math.random() * 20,
        status: (['Completed', 'Drilling', 'Planned'] as BoreholeStatus[])[Math.floor(Math.random() * 3)],
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    },
    {
      id: uuidv4(),
      name: 'Hamilton Development Phase 1',
      client: 'Acme Corp',
      locationDescription: 'Hamilton, New Zealand',
      coordinateSystem: 'WGS84',
      status: 'Archived',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      boreholes: Array.from({ length: 6 }, (_, i) => ({
        id: uuidv4(),
        code: `BH${String(i + 1).padStart(2, '0')}`,
        name: '',
        latitude: -37.7870 + (Math.random() - 0.5) * 0.01,
        longitude: 175.2793 + (Math.random() - 0.5) * 0.01,
        groundLevel: 40 + Math.random() * 10,
        totalDepth: 15 + Math.random() * 10,
        status: 'Completed' as BoreholeStatus,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    },
    {
      id: uuidv4(),
      name: 'Tauranga Port Expansion',
      client: 'Port Authority NZ',
      locationDescription: 'Tauranga Port, New Zealand',
      coordinateSystem: 'WGS84',
      status: 'Active',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      boreholes: Array.from({ length: 22 }, (_, i) => ({
        id: uuidv4(),
        code: `BH${String(i + 1).padStart(2, '0')}`,
        name: '',
        latitude: -37.6878 + (Math.random() - 0.5) * 0.015,
        longitude: 176.1651 + (Math.random() - 0.5) * 0.015,
        groundLevel: 2 + Math.random() * 5,
        totalDepth: 20 + Math.random() * 30,
        status: (['Completed', 'Drilling', 'Planned'] as BoreholeStatus[])[Math.floor(Math.random() * 3)],
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    },
  ];

  saveProjects(sampleProjects);
}

