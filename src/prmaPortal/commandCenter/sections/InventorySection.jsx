import React, { useState } from 'react';
import {
  Package,
  Boxes,
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Edit,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function InventorySection({
  subTab = 'welcome-kits',
  inventory = [],
  dispatches = [],
  loading = false,
  onRefresh,
  onAddInventoryModal,
  onDispatchModal,
  onUpdateDispatchStatus,
  onDeleteInventoryItem
}) {
  const [search, setSearch] = useState('');

  const filteredInventory = inventory.filter(it => {
    if (search) {
      const q = search.toLowerCase();
      const n = (it.name || '').toLowerCase();
      const s = (it.sku || '').toLowerCase();
      const c = (it.category || '').toLowerCase();
      return n.includes(q) || s.includes(q) || c.includes(q);
    }
    return true;
  });

  const filteredDispatches = dispatches.filter(dsp => {
    if (search) {
      const q = search.toLowerCase();
      const rec = (dsp.recipientName || '').toLowerCase();
      const trk = (dsp.trackingNumber || '').toLowerCase();
      return rec.includes(q) || trk.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-[#780D29]" />
            {subTab === 'welcome-kits' && 'Physical Welcome Kits & Hamper Allocation'}
            {subTab === 'merchandise' && 'Company Merchandise & Goodies Stock'}
            {subTab === 'dispatch-records' && 'Courier Dispatches & Shipment Tracking'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {subTab === 'welcome-kits' && 'Rigid Magnetic Hamper Boxes for Selected Interns'}
            {subTab === 'merchandise' && `${inventory.length} Verified Merchandise SKUs`}
            {subTab === 'dispatch-records' && `${dispatches.length} Shipments Processed`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'merchandise' && (
            <button
              type="button"
              onClick={onAddInventoryModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" />
              <span>Add Product</span>
            </button>
          )}

          {subTab === 'dispatch-records' && (
            <button
              type="button"
              onClick={onDispatchModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Truck className="w-4 h-4 text-[#D4A63F]" />
              <span>Dispatch Parcel</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: WELCOME KITS */}
      {subTab === 'welcome-kits' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Official PRMA Tech Internship Welcome Kit</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Custom-designed physical hamper box for top-performing candidates. Contains Bio-Washed T-Shirt, Insulated Bottle, Executive Journal, Smart QR ID Card, and Laser Rollerball Pen.
              </p>
            </div>
            <span className="prma-badge prma-badge-gold">Physical Kit</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onDispatchModal}
              className="px-4 py-2 bg-[#780D29] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#8E1032] transition-colors"
            >
              Assign &amp; Dispatch Hamper Box →
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MERCHANDISE */}
      {subTab === 'merchandise' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredInventory.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Item &amp; SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Available Stock</th>
                      <th className="py-3 px-4">Min. Alert</th>
                      <th className="py-3 px-4">Unit Cost</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredInventory.map((it, idx) => (
                      <tr key={it.itemId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{it.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{it.sku}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{it.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{it.stockQuantity}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{it.minAlertStock}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{it.unitCost}</td>
                        <td className="py-3 px-4">
                          <span className={`prma-badge ${it.status === 'In Stock' ? 'prma-badge-approved' : 'prma-badge-rejected'}`}>
                            {it.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteInventoryItem(it.itemId || it._id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Item"
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
                icon={Boxes}
                title="No merchandise items recorded in inventory"
                description="Catalogue physical apparel, water bottles, and stationery products with real stock levels."
                actionText="Add Product"
                onAction={onAddInventoryModal}
              />
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DISPATCH RECORDS */}
      {subTab === 'dispatch-records' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredDispatches.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Dispatch ID &amp; Recipient</th>
                      <th className="py-3 px-4">Courier &amp; Tracking</th>
                      <th className="py-3 px-4">Dispatch Date</th>
                      <th className="py-3 px-4">Delivery Address</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredDispatches.map((dsp, idx) => (
                      <tr key={dsp.dispatchId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{dsp.recipientName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{dsp.dispatchId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{dsp.courierName}</div>
                          <div className="text-[11px] font-mono text-emerald-700 font-bold">{dsp.trackingNumber || 'Awaiting Tracking'}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{dsp.dispatchDate}</td>
                        <td className="py-3 px-4 max-w-xs text-slate-600 truncate">{dsp.recipientAddress}</td>
                        <td className="py-3 px-4">
                          <span className={`prma-badge ${dsp.deliveryStatus === 'Delivered' ? 'prma-badge-approved' : 'prma-badge-pending'}`}>
                            {dsp.deliveryStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={dsp.deliveryStatus || 'Dispatched'}
                            onChange={(e) => onUpdateDispatchStatus(dsp.dispatchId || dsp._id, e.target.value)}
                            className="text-[11px] font-bold px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                          >
                            <option value="Dispatched">Dispatched</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={Truck}
                title="No courier shipments dispatched yet"
                description="Keep track of courier partners (BlueDart, India Post), tracking AWB numbers, and transit milestones for physical kits."
                actionText="Dispatch Parcel"
                onAction={onDispatchModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
