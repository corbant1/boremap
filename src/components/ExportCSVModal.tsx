/**
 * Modal for exporting borehole data to CSV
 */

import { useState } from 'react';
import { Modal } from './Modal';
import type { Project, Borehole } from '../data/types';

interface ExportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  filteredBoreholes: Borehole[];
  hasFilters: boolean;
}

export function ExportCSVModal({
  isOpen,
  onClose,
  project,
  filteredBoreholes,
  hasFilters,
}: ExportCSVModalProps) {
  const [onlyFiltered, setOnlyFiltered] = useState(false);

  const boreholesToExport = onlyFiltered ? filteredBoreholes : project.boreholes;

  // Generate filename
  const sanitizedName = project.name.replace(/[^a-zA-Z0-9]/g, '_');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `${sanitizedName}_boreholes_${date}.csv`;

  const handleDownload = () => {
    const csv = generateCSV(boreholesToExport);
    downloadCSV(csv, filename);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export boreholes to CSV">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Download all borehole data for this project as a CSV file.
        </p>

        {/* Columns info */}
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-700 mb-1">Columns included:</p>
          <p className="text-sm text-slate-600">
            BH Code, Name, Latitude, Longitude, Ground Level, Total Depth, Status, Notes
          </p>
        </div>

        {/* Filter checkbox */}
        {hasFilters && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyFiltered}
              onChange={(e) => setOnlyFiltered(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">Only export currently filtered rows</span>
          </label>
        )}

        {/* Export summary */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm font-medium text-primary-800">
            {boreholesToExport.length} borehole{boreholesToExport.length !== 1 ? 's' : ''} will be exported
          </p>
          <p className="text-sm text-primary-700 mt-1">
            File name: <span className="font-mono">{filename}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={boreholesToExport.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download CSV
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Generate CSV string from boreholes
 */
function generateCSV(boreholes: Borehole[]): string {
  const headers = [
    'BH Code',
    'Name',
    'Latitude',
    'Longitude',
    'Ground Level',
    'Total Depth',
    'Status',
    'Notes',
  ];

  const rows = boreholes.map((bh) => [
    escapeCSV(bh.code),
    escapeCSV(bh.name || ''),
    bh.latitude.toString(),
    bh.longitude.toString(),
    bh.groundLevel?.toString() || '',
    bh.totalDepth?.toString() || '',
    bh.status,
    escapeCSV(bh.notes || ''),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Escape a string for CSV (handles commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Trigger CSV download
 */
function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

