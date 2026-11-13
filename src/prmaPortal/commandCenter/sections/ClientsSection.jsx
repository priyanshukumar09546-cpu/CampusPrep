import React, { useState } from 'react';
import {
  UserSquare2,
  MessageSquare,
  Sparkles,
  Scroll,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  Globe,
  Trash2,
  Edit,
  RefreshCw,
  Send,
  Calendar
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function ClientsSection({
  subTab = 'clients',
  clients = [],
  enquiries = [],
  loading = false,
  onRefresh,
  onAddClientModal,
  onDeleteClient,
  onUpdateEnquiryStatus,
  onDeleteEnquiry
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredClients = clients.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const comp = (c.companyName || '').toLowerCase();
      const pers = (c.contactPerson || '').toLowerCase();
      const em = (c.email || '').toLowerCase();
      return comp.includes(q) || pers.includes(q) || em.includes(q);
    }
    return true;
  });

  const filteredEnquiries = enquiries.filter(enq => {
    if (statusFilter !== 'all' && enq.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (enq.name || '').toLowerCase();
      const em = (enq.email || '').toLowerCase();
      const srv = (enq.serviceType || '').toLowerCase();
      return name.includes(q) || em.includes(q) || srv.includes(q);
    }
    return true;
  });

  const prmaOfficialServices = [
    {
      id: 'web-dev',
      title: 'Full-Stack Web Application Engineering',
      desc: 'High-performance React, Next.js, Node.js and MongoDB systems engineered for enterprise scalability.',
      tier: 'Enterprise Solution'
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning Solutions',
      desc: 'Computer vision, natural language processing models, and AI agent architectures tailored to client business needs.',
      tier: 'Cutting-Edge AI'
    },
    {
      id: 'cloud-devops',
      title: 'Cloud Infrastructure & DevOps Automation',
      desc: 'AWS, Google Cloud, Docker containerization, Kubernetes clusters, and continuous CI/CD delivery pipelines.',
      tier: 'Infrastructure'
    },
    {
      id: 'mobile-app',
      title: 'Cross-Platform Mobile Application Development',
      desc: 'iOS and Android mobile experiences engineered with React Native and modern cloud backend integrations.',
      tier: 'Mobile Engineering'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <UserSquare2 className="w-5 h-5 text-[#780D29]" />
            {subTab === 'clients' && 'Corporate Client Directory'}
            {subTab === 'client-enquiries' && 'Inbound Business Enquiries & Leads'}
            {subTab === 'services' && 'Technology Services Catalogue'}
            {subTab === 'proposals' && 'Proposals & Corporate Agreements'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {subTab === 'clients' && `${clients.length} Registered Enterprise Clients`}
            {subTab === 'client-enquiries' && `${enquiries.length} Inbound Requests from Website Contact Form`}
            {subTab === 'services' && 'Official Technology & Consulting Tracks'}
            {subTab === 'proposals' && 'Active Contractual Agreements'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'clients' && (
            <button
              type="button"
              onClick={onAddClientModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" />
              <span>Add Client</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh Client Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CLIENT DIRECTORY */}
      {subTab === 'clients' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients by company name, contact person, email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredClients.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Company Name &amp; ID</th>
                      <th className="py-3 px-4">Contact Person</th>
                      <th className="py-3 px-4">Email &amp; Phone</th>
                      <th className="py-3 px-4">Industry</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredClients.map((cli, idx) => (
                      <tr key={cli.clientId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{cli.companyName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{cli.clientId}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {cli.contactPerson || 'Principal Lead'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-slate-700">{cli.email}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{cli.phone || '—'}</div>
                        </td>
                        <td className="py-3 px-4">{cli.industry || 'Technology'}</td>
                        <td className="py-3 px-4">
                          <span className={`prma-badge ${cli.status === 'Active' ? 'prma-badge-approved' : 'prma-badge-pending'}`}>
                            {cli.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteClient(cli.clientId || cli._id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Remove Client"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={UserSquare2}
                title="No client records found"
                description="Keep track of client accounts, contract associations, and technology deliverables."
                actionText="Add Client"
                onAction={onAddClientModal}
              />
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLIENT ENQUIRIES */}
      {subTab === 'client-enquiries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredEnquiries.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Enquiry ID &amp; Sender</th>
                      <th className="py-3 px-4">Service Requested</th>
                      <th className="py-3 px-4">Message</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredEnquiries.map((enq, idx) => (
                      <tr key={enq.enquiryId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{enq.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{enq.enquiryId}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{enq.email}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#780D29]">
                          {enq.serviceType || 'General Solution'}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-slate-600 line-clamp-2">{enq.message}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`prma-badge ${enq.status === 'New' ? 'prma-badge-new' : 'prma-badge-approved'}`}>
                            {enq.status || 'New'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={enq.status || 'New'}
                            onChange={(e) => onUpdateEnquiryStatus(enq.enquiryId || enq._id, e.target.value)}
                            className="text-[11px] font-bold px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="No business enquiries received yet"
                description="When prospects and potential enterprise partners fill out the Contact or Services forms on the public website, their enquiries will synchronize here automatically."
              />
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SERVICES */}
      {subTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prmaOfficialServices.map(srv => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#780D29]/40 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#780D29]/10 text-[#780D29]">
                  {srv.tier}
                </span>
                <span className="text-xs font-bold text-emerald-600">Active Service</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">{srv.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{srv.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 4: PROPOSALS */}
      {subTab === 'proposals' && (
        <EmptyState
          icon={Scroll}
          title="No active contract proposals"
          description="Official statements of work (SOWs) and client proposals can be generated and managed here."
        />
      )}
    </div>
  );
}
