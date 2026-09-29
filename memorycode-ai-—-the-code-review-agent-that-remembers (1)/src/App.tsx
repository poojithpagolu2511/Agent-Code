import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { ReviewWorkspace } from './components/ReviewWorkspace';
import { MemoryReplayView } from './components/MemoryReplayView';
import { TeamMemoryView } from './components/TeamMemoryView';
import { ReviewHistoryView } from './components/ReviewHistoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { TeamBrainView } from './components/TeamBrainView';
import { DeveloperProfileView } from './components/DeveloperProfileView';

import { WhyModal } from './components/WhyModal';
import { PresentationModal } from './components/PresentationModal';
import { CreateRuleModal } from './components/CreateRuleModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { GitHubModal } from './components/GitHubModal';
import { ShareModal } from './components/ShareModal';

import { 
  TeamMemory, 
  CodeReview, 
  Developer, 
  ReviewAnalytics, 
  Suggestion 
} from './types';
import { 
  INITIAL_DEVELOPERS, 
  INITIAL_REVIEWS, 
  INITIAL_ANALYTICS,
  SAMPLE_CODE_SNIPPETS
} from './data/mockData';
import { hindsightMemoryService, CreateRuleInput } from './services/HindsightMemoryService';

const REVIEWS_STORAGE_KEY = 'memorycode_reviews_v1';
const DEVS_STORAGE_KEY = 'memorycode_devs_v1';
const ANALYTICS_STORAGE_KEY = 'memorycode_analytics_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  
  // Persistent State
  const [memories, setMemories] = useState<TeamMemory[]>(() => hindsightMemoryService.getAllMemories());
  const [reviews, setReviews] = useState<CodeReview[]>(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });
  const [developers, setDevelopers] = useState<Developer[]>(() => {
    try {
      const stored = localStorage.getItem(DEVS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DEVELOPERS;
    } catch {
      return INITIAL_DEVELOPERS;
    }
  });
  const [analytics, setAnalytics] = useState<ReviewAnalytics>(() => {
    try {
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ANALYTICS;
    } catch {
      return INITIAL_ANALYTICS;
    }
  });

  // Modal States
  const [activeWhySuggestion, setActiveWhySuggestion] = useState<Suggestion | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState<boolean>(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(DEVS_STORAGE_KEY, JSON.stringify(developers));
  }, [developers]);

  useEffect(() => {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  }, [analytics]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Handlers
  const handleAcceptSuggestion = (sug: Suggestion) => {
    if (sug.recalledMemoryId) {
      hindsightMemoryService.reinforceMemory(
        sug.recalledMemoryId,
        'accepted',
        'Current Contributor',
        sug.reviewId || 'rev-current',
        `Accepted: "${sug.title}" in workspace review.`
      );
      setMemories(hindsightMemoryService.getAllMemories());
    }

    // Reactively update analytics
    setAnalytics(prev => ({
      ...prev,
      recurringMistakesPrevented: prev.recurringMistakesPrevented + 1,
      suggestionAcceptanceRate: Math.min(99, prev.suggestionAcceptanceRate + 1),
      memoryHealthScore: Math.min(99, prev.memoryHealthScore + 1)
    }));

    showToast(`✓ Suggestion accepted. Memory reinforced with increased confidence.`);
  };

  const handleRejectSuggestion = (sug: Suggestion) => {
    if (sug.recalledMemoryId) {
      hindsightMemoryService.reinforceMemory(
        sug.recalledMemoryId,
        'rejected',
        'Current Contributor',
        sug.reviewId || 'rev-current',
        `Rejected: "${sug.title}" by developer with rationale.`
      );
      setMemories(hindsightMemoryService.getAllMemories());
    }

    showToast(`Suggestion rejected. Precedent recorded in Hindsight audit trail.`);
  };

  const handleCreateRule = (input: CreateRuleInput) => {
    const newMemory = hindsightMemoryService.createRule(input);
    setMemories(hindsightMemoryService.getAllMemories());
    setAnalytics(prev => ({
      ...prev,
      memoriesStored: prev.memoriesStored + 1
    }));
    showToast(`✓ Rule ${newMemory.id} added to team memory.`);
  };

  const handleTogglePin = (id: string) => {
    hindsightMemoryService.togglePin(id);
    setMemories(hindsightMemoryService.getAllMemories());
  };

  const handleToggleActive = (id: string) => {
    hindsightMemoryService.toggleActive(id);
    setMemories(hindsightMemoryService.getAllMemories());
  };

  const handleUpdateDeveloper = (updated: Developer) => {
    setDevelopers(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data and memory weights back to defaults?')) {
      hindsightMemoryService.resetToDefaults();
      setMemories(hindsightMemoryService.getAllMemories());
      setReviews(INITIAL_REVIEWS);
      setDevelopers(INITIAL_DEVELOPERS);
      setAnalytics(INITIAL_ANALYTICS);
      localStorage.removeItem(REVIEWS_STORAGE_KEY);
      localStorage.removeItem(DEVS_STORAGE_KEY);
      localStorage.removeItem(ANALYTICS_STORAGE_KEY);
      showToast('✓ Demo data and Hindsight memory restored to factory defaults.');
    }
  };

  const handleSimulateFutureReview = () => {
    setCurrentTab('workspace');
    showToast('Loaded future PR scenario demonstrating instant memory recall.');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onResetData={handleResetData}
        memoryCount={memories.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6">
        
        {currentTab === 'dashboard' && (
          <LandingView
            analytics={analytics}
            memories={memories}
            reviews={reviews}
            onStartReview={() => setCurrentTab('workspace')}
            onExploreMemory={() => setCurrentTab('replay')}
            onSelectReview={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'workspace' && (
          <ReviewWorkspace
            onAcceptSuggestion={handleAcceptSuggestion}
            onRejectSuggestion={handleRejectSuggestion}
            onOpenWhyModal={(sug) => setActiveWhySuggestion(sug)}
            onOpenGitHubModal={() => setIsGitHubOpen(true)}
            onSimulateFutureReview={handleSimulateFutureReview}
          />
        )}

        {currentTab === 'replay' && (
          <MemoryReplayView
            memories={memories}
            onOpenWorkspace={() => setCurrentTab('workspace')}
          />
        )}

        {currentTab === 'memories' && (
          <TeamMemoryView
            memories={memories}
            onOpenCreateRule={() => setIsCreateRuleOpen(true)}
            onTogglePin={handleTogglePin}
            onToggleActive={handleToggleActive}
          />
        )}

        {currentTab === 'history' && (
          <ReviewHistoryView
            reviews={reviews}
            onSelectReview={() => {}}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView analytics={analytics} />
        )}

        {currentTab === 'brain' && (
          <TeamBrainView
            memories={memories}
            onSelectMemoryForWorkspace={(mem) => {
              setCurrentTab('workspace');
              showToast(`Focused on rule ${mem.id} in workspace.`);
            }}
          />
        )}

        {currentTab === 'profile' && (
          <DeveloperProfileView
            developers={developers}
            onUpdateDeveloper={handleUpdateDeveloper}
          />
        )}

      </main>

      {/* Modals & Overlays */}
      <WhyModal
        suggestion={activeWhySuggestion}
        onClose={() => setActiveWhySuggestion(null)}
      />

      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onJumpToWorkspace={() => {
          setIsPresentationOpen(false);
          setCurrentTab('workspace');
        }}
        onSimulateFutureReview={() => {
          setIsPresentationOpen(false);
          handleSimulateFutureReview();
        }}
      />

      <CreateRuleModal
        isOpen={isCreateRuleOpen}
        onClose={() => setIsCreateRuleOpen(false)}
        onSubmit={handleCreateRule}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <GitHubModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
        onImportPR={(repo, pr) => {
          showToast(`Imported PR #${pr} from ${repo}. Ready for review.`);
        }}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Ephemeral Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Footer adhering to Anti-Slop Rules */}
      <footer className="border-t border-slate-800/80 bg-[#070b13] py-6 px-4 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MemoryCode AI</span>
            <span>·</span>
            <span>Autonomous Code Review Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsShareOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Share Website
            </button>
            <span>·</span>
            <span>Persistent Team Memory</span>
            <span>·</span>
            <span>Hindsight Local Layer</span>
            <span>·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
