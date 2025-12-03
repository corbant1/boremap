/**
 * Core domain types for BoreMap application
 */

export type CoordinateSystem = 'WGS84';

export type BoreholeStatus = 'Planned' | 'Drilling' | 'Completed' | 'Abandoned';

export type ProjectStatus = 'Active' | 'Archived';

/**
 * Represents a single borehole location with all its attributes
 */
export interface Borehole {
  id: string;                    // Internal UUID
  code: string;                  // Display code like "BH01"
  name?: string;                 // Optional descriptive name
  latitude: number;              // WGS84 latitude
  longitude: number;             // WGS84 longitude
  groundLevel?: number | null;   // Ground level in meters
  totalDepth?: number | null;    // Total depth in meters
  status: BoreholeStatus;
  notes?: string;
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
}

/**
 * Represents a project containing multiple boreholes
 */
export interface Project {
  id: string;
  name: string;
  client?: string;
  locationDescription?: string;
  coordinateSystem: CoordinateSystem;
  boreholes: Borehole[];
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
}

/**
 * Form data for creating/editing a project
 */
export interface ProjectFormData {
  name: string;
  client: string;
  locationDescription: string;
  coordinateSystem: CoordinateSystem;
}

/**
 * Form data for creating/editing a borehole
 */
export interface BoreholeFormData {
  code: string;
  name: string;
  status: BoreholeStatus;
  latitude: number;
  longitude: number;
  groundLevel: string;
  totalDepth: string;
  notes: string;
}

