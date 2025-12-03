/**
 * Borehole data table component
 */

import { useState, useRef, useEffect } from 'react';
import { SearchIcon, AdjustmentsIcon, DotsVerticalIcon, TrashIcon } from './icons';
import type { Borehole, BoreholeStatus } from '../data/types';
import { useProjects } from '../hooks/useProjects';

interface BoreholeTableProps {
  boreholes: Borehole[];
  selectedBorehole: Borehole | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRowClick: (borehole: Borehole) => void;
  onDeleteBorehole: (boreholeId: string) => void;
}

type ColumnKey = 'code' | 'name' | 'coords' | 'groundLevel' | 'totalDepth' | 'status' | 'notes';

const DEFAULT_COLUMNS: ColumnKey[] = ['code', 'name', 'coords', 'groundLevel', 'totalDepth', 'status', 'notes'];

export function BoreholeTable({
  boreholes,
  selectedBorehole,
  searchQuery,
  onSearchChange,
  onRowClick,
  onDeleteBorehole,
}: BoreholeTableProps) {
  const { updateBorehole } = useProjects();
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(DEFAULT_COLUMNS);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [menuBoreholeId, setMenuBoreholeId] = useState<string | null>(null);
  const selectedRowRef = useRef<HTMLTableRowElement>(null);

  // Scroll to selected row
  useEffect(() => {
    if (selectedBorehole && selectedRowRef.current) {
      selectedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedBorehole]);

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handleStatusChange = (borehole: Borehole, newStatus: BoreholeStatus) => {
    updateBorehole(borehole.id, { status: newStatus });
  };

  const formatCoords = (lat: number, lng: number): string => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const columnLabels: Record<ColumnKey, string> = {
    code: 'BH Code',
    name: 'Name',
    coords: 'Lat / Lng',
    groundLevel: 'Ground Level (m)',
    totalDepth: 'Total Depth (m)',
    status: 'Status',
    notes: 'Notes',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Table header */}
      <div className="shrink-0 p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search boreholes..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Columns visibility */}
          <div className="relative">
            <button
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
            >
              <AdjustmentsIcon className="w-4 h-4" />
              Columns
            </button>

            {isColumnMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsColumnMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
                  {DEFAULT_COLUMNS.map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(key)}
                        onChange={() => toggleColumn(key)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700">{columnLabels[key]}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {boreholes.length > 0 ? (
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="border-b border-slate-200">
                {visibleColumns.includes('code') && (
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 whitespace-nowrap">BH Code</th>
                )}
                {visibleColumns.includes('name') && (
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 whitespace-nowrap">Name</th>
                )}
                {visibleColumns.includes('coords') && (
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 whitespace-nowrap">Lat / Lng</th>
                )}
                {visibleColumns.includes('groundLevel') && (
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 whitespace-nowrap">Ground Level (m)</th>
                )}
                {visibleColumns.includes('totalDepth') && (
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 whitespace-nowrap">Total Depth (m)</th>
                )}
                {visibleColumns.includes('status') && (
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 whitespace-nowrap">Status</th>
                )}
                {visibleColumns.includes('notes') && (
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 whitespace-nowrap">Notes</th>
                )}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {boreholes.map((borehole) => (
                <tr
                  key={borehole.id}
                  ref={borehole.id === selectedBorehole?.id ? selectedRowRef : null}
                  onClick={() => onRowClick(borehole)}
                  className={`border-b border-slate-100 cursor-pointer transition-colors ${
                    borehole.id === selectedBorehole?.id 
                      ? 'bg-primary-50' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {visibleColumns.includes('code') && (
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{borehole.code}</td>
                  )}
                  {visibleColumns.includes('name') && (
                    <td className="px-4 py-3 text-sm text-slate-600">{borehole.name || '-'}</td>
                  )}
                  {visibleColumns.includes('coords') && (
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{formatCoords(borehole.latitude, borehole.longitude)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(formatCoords(borehole.latitude, borehole.longitude));
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                          title="Copy coordinates"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes('groundLevel') && (
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {borehole.groundLevel != null ? borehole.groundLevel : '-'}
                    </td>
                  )}
                  {visibleColumns.includes('totalDepth') && (
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {borehole.totalDepth != null ? borehole.totalDepth : '-'}
                    </td>
                  )}
                  {visibleColumns.includes('status') && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={borehole.status}
                        onChange={(e) => handleStatusChange(borehole, e.target.value as BoreholeStatus)}
                        className="text-xs font-medium rounded-full px-2 py-0.5 border-0 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                        style={{
                          backgroundColor: 
                            borehole.status === 'Completed' ? '#d1fae5' :
                            borehole.status === 'Drilling' ? '#fef3c7' :
                            borehole.status === 'Abandoned' ? '#fee2e2' : '#f1f5f9',
                          color:
                            borehole.status === 'Completed' ? '#047857' :
                            borehole.status === 'Drilling' ? '#b45309' :
                            borehole.status === 'Abandoned' ? '#dc2626' : '#475569',
                        }}
                      >
                        <option value="Planned">Planned</option>
                        <option value="Drilling">Drilling</option>
                        <option value="Completed">Completed</option>
                        <option value="Abandoned">Abandoned</option>
                      </select>
                    </td>
                  )}
                  {visibleColumns.includes('notes') && (
                    <td className="px-4 py-3 text-sm text-slate-500 max-w-[150px] truncate">
                      {borehole.notes || '-'}
                    </td>
                  )}
                  <td className="px-2 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuBoreholeId(menuBoreholeId === borehole.id ? null : borehole.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <DotsVerticalIcon className="w-4 h-4" />
                      </button>

                      {menuBoreholeId === borehole.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setMenuBoreholeId(null)} 
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuBoreholeId(null);
                                onRowClick(borehole);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              Open details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuBoreholeId(null);
                                if (confirm(`Delete ${borehole.code}? This cannot be undone.`)) {
                                  onDeleteBorehole(borehole.id);
                                }
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete borehole
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-12 h-12 mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">No boreholes found</h3>
            <p className="text-sm text-slate-500">
              {searchQuery ? 'Try a different search term' : 'Add boreholes using the map'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

