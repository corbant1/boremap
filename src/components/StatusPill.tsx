/**
 * Status pill/badge component
 */

import type { BoreholeStatus, ProjectStatus } from '../data/types';

type StatusType = BoreholeStatus | ProjectStatus;

interface StatusPillProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusStyles: Record<StatusType, string> = {
  // Borehole statuses
  Planned: 'bg-slate-100 text-slate-700',
  Drilling: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Abandoned: 'bg-red-100 text-red-700',
  // Project statuses
  Active: 'bg-emerald-100 text-emerald-700',
  Archived: 'bg-slate-100 text-slate-700',
};

export function StatusPill({ status, size = 'sm' }: StatusPillProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

