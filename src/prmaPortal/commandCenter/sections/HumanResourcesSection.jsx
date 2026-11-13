import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Building2,
  CalendarCheck,
  Shield,
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  DollarSign,
  UserCheck
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function HumanResourcesSection({
  subTab = 'employees',
  employees = [],
  departments = [],
  attendance = [],
  loading = false,
  onRefresh,
  onAddEmployeeModal,
  onEditEmployeeModal,
  onDeleteEmployee,
  onAddDepartmentModal,
  onMarkAttendanceModal
}) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredEmployees = employees.filter(emp => {
    if (deptFilter !== 'all' && emp.department !== deptFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (emp.fullName || '').toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const desig = (emp.designation || '').toLowerCase();
      const empId = (emp.employeeId || '').toLowerCase();
      return name.includes(q) || email.includes(q) || desig.includes(q) || empId.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#780D29]" />
            {subTab === 'employees' && 'Human Resources & Employee Directory'}
            {subTab === 'departments' && 'Department Management'}
            {subTab === 'attendance' && 'Daily Attendance & Timesheet Records'}
            {subTab === 'roles-permissions' && 'Role-Based Access Control (RBAC)'}
            {subTab === 'hr-documents' && 'Company HR & Employment Documents'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {subTab === 'employees' && `${employees.length} Authorized Corporate Team Members`}
            {subTab === 'departments' && `${departments.length} Operational Departments`}
            {subTab === 'attendance' && `${attendance.length} Attendance Logs Recorded`}
            {subTab === 'roles-permissions' && 'Enterprise System Permissions Matrix'}
            {subTab === 'hr-documents' && 'Official Employment Agreements & Templates'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'employees' && (
            <button
              type="button"
              onClick={onAddEmployeeModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" />
              <span>Add Employee</span>
            </button>
          )}

          {subTab === 'departments' && (
            <button
              type="button"
              onClick={onAddDepartmentModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" />
              <span>Add Department</span>
            </button>
          )}

          {subTab === 'attendance' && (
            <button
              type="button"
              onClick={onMarkAttendanceModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Mark Attendance</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh HR Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: EMPLOYEES DIRECTORY */}
      {subTab === 'employees' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees by name, email, designation, ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredEmployees.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Department &amp; Role</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Employment</th>
                      <th className="py-3 px-4">Joining Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredEmployees.map((emp, idx) => (
                      <tr key={emp.employeeId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{emp.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{emp.employeeId}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{emp.email}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800">{emp.department || 'Engineering'}</span>
                          <div className="text-[11px] text-amber-700 font-semibold">{emp.role || 'MEMBER'}</div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {emp.designation || 'Software Engineer'}
                        </td>

                        <td className="py-3 px-4">
                          <span className="prma-badge prma-badge-submitted text-[10px]">
                            {emp.employmentType || 'Full-Time'}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-600">
                          {emp.joiningDate || '2026-01-01'}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`prma-badge ${emp.status === 'Active' ? 'prma-badge-approved' : 'prma-badge-rejected'}`}>
                            {emp.status || 'Active'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onEditEmployeeModal(emp)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit Employee"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteEmployee(emp.employeeId || emp._id)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Remove Employee"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No employees have been added yet"
                description="Create authorized employee records to manage corporate staff, assign administrative roles, and track project assignments."
                actionText="Add Employee"
                onAction={onAddEmployeeModal}
              />
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DEPARTMENTS */}
      {subTab === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept, idx) => (
              <div
                key={dept.departmentId || idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#780D29]/10 text-[#780D29] flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{dept.departmentId}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{dept.name}</h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Lead: <span className="font-bold text-slate-700">{dept.head || 'To be assigned'}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{dept.description || 'Corporate operations.'}</p>
                </div>
              </div>
            ))}
          </div>

          {departments.length === 0 && (
            <EmptyState
              icon={Building2}
              title="No departments configured"
              description="Establish operational divisions such as Engineering, Operations, Design, Marketing, and Quality Assurance."
              actionText="Add Department"
              onAction={onAddDepartmentModal}
            />
          )}
        </div>
      )}

      {/* SUB-TAB 3: ATTENDANCE */}
      {subTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {attendance.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Check-in / Check-out</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {attendance.map((att, idx) => (
                      <tr key={att.attendanceId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{att.date}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{att.employeeName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{att.employeeId}</div>
                        </td>
                        <td className="py-3 px-4">{att.department || 'Engineering'}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {att.checkInTime || '--:--'} &bull; {att.checkOutTime || '--:--'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`prma-badge ${att.status === 'Present' ? 'prma-badge-approved' : 'prma-badge-rejected'}`}>
                            {att.status || 'Present'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{att.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={CalendarCheck}
                title="No attendance entries recorded yet"
                description="Attendance records marked by HR or daily clock-in entries will be archived here."
                actionText="Mark Attendance"
                onAction={onMarkAttendanceModal}
              />
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ROLES & PERMISSIONS */}
      {subTab === 'roles-permissions' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Enterprise Role Permissions Matrix
          </h3>

          <div className="overflow-x-auto prma-custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Applications &amp; Review</th>
                  <th className="py-3 px-4">Employees &amp; HR</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Finances</th>
                  <th className="py-3 px-4">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#780D29]">SUPER ADMIN / FOUNDER</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">ADMIN</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-amber-600 font-bold">View Only</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">HR MANAGER</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Manage Interns</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-slate-400">View Only</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">MENTOR / EVALUATOR</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Review Deliverables</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Manage Tasks</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">FINANCE MANAGER</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                  <td className="py-3 px-4 text-slate-400">View Salaries</td>
                  <td className="py-3 px-4 text-slate-400">View Budgets</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Full Access</td>
                  <td className="py-3 px-4 text-slate-400">Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: HR DOCUMENTS */}
      {subTab === 'hr-documents' && (
        <EmptyState
          icon={FileText}
          title="No employment documents uploaded"
          description="Appointment letters, experience certificates, and non-disclosure agreements for staff can be generated in Document Studio."
        />
      )}
    </div>
  );
}
