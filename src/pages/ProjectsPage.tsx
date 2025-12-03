/**
 * Projects list page - main landing page
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { AppBar } from '../components/AppBar';
import { NewProjectModal } from '../components/NewProjectModal';
import { StatusPill } from '../components/StatusPill';
import { SearchIcon, PlusIcon, ChevronDownIcon } from '../components/icons';
import { useProjects } from '../hooks/useProjects';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, createProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Get unique clients for filter
  const clients = useMemo(() => {
    const uniqueClients = new Set(projects.map(p => p.client).filter(Boolean));
    return Array.from(uniqueClients);
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.client?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Client filter
      const matchesClient = clientFilter === 'all' || project.client === clientFilter;

      return matchesSearch && matchesClient;
    });
  }, [projects, searchQuery, clientFilter]);

  const handleCreateProject = (data: {
    name: string;
    client: string;
    locationDescription: string;
  }) => {
    const project = createProject(data);
    if (project) {
      setIsNewProjectModalOpen(false);
      navigate(`/project/${project.id}`);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <AppBar />

      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              New project
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Owner filter */}
                <div className="relative">
                  <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All owners</option>
                    <option value="me">My projects</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Client filter */}
                <div className="relative">
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All clients</option>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table */}
            {filteredProjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Project name</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Client</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Boreholes</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Last updated</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900">{project.name}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{project.client || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{project.boreholes.length}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={project.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center">
                {projects.length === 0 ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No projects yet</h3>
                    <p className="text-slate-500 mb-4">Create your first project to get started</p>
                    <button
                      onClick={() => setIsNewProjectModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      New project
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No projects found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}

