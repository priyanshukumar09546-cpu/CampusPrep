import React, { useState } from 'react';
import {
  DollarSign,
  PieChart,
  Receipt,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit,
  RefreshCw,
  Download
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function FinanceSection({
  subTab = 'financial-dashboard',
  transactions = [],
  invoices = [],
  financeSummary = { totalIncome: 0, totalExpenses: 0, netBalance: 0 },
  loading = false,
  onRefresh,
  onAddTransactionModal,
  onAddInvoiceModal,
  onDeleteTransaction
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      const ref = (t.referenceNumber || '').toLowerCase();
      return desc.includes(q) || cat.includes(q) || ref.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            {subTab === 'financial-dashboard' && 'Financial Health & Transaction Overview'}
            {subTab === 'transactions' && 'Corporate General Ledger & Transactions'}
            {subTab === 'invoices' && 'Invoices & Client Billing Records'}
            {subTab === 'financial-reports' && 'Monthly Financial Statements & Audits'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational Record-Management Ledger &bull; Real Database Transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddTransactionModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
          >
            <Plus className="w-4 h-4 text-[#D4A63F]" />
            <span>Record Transaction</span>
          </button>

          {subTab === 'invoices' && (
            <button
              type="button"
              onClick={onAddInvoiceModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200"
            >
              <Receipt className="w-4 h-4 text-[#780D29]" />
              <span>New Invoice</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh Finance"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3 Executive Finance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Recorded Income</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            ₹{(financeSummary.totalIncome || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">From software services &amp; contracts</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Recorded Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-mono">
            ₹{(financeSummary.totalExpenses || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Server costs, merchandise, team stipends</p>
        </div>

        {/* Net Operational Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Net Operating Balance</span>
            <div className="w-8 h-8 rounded-lg bg-[#D4A63F]/15 text-[#854D0E] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ₹{(financeSummary.netBalance || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Income minus recorded expenses</p>
        </div>
      </div>

      {/* SUB-TAB 1 & 2: TRANSACTIONS TABLE */}
      {(subTab === 'financial-dashboard' || subTab === 'transactions') && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions by category, reference, description..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="Income">Income Only</option>
              <option value="Expense">Expense Only</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Party / Client</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredTransactions.map((tx, idx) => (
                      <tr key={tx.transactionId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{tx.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`prma-badge ${
                              tx.type === 'Income' ? 'prma-badge-approved' : 'prma-badge-rejected'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{tx.category}</td>
                        <td className="py-3 px-4 text-slate-600">{tx.clientOrVendor || '—'}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{tx.paymentMethod}</td>
                        <td className="py-3 px-4 font-mono font-bold text-sm">
                          <span className={tx.type === 'Income' ? 'text-emerald-700' : 'text-red-600'}>
                            {tx.type === 'Income' ? '+' : '-'} ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteTransaction(tx.transactionId || tx._id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Transaction"
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
                icon={DollarSign}
                title="No financial transactions recorded yet"
                description="Keep track of client project income, server costs, welcome kit production, and team disbursements."
                actionText="Record Transaction"
                onAction={onAddTransactionModal}
              />
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INVOICES */}
      {subTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {invoices.length > 0 ? (
            <div className="overflow-x-auto prma-custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {invoices.map((inv, idx) => (
                    <tr key={inv.invoiceId || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#780D29]">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{inv.clientName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{inv.issueDate}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{inv.dueDate}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{Number(inv.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`prma-badge ${inv.status === 'Paid' ? 'prma-badge-approved' : 'prma-badge-pending'}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No invoices generated yet"
              description="Create official company invoices with line items, tax calculations, and payment tracking for corporate clients."
              actionText="New Invoice"
              onAction={onAddInvoiceModal}
            />
          )}
        </div>
      )}
    </div>
  );
}
