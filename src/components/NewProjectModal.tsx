/**
 * Modal for creating a new project
 */

import { useState } from 'react';
import { Modal } from './Modal';
import type { CoordinateSystem } from '../data/types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    client: string;
    locationDescription: string;
    coordinateSystem: CoordinateSystem;
  }) => void;
}

export function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [coordinateSystem] = useState<CoordinateSystem>('WGS84');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      client: client.trim(),
      locationDescription: locationDescription.trim(),
      coordinateSystem,
    });

    // Reset form
    setName('');
    setClient('');
    setLocationDescription('');
  };

  const handleClose = () => {
    setName('');
    setClient('');
    setLocationDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project name */}
        <div>
          <label htmlFor="project-name" className="block text-sm font-medium text-slate-700 mb-1">
            Project name <span className="text-red-500">*</span>
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Auckland Site Investigation"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
            required
            autoFocus
          />
        </div>

        {/* Client */}
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-slate-700 mb-1">
            Client
          </label>
          <input
            id="client"
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Location description */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
            Location description
          </label>
          <input
            id="location"
            type="text"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            placeholder="e.g. Central Auckland, New Zealand"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Coordinate system */}
        <div>
          <label htmlFor="coordinate-system" className="block text-sm font-medium text-slate-700 mb-1">
            Coordinate system
          </label>
          <select
            id="coordinate-system"
            value={coordinateSystem}
            disabled
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
          >
            <option value="WGS84">WGS84 (Lat/Lng)</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create project
          </button>
        </div>
      </form>
    </Modal>
  );
}

