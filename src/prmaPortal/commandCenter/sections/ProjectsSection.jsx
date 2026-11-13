import React, { useState } from 'react';
import {
  FolderGit2,
  ListTodo,
  FileCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  LayoutGrid,
  Table as TableIcon,
  Trash2,
  Edit,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function ProjectsSection({
  subTab = 'projects',
  projects = [],
  loading = false,
  onRefresh,
  onAddProjectModal,
  onEditProjectModal,
  onDeleteProject
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = projects.filter(prj => {
    if (statusFilter !== 'all' && prj.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const title = (prj.title || '').toLowerCase();
      const client = (prj.clientName || '').toLowerCase();
      const pm = (prj.projectManager || '').toLowerCase();
      return title.includes(q) || client.includes(q) || pm.includes(q);
    }
    return true;
  });

  const kanbanColumns = [
    { key: 'PLANNING', label: 'Planning', color: 'border-slate-300' },
    { key: 'ACTIVE', label: 'Active Development', color: 'border-blue-500' },
    { key: 'ON HOLD', label: 'On Hold', color: 'border-amber-500' },
    { key: 'COMPLETED', label: 'Completed', color: 'border-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#780D29]" />
            Enterprise Project Management
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {projects.length} Total Projects &bull; Milestones &amp; Team Allocations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Data Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onAddProjectModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
          >
            <Plus className="w-4 h-4 text-[#D4A63F]" />
            <span>Create Project</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh Projects"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, client, manager..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none"
        >
          <option value="all">All Project Statuses</option>
          <option value="PLANNING">Planning</option>
          <option value="ACTIVE">Active Development</option>
          <option value="ON HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kanbanColumns.map(col => {
              const colProjects = filteredProjects.filter(p => p.status === col.key);

              return (
                <div
                  key={col.key}
                  className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 space-y-3 min-h-[400px]"
                >
                  <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      {col.label}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                      {colProjects.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colProjects.map((prj, pIdx) => (
                      <div
                        key={prj.projectId || pIdx}
                        className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-[#780D29]/40 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                            {prj.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {prj.projectId}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 font-medium">
                          Client: <span className="font-bold text-slate-700">{prj.clientName || 'Internal'}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                            <span>Progress</span>
                            <span>{prj.progress || 0}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#780D29]"
                              style={{ width: `${prj.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
                          <span>PM: {prj.projectManager || 'Lead'}</span>
                          {prj.budget > 0 && (
                            <span className="font-bold font-mono text-slate-700">
                              ₹{prj.budget.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {colProjects.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">
                        No projects in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FolderGit2}
            title="No projects created yet"
            description="Establish internal technical tracks and client development projects with deliverables and milestone tracking."
            actionText="Create Project"
            onAction={onAddProjectModal}
          />
        )
      ) : (
        /* VIEW 2: TABLE */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto prma-custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Project &amp; ID</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Project Lead</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredProjects.map((prj, idx) => (
                    <tr key={prj.projectId || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{prj.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{prj.projectId}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {prj.clientName || 'Internal'}
                      </td>
                      <td className="py-3 px-4">{prj.projectManager || 'Unassigned'}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {prj.startDate || '--'} to {prj.endDate || 'TBD'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{prj.progress || 0}%</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        ₹{(prj.budget || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`prma-badge ${prj.status === 'ACTIVE' ? 'prma-badge-approved' : 'prma-badge-pending'}`}>
                          {prj.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={FolderGit2}
              title="No projects found"
              description="Create a project to manage software milestones and deliverables."
              actionText="Create Project"
              onAction={onAddProjectModal}
            />
          )}
        </div>
      )}
    </div>
  );
}
