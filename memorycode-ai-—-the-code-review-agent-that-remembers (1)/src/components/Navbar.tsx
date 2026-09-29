import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  History, 
  BarChart3, 
  Network, 
  UserCheck, 
  BookOpen, 
  PlayCircle,
  RotateCcw,
  Share2
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'workspace' 
  | 'replay' 
  | 'memories' 
  | 'history' 
  | 'analytics' 
  | 'brain' 
  | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPresentation: () => void;
  onOpenArchitecture: () => void;
  onOpenShare: () => void;
  onResetData: () => void;
  memoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenPresentation,
  onOpenArchitecture,
  onOpenShare,
  onResetData,
  memoryCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand title, single element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <span className="font-mono font-bold text-white text-base">{'<M/>'}</span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                MemoryCode <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">AI</span>
              </span>
              <span className="block text-[11px] text-slate-400 font-normal">
                Persistent Team Memory
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (4-8 links with subtle active states) */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'dashboard' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onSelectTab('workspace')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'workspace' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Review Workspace
          </button>

          <button
            onClick={() => onSelectTab('replay')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'replay' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Memory Replay
          </button>

          <button
            onClick={() => onSelectTab('memories')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'memories' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Team Rules
            <span className="font-mono text-xs text-slate-500 tabular-nums">({memoryCount})</span>
          </button>

          <button
            onClick={() => onSelectTab('brain')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'brain' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Team Brain
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'history' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'analytics' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'profile' 
                ? 'bg-slate-800 text-cyan-300 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Developers
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Presentation Mode + Architecture Docs + Share) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenShare}
            className="px-2.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700/60 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            title="Share this website with your friend"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share</span>
          </button>

          <button
            onClick={onOpenPresentation}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 rounded-lg shadow-md shadow-indigo-950 transition-all flex items-center gap-1.5 whitespace-nowrap"
            title="3-minute guided tour for hackathon judges"
          >
            <PlayCircle className="w-3.5 h-3.5 text-cyan-200" />
            <span>Judge Demo</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Hindsight Architecture & Docs"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Docs</span>
          </button>

          <button
            onClick={onResetData}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto pt-2.5 border-t border-slate-800/60 mt-2 text-xs no-scrollbar">
        {[
          { id: 'dashboard', label: 'Overview' },
          { id: 'workspace', label: 'Workspace' },
          { id: 'replay', label: 'Replay' },
          { id: 'memories', label: 'Rules' },
          { id: 'brain', label: 'Brain' },
          { id: 'history', label: 'History' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'profile', label: 'Profile' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as NavTab)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              currentTab === item.id 
                ? 'bg-slate-800 text-cyan-300 font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
