import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function LostFound() {
  const { lostFoundList, addLostFound } = useSocket();
  const { speak, screenReaderMode } = useAccessibility();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'report-lost', 'report-found'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Form State
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Electronics',
    description: '',
    location: '',
    contactName: '',
    contactPhone: '',
    imageEmoji: '📦',
  });

  const categories = [
    'Electronics',
    'Wallets & Documents',
    'Luggage',
    'Clothing',
    'Personal Belongings',
    'Keys',
    'Other',
  ];

  const filteredItems = useMemo(() => {
    return lostFoundList.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.itemName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [lostFoundList, categoryFilter, searchQuery]);

  const handleSubmit = (e, reportType) => {
    e.preventDefault();
    if (!formData.itemName || !formData.contactPhone) {
      toast.error('Please enter Item Name and Contact Phone');
      return;
    }

    const newItem = {
      ...formData,
      type: reportType, // 'lost' or 'found'
    };

    addLostFound(newItem);
    toast.success(`Report submitted successfully! Station Duty Officer notified.`, {
      icon: reportType === 'lost' ? '🔍' : '✅',
    });

    if (screenReaderMode) {
      speak(
        `Report for ${formData.itemName} registered successfully. Reference ID generated and RPF team informed.`
      );
    }

    // Reset and switch back to browse
    setFormData({
      itemName: '',
      category: 'Electronics',
      description: '',
      location: '',
      contactName: '',
      contactPhone: '',
      imageEmoji: '📦',
    });
    setActiveTab('browse');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Claimed':
        return (
          <span className="bg-green-100 text-green-800 border border-green-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
            ✓ Claimed & Handed Over
          </span>
        );
      case 'In Station Custody':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
            ● In Station Custody (RPF Post)
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
            ● Reported / Searching
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
          <span>🔍</span> Station Lost & Found Portal
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Report misplaced belongings or search items retrieved by station duty officers and RPF personnel.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('browse')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'browse'
              ? 'border-railBlue text-railBlue'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          📂 Browse Reported Items ({lostFoundList.length})
        </button>
        <button
          onClick={() => setActiveTab('report-lost')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'report-lost'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          ⚠️ Report Lost Item
        </button>
        <button
          onClick={() => setActiveTab('report-found')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'report-found'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          🎁 Report Found Item
        </button>
      </div>

      {/* TAB 1: BROWSE ITEMS */}
      {activeTab === 'browse' && (
        <div className="space-y-5">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item name, place, description..."
                className="pl-9 pr-4 py-2 w-full text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                Category:
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-railBlue"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isFound = item.type === 'found';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                          {item.imageEmoji || (isFound ? '📦' : '🔍')}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider ${
                                isFound
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isFound ? 'FOUND ITEM' : 'LOST ITEM'}
                            </span>
                            <span className="text-xs text-gray-400">{item.date}</span>
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mt-1">
                            {item.itemName}
                          </h3>
                        </div>
                      </div>

                      {getStatusBadge(item.status)}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block">Reported Location:</span>
                        <span className="font-semibold text-gray-800">{item.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Category:</span>
                        <span className="font-semibold text-gray-800">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Contact: <strong>{item.contactName}</strong>
                    </span>
                    <a
                      href={`tel:${item.contactPhone}`}
                      className="px-3 py-1.5 bg-railBlue/10 hover:bg-railBlue hover:text-white text-railBlue font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>📞</span> {item.contactPhone}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
              <span className="text-4xl block mb-2">📭</span>
              <h3 className="text-lg font-bold text-gray-800">No matching items found</h3>
              <p className="text-sm text-gray-500 mt-1">
                If you lost or found something, please submit a report using the tabs above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2 & 3: REPORT FORM */}
      {(activeTab === 'report-lost' || activeTab === 'report-found') && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <span>{activeTab === 'report-lost' ? '⚠️' : '🎁'}</span>
              <span>{activeTab === 'report-lost' ? 'Report a Lost Item' : 'Report a Found Item'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {activeTab === 'report-lost'
                ? 'Fill details to broadcast to Railway Protection Force and station control room.'
                : 'Thank you for your honesty! Please deposit the item at RPF Post Gate 1 or enter details below.'}
            </p>
          </div>

          <form
            onSubmit={(e) =>
              handleSubmit(e, activeTab === 'report-lost' ? 'lost' : 'found')
            }
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="e.g. Black Lenovo Laptop Bag, Gold Watch, Brown Leather Wallet"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Icon / Emoji
                </label>
                <select
                  value={formData.imageEmoji}
                  onChange={(e) => setFormData({ ...formData, imageEmoji: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue bg-white"
                >
                  <option value="💻">💻 Laptop / Gadget</option>
                  <option value="📱">📱 Mobile Phone</option>
                  <option value="👛">👛 Wallet / Purse</option>
                  <option value="🧳">🧳 Luggage / Bag</option>
                  <option value="👓">👓 Glasses</option>
                  <option value="🔑">🔑 Keys</option>
                  <option value="📦">📦 Other Package</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Where was it {activeTab === 'report-lost' ? 'lost' : 'found'}?
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Platform 2 near coach S4, AC Waiting Room, Concourse Gate 1"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Detailed Description & Identifiers
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Color, brand, contents, unique scratches, lock code or names inside..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-railBlue"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className={`flex-1 py-3 px-4 rounded-xl text-white font-bold text-sm shadow transition-colors ${
                  activeTab === 'report-lost'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Submit {activeTab === 'report-lost' ? 'Lost Item' : 'Found Item'} Report
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
