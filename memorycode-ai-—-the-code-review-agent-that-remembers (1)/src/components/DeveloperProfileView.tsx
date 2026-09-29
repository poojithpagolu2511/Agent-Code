import React, { useState } from 'react';
import { 
  UserCheck, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Sliders, 
  AlertTriangle, 
  Award,
  Check
} from 'lucide-react';
import { Developer } from '../types';

interface DeveloperProfileViewProps {
  developers: Developer[];
  onUpdateDeveloper: (dev: Developer) => void;
}

export const DeveloperProfileView: React.FC<DeveloperProfileViewProps> = ({
  developers,
  onUpdateDeveloper
}) => {
  const [selectedDevId, setSelectedDevId] = useState<string>(developers[0]?.id || 'dev-1');
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const selectedDev = developers.find(d => d.id === selectedDevId) || developers[0];

  const handleToggleFeedbackStyle = () => {
    const updated: Developer = {
      ...selectedDev,
      feedbackStyle: selectedDev.feedbackStyle === 'Concise' ? 'Detailed' : 'Concise'
    };
    onUpdateDeveloper(updated);
    triggerSaveToast();
  };

  const handleToggleReviewMode = () => {
    const updated: Developer = {
      ...selectedDev,
      reviewMode: selectedDev.reviewMode === 'Strict' ? 'Coaching' : 'Strict'
    };
    onUpdateDeveloper(updated);
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const acceptancePercentage = Math.round(
    (selectedDev.acceptedSuggestions / (selectedDev.acceptedSuggestions + selectedDev.rejectedSuggestions || 1)) * 100
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Developer Preferences & Profiles</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            MemoryCode personalizes code review tone, verbosity, and suggestion style based on individual developer preferences and historical feedback acceptance.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences updated</span>
          </div>
        )}
      </div>

      {/* Developer Select Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {developers.map(dev => (
          <button
            key={dev.id}
            onClick={() => setSelectedDevId(dev.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
              selectedDevId === dev.id
                ? 'bg-slate-800 border-cyan-500/50 text-white shadow-md shadow-cyan-950/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {dev.avatar ? (
              <img 
                src={dev.avatar} 
                alt={dev.name} 
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-slate-700" 
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-cyan-400">
                {dev.name[0]}
              </div>
            )}
            <span>{dev.name}</span>
          </button>
        ))}
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Profile Summary & Stats */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            {selectedDev.avatar ? (
              <img 
                src={selectedDev.avatar} 
                alt={selectedDev.name} 
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-950/20" 
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-cyan-400">
                {selectedDev.name[0]}
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-bold text-white">{selectedDev.name}</h3>
              <p className="text-xs text-slate-400">{selectedDev.role}</p>
              <p className="text-[11px] font-mono text-cyan-400 mt-0.5">{selectedDev.email}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {selectedDev.bio}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-center">
            <div>
              <span className="text-slate-400 text-xs block">Reviews</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {selectedDev.totalReviews}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Accepted</span>
              <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {selectedDev.acceptedSuggestions}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Acceptance</span>
              <span className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                {acceptancePercentage}%
              </span>
            </div>
          </div>

          {/* Frequent Issues Flagged */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block">Frequently Caught in Reviews:</span>
            <div className="space-y-1.5">
              {selectedDev.frequentIssues.map((issue, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Preference Toggles & AI Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tone & Review Mode Settings */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Review Tone & Style Preferences</span>
            </h4>

            {/* Toggle 1: Concise vs Detailed */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">Feedback Verbosity</span>
                <span className="text-[11px] text-slate-400">
                  {selectedDev.feedbackStyle === 'Concise' 
                    ? 'Short bullet points with immediate diff fixes' 
                    : 'In-depth explanations with architectural context and background'}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                <button
                  onClick={handleToggleFeedbackStyle}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedDev.feedbackStyle === 'Concise' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Concise
                </button>
                <button
                  onClick={handleToggleFeedbackStyle}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedDev.feedbackStyle === 'Detailed' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>

            {/* Toggle 2: Strict vs Coaching */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">Review Mode</span>
                <span className="text-[11px] text-slate-400">
                  {selectedDev.reviewMode === 'Strict'
                    ? 'Rigid compliance gatekeeper mode. Flag every convention strictly.'
                    : 'Educational coaching mode. Encouraging tips with helpful links.'}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                <button
                  onClick={handleToggleReviewMode}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedDev.reviewMode === 'Strict' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Strict
                </button>
                <button
                  onClick={handleToggleReviewMode}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedDev.reviewMode === 'Coaching' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Coaching
                </button>
              </div>
            </div>

          </div>

          {/* Personalized Recommendations Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Memory Recommendations</span>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
                <span className="font-semibold text-white">Recommended Rule to Review: MEM-103</span>
                <p className="text-slate-400">
                  {selectedDev.name} has accepted 3 suggestions regarding Postgres column naming conventions. Standardizing on database migrations first will avoid PR iteration cycles.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
                <span className="font-semibold text-white">Suggested IDE Pre-commit Hook</span>
                <p className="text-slate-400">
                  Install the MemoryCode Git hook to run Hindsight local checks during <span className="font-mono text-cyan-300">git commit</span>, preventing secret leaks before push.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
