/**
 * Modal for editing project settings
 */

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Project } from '../data/types';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave: (data: { name: string; client: string; locationDescription: string }) => void;
}

export function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
  onSave,
}: ProjectSettingsModalProps) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [locationDescription, setLocationDescription] = useState('');

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(project.name);
      setClient(project.client || '');
      setLocationDescription(project.locationDescription || '');
    }
  }, [isOpen, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      client: client.trim(),
      locationDescription: locationDescription.trim(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project settings">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project name */}
        <div>
          <label htmlFor="settings-name" className="block text-sm font-medium text-slate-700 mb-1">
            Project name <span className="text-red-500">*</span>
          </label>
          <input
            id="settings-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
            required
          />
        </div>

        {/* Client */}
        <div>
          <label htmlFor="settings-client" className="block text-sm font-medium text-slate-700 mb-1">
            Client
          </label>
          <input
            id="settings-client"
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
          />
        </div>

        {/* Location description */}
        <div>
          <label htmlFor="settings-location" className="block text-sm font-medium text-slate-700 mb-1">
            Location description
          </label>
          <input
            id="settings-location"
            type="text"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
          />
        </div>

        {/* Coordinate system (read-only) */}
        <div>
          <label htmlFor="settings-coords" className="block text-sm font-medium text-slate-700 mb-1">
            Coordinate system
          </label>
          <input
            id="settings-coords"
            type="text"
            value={`${project.coordinateSystem} (Lat/Lng)`}
            disabled
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

