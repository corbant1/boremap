/**
 * Top navigation bar component
 */

import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from './icons';

interface AppBarProps {
  showProjectsDropdown?: boolean;
}

export function AppBar({ showProjectsDropdown = true }: AppBarProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full border-2 border-primary-600">
            <div className="w-1 h-1 bg-primary-600 rounded-full mx-auto mt-0.5" />
          </div>
        </div>
        <span className="font-semibold text-slate-900">BoreMap</span>
      </Link>

      {/* Center: Projects button - navigates to projects list */}
      {showProjectsDropdown && (
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="font-medium">Projects</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      )}

      {/* Right: Empty spacer for balance */}
      <div className="w-20" />
    </header>
  );
}
