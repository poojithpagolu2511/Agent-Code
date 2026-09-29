import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Archive, 
  ShieldCheck, 
  Tag, 
  Check, 
  ExternalLink, 
  Layers, 
  FileCode,
  Flame,
  Filter,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { TeamMemory, Category, Severity } from '../types';

interface TeamMemoryViewProps {
  memories: TeamMemory[];
  onOpenCreateRule: () => void;
  onTogglePin: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Security',
  'Quality',
  'Architecture',
  'Naming Convention',
  'Performance',
  'Testing'
];

export const TeamMemoryView: React.FC<TeamMemoryViewProps> = ({
  memories,
  onOpenCreateRule,
  onTogglePin,
  onToggleActive
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedOnly, setPinnedOnly] = useState<boolean>(false);

  const filteredMemories = memories.filter(mem => {
    if (pinnedOnly && !mem.isPinned) return false;
    if (selectedCategory !== 'All' && mem.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = mem.title.toLowerCase().includes(q);
      const matchesDesc = mem.description.toLowerCase().includes(q);
      const matchesTags = mem.tags.some(t => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesDesc && !matchesTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team Memory & Coding Standards</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Central repository of architectural mandates, security rules, and code conventions learned by MemoryCode.
          </p>
        </div>

        <button
          onClick={onOpenCreateRule}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team Rule</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules, keywords, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar text-xs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setPinnedOnly(!pinnedOnly)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium border flex items-center gap-1 transition-colors ${
              pinnedOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Pin className="w-3 h-3" />
            <span>Pinned</span>
          </button>
        </div>

      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMemories.map(mem => (
          <div
            key={mem.id}
            className={`bg-slate-900/80 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
              mem.isPinned 
                ? 'border-amber-500/40 shadow-lg shadow-amber-950/10' 
                : 'border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {mem.id}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    mem.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                    mem.severity === 'High' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                    mem.severity === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {mem.severity}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTogglePin(mem.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      mem.isPinned ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={mem.isPinned ? 'Unpin rule' : 'Pin rule to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleActive(mem.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      mem.isActive ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={mem.isActive ? 'Archive rule' : 'Reactivate rule'}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {mem.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                  {mem.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {mem.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Card Footer */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400">
                <span>By {mem.authorName.split(' ')[0]}</span>
                <span className="text-slate-600 mx-1">·</span>
                <span className="text-emerald-400 font-mono">{mem.preventedCount} saved</span>
              </div>

              <div className="text-right">
                <span className="font-mono text-cyan-400 text-xs font-semibold tabular-nums">
                  {mem.confidenceScore}% conf
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <p className="text-sm text-slate-400">No team rules found matching your filter criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPinnedOnly(false); }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
