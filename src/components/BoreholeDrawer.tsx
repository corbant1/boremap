/**
 * Sliding drawer for viewing/editing borehole details
 */

import { useState, useEffect } from 'react';
import { XIcon, CopyIcon } from './icons';
import { StatusPill } from './StatusPill';
import type { Borehole, BoreholeStatus } from '../data/types';
import { generateBoreholeCode, getProject } from '../data/storage';

interface BoreholeDrawerProps {
  isOpen: boolean;
  borehole: Borehole | null;
  newBoreholeCoords: { lat: number; lng: number } | null;
  projectId: string;
  onClose: () => void;
  onSave: (data: Partial<Borehole>) => void;
  onDelete: (boreholeId: string) => void;
}

export function BoreholeDrawer({
  isOpen,
  borehole,
  newBoreholeCoords,
  projectId,
  onClose,
  onSave,
}: BoreholeDrawerProps) {
  const isNew = !borehole && newBoreholeCoords !== null;
  
  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<BoreholeStatus>('Planned');
  const [groundLevel, setGroundLevel] = useState('');
  const [totalDepth, setTotalDepth] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Initialize form when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (borehole) {
        // Editing existing borehole
        setCode(borehole.code);
        setName(borehole.name || '');
        setStatus(borehole.status);
        setGroundLevel(borehole.groundLevel?.toString() || '');
        setTotalDepth(borehole.totalDepth?.toString() || '');
        setNotes(borehole.notes || '');
      } else if (newBoreholeCoords) {
        // Creating new borehole
        const project = getProject(projectId);
        const nextCode = project ? generateBoreholeCode(project) : 'BH01';
        setCode(nextCode);
        setName('');
        setStatus('Planned');
        setGroundLevel('');
        setTotalDepth('');
        setNotes('');
      }
    }
  }, [isOpen, borehole, newBoreholeCoords, projectId]);

  // Get coordinates
  const coords = borehole 
    ? { lat: borehole.latitude, lng: borehole.longitude }
    : newBoreholeCoords;

  const coordsString = coords 
    ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
    : '';

  const handleCopyCoords = async () => {
    await navigator.clipboard.writeText(coordsString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      code,
      name: name || undefined,
      status,
      groundLevel: groundLevel ? parseFloat(groundLevel) : null,
      totalDepth: totalDepth ? parseFloat(totalDepth) : null,
      notes: notes || undefined,
    });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-slate-900">{code || 'New Borehole'}</span>
            <StatusPill status={status} />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {/* BH Code */}
            <div>
              <label htmlFor="bh-code" className="block text-sm font-medium text-slate-700 mb-1">
                BH Code
              </label>
              <input
                id="bh-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 bg-slate-50"
              />
            </div>

            {/* Name / Description */}
            <div>
              <label htmlFor="bh-name" className="block text-sm font-medium text-slate-700 mb-1">
                Name / Description
              </label>
              <input
                id="bh-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="bh-status" className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                id="bh-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as BoreholeStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 bg-white"
              >
                <option value="Planned">Planned</option>
                <option value="Drilling">Drilling</option>
                <option value="Completed">Completed</option>
                <option value="Abandoned">Abandoned</option>
              </select>
            </div>

            {/* Coordinates */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Coordinates
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={coordsString}
                  readOnly
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="flex items-center gap-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                >
                  <CopyIcon className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Read-only (set via map)
              </p>
            </div>

            {/* Ground Level & Total Depth */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bh-ground-level" className="block text-sm font-medium text-slate-700 mb-1">
                  Ground Level (m)
                </label>
                <input
                  id="bh-ground-level"
                  type="number"
                  step="0.1"
                  value={groundLevel}
                  onChange={(e) => setGroundLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="bh-total-depth" className="block text-sm font-medium text-slate-700 mb-1">
                  Total Depth (m)
                </label>
                <input
                  id="bh-total-depth"
                  type="number"
                  step="0.1"
                  value={totalDepth}
                  onChange={(e) => setTotalDepth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="bh-notes" className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                id="bh-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isNew ? 'Create borehole' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

