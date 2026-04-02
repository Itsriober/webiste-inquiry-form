import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Lock, Search, Trash2, Globe, Briefcase, FileText, LayoutTemplate, Zap, ExternalLink } from 'lucide-react';

import { getBriefs, getStats, deleteBrief, clearAllData, type StoredBrief, type FormStats } from '../lib/storage';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);
  const [briefs, setBriefs] = useState<StoredBrief[]>([]);
  const [stats, setStats] = useState<FormStats>({ started: 0, submitted: 0, abandoned: 0 });
  const [selectedBrief, setSelectedBrief] = useState<StoredBrief | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const correctPin = import.meta.env.VITE_DASHBOARD_PIN;

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setBriefs(getBriefs());
    setStats(getStats());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPinInput('');
    }
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this brief?')) {
      deleteBrief(id);
      loadData();
      if (selectedBrief?.id === id) {
        setSelectedBrief(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('WARNING: Are you sure you want to delete ALL data? This cannot be undone.')) {
      clearAllData();
      loadData();
      setSelectedBrief(null);
    }
  };

  const filteredBriefs = briefs.filter(b =>
    b.data.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.data.clientCompany?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateConversionRate = () => {
    if (stats.started === 0) return 0;
    return Math.round((stats.submitted / stats.started) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card p-10 rounded-3xl shadow-2xl border border-surface-border max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Subtle brand glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand/5 rounded-full blur-[80px]" />

          <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-brand/20 relative z-10">
            <Lock className="w-10 h-10 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-3 font-display">Agency Dashboard</h1>
          <p className="text-text-muted mb-10 font-body">Enter your security PIN to access project inquiries.</p>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setError(false);
                }}
                className={`w-full px-6 py-4 rounded-xl border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all text-center tracking-[0.5em] text-2xl font-bold ${error ? 'border-error bg-error/5' : 'border-surface-border hover:border-brand/30'
                  }`}
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-sm font-medium"
                >
                  Incorrect security code.
                </motion.p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark text-surface py-4 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-brand/20"
            >
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-text-primary font-display">Dashboard</h1>
          <p className="text-text-secondary text-base mt-2 font-body">Manage incoming project inquiries and form analytics.</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-6 py-2.5 border border-surface-border rounded-xl text-sm font-semibold text-text-primary hover:bg-surface-elevated transition-all flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Lock Session
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Inquiries Started" value={stats.started} icon={<Zap className="w-5 h-5 text-amber-500" />} />
        <StatCard title="Inquiries Submitted" value={stats.submitted} icon={<FileText className="w-5 h-5 text-success" />} />
        <StatCard title="Drop-off Rate" value={stats.started - stats.submitted} icon={<Trash2 className="w-5 h-5 text-error" />} />
        <StatCard title="Conversion" value={`${calculateConversionRate()}%`} icon={<LayoutTemplate className="w-5 h-5 text-brand" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - List */}
        <div className="lg:col-span-1 border border-surface-border bg-surface-card rounded-3xl overflow-hidden flex flex-col h-[700px] shadow-xl">
          <div className="p-6 border-b border-surface-border bg-surface-elevated/40">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface border border-surface-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/40 placeholder:text-text-muted/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredBriefs.length === 0 ? (
              <div className="p-12 text-center text-text-muted">
                <div className="w-16 h-16 bg-surface-elevated rounded-2xl flex items-center justify-center mx-auto mb-4 border border-surface-border">
                  <Search className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-medium">No results found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {filteredBriefs.map(brief => (
                  <button
                    key={brief.id}
                    onClick={() => setSelectedBrief(brief)}
                    className={`w-full text-left p-6 hover:bg-surface-elevated/50 transition-all group relative ${selectedBrief?.id === brief.id ? 'bg-surface-elevated' : ''
                      }`}
                  >
                    {selectedBrief?.id === brief.id && (
                      <motion.div layoutId="active-indicator" className="absolute left-0 top-6 bottom-6 w-1 bg-brand rounded-r-full" />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-text-primary truncate pr-2 group-hover:text-brand transition-colors">
                        {brief.data.clientCompany || brief.data.clientName}
                      </span>
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider bg-surface-elevated px-1.5 py-0.5 rounded border border-surface-border">
                        {format(new Date(brief.submittedAt), 'MMM d')}
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary truncate mb-4">{brief.data.clientName}</div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-brand/10 text-brand rounded text-[10px] font-bold uppercase tracking-widest border border-brand/20">
                        {brief.data.businessType}
                      </span>
                      <span className="px-2 py-0.5 bg-success/10 text-success rounded text-[10px] font-bold uppercase tracking-widest border border-success/20">
                        {brief.data.budgetRange}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {briefs.length > 0 && (
            <div className="p-4 border-t border-surface-border bg-surface-elevated/20 text-center">
              <button
                onClick={handleClearAll}
                className="text-[10px] text-error hover:text-white hover:bg-error transition-all font-bold uppercase tracking-widest py-2 px-4 rounded-lg border border-error/20"
              >
                Purge Database
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 border border-surface-border bg-surface-card rounded-3xl overflow-hidden h-[700px] flex flex-col shadow-xl">
          {selectedBrief ? (
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
              <div className="flex justify-between items-start mb-12 pb-8 border-b border-surface-border">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest rounded border border-brand/20">Project Brief</span>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">ID: {selectedBrief.id.slice(0, 8)}</span>
                  </div>
                  <h2 className="text-4xl font-bold text-text-primary mb-3 font-display">
                    {selectedBrief.data.clientCompany || `${selectedBrief.data.clientName}'s Project`}
                  </h2>
                  <div className="text-sm text-text-secondary flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span>Submitted {format(new Date(selectedBrief.submittedAt), 'MMMM d, yyyy · h:mm a')}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(selectedBrief.id, e)}
                  className="p-3 text-text-muted hover:text-error hover:bg-error/10 rounded-xl transition-all border border-transparent hover:border-error/20"
                  title="Delete brief"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                {/* Contact Card */}
                <div className="bg-surface-elevated/40 p-6 rounded-2xl border border-surface-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase className="w-12 h-12" />
                  </div>
                  <h3 className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Client Metadata
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <div>
                      <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Full Name</span>
                      <span className="font-semibold text-text-primary">{selectedBrief.data.clientName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Email Address</span>
                      <a href={`mailto:${selectedBrief.data.clientEmail}`} className="font-semibold text-brand hover:underline flex items-center gap-2">
                        {selectedBrief.data.clientEmail} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {selectedBrief.data.clientPhone && (
                      <div>
                        <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Contact Phone</span>
                        <a href={`tel:${selectedBrief.data.clientPhone}`} className="font-semibold text-text-primary hover:text-brand transition-colors">
                          {selectedBrief.data.clientPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-surface-elevated/40 p-6 rounded-2xl border border-surface-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Globe className="w-12 h-12" />
                  </div>
                  <h3 className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Global Logistics
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <div>
                      <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Investment Range</span>
                      <span className="font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded text-sm uppercase tracking-wide">
                        {selectedBrief.data.budgetRange}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Target Timeline</span>
                      <span className="font-semibold text-text-primary">{selectedBrief.data.timeline}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Brand Lifecycle</span>
                      <span className="font-semibold text-text-primary">{selectedBrief.data.brandStatus}</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="space-y-12">
                <DetailSection title="Executive Summary & Requirements">
                  <DetailRow label="Business Ecosystem" value={selectedBrief.data.businessType === 'Other' ? `Other: ${selectedBrief.data.businessTypeOther}` : selectedBrief.data.businessType} />
                  <DetailRow label="Infrastructure Status" value={selectedBrief.data.hasExistingSite === 'Yes' ? (selectedBrief.data.currentUrl ? `Legacy Site: ${selectedBrief.data.currentUrl}` : 'Existing Site') : 'New Build'} />
                  <DetailRow label="Core Objectives" value={selectedBrief.data.websitePurpose.join(', ')} />
                  <DetailRow label="Demographic Target" value={selectedBrief.data.targetAudience} />
                </DetailSection>

                <DetailSection title="Production Deliverables">
                  <DetailRow label="Architecture Scope" value={selectedBrief.data.pagesNeeded.join(', ')} />
                  <DetailRow label="Functional Pillars" value={selectedBrief.data.featuresNeeded.join(', ')} />
                  <DetailRow label="Asset Sovereignty" value={selectedBrief.data.contentSource} />
                  <DetailRow label="Cms Requirements" value={selectedBrief.data.needsCMS} />
                  <DetailRow label="Visual Aesthetic" value={selectedBrief.data.designStyle} />
                </DetailSection>

                {(selectedBrief.data.referenceUrls || selectedBrief.data.additionalNotes) && (
                  <DetailSection title="Supplementary Intelligence">
                    {selectedBrief.data.referenceUrls && (
                      <div className="mb-6">
                        <span className="block text-[10px] text-text-muted uppercase tracking-widest mb-3">Reference Ecosystems</span>
                        <div className="text-sm text-text-primary bg-surface p-4 rounded-xl border border-surface-border whitespace-pre-wrap leading-relaxed shadow-inner">
                          {selectedBrief.data.referenceUrls}
                        </div>
                      </div>
                    )}
                    {selectedBrief.data.additionalNotes && (
                      <div>
                        <span className="block text-[10px] text-text-muted uppercase tracking-widest mb-3">Strategic Mandates</span>
                        <div className="text-sm text-text-primary bg-surface p-4 rounded-xl border border-surface-border whitespace-pre-wrap leading-relaxed shadow-inner">
                          {selectedBrief.data.additionalNotes}
                        </div>
                      </div>
                    )}
                  </DetailSection>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-surface-elevated/10">
              <div className="w-24 h-24 bg-surface-elevated rounded-full shadow-2xl flex items-center justify-center mb-8 text-text-muted border border-surface-border relative">
                <div className="absolute inset-0 bg-brand/5 rounded-full blur-xl animate-pulse" />
                <FileText className="w-10 h-10 opacity-30" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 font-display">System Idle</h3>
              <p className="text-sm text-text-secondary max-w-xs leading-relaxed">Select an Inquiry from the Intelligence Ledger to initialize Project Review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponents for cleaner code
function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-surface-card p-6 rounded-3xl border border-surface-border shadow-xl flex items-center gap-6 group hover:border-brand/40 transition-all">
      <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center flex-shrink-0 border border-surface-border group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-bold text-text-primary tracking-tight font-display">{value}</p>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="border border-transparent hover:border-brand/5 p-4 rounded-2xl transition-colors">
      <h3 className="text-[10px] font-bold text-brand uppercase tracking-[0.3em] mb-6 pb-2 border-b border-surface-border/50">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 items-start">
      <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-1">{label}</span>
      <span className="text-sm text-text-primary font-medium leading-relaxed">{value}</span>
    </div>
  );
}
