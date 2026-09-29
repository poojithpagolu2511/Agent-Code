import React from 'react';
import { 
  X, 
  HelpCircle, 
  ArrowDown, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  GitPullRequest, 
  ShieldCheck 
} from 'lucide-react';
import { Suggestion } from '../types';

interface WhyModalProps {
  suggestion: Suggestion | null;
  onClose: () => void;
}

export const WhyModal: React.FC<WhyModalProps> = ({ suggestion, onClose }) => {
  if (!suggestion) return null;

  const chain = suggestion.decisionChain || {
    currentCode: suggestion.originalCodeSnippet || 'Submitted code snippet',
    similarPastIssue: 'Similar recurring issue identified in repository history.',
    pastFeedback: 'Senior developer reviewed and established team convention.',
    storedMemoryRule: suggestion.recalledMemoryTitle || 'Established team coding policy',
    currentAction: 'Personalized fix recommended with 98% confidence.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Why am I seeing this suggestion?</h3>
              <p className="text-xs text-slate-400">Complete Hindsight precedent and decision causality chain</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion Quick Info */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">{suggestion.title}</span>
            <span className="font-mono text-cyan-400">{suggestion.confidence}% confidence</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px] block">
            {suggestion.file}:{suggestion.line}
          </span>
        </div>

        {/* The 5-Step Decision Chain */}
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            The 5-Step Decision Chain:
          </span>

          <div className="space-y-3 relative">
            
            {/* Step 1: Current Code */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono text-[10px]">1</span>
                <span>Current Code Submitted</span>
              </div>
              <div className="font-mono text-xs text-rose-300 bg-slate-900/60 p-2 rounded overflow-x-auto">
                <pre>{chain.currentCode}</pre>
              </div>
            </div>

            <div className="flex justify-center -my-1 text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Step 2: Similar Past Issue */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono text-[10px]">2</span>
                <span>Historical PR Incident Intersected</span>
              </div>
              <p className="text-slate-300 pl-7">{chain.similarPastIssue}</p>
            </div>

            <div className="flex justify-center -my-1 text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Step 3: Past Team Feedback */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono text-[10px]">3</span>
                <span>Team Peer Review Consensus</span>
              </div>
              <p className="text-slate-300 pl-7">{chain.pastFeedback}</p>
            </div>

            <div className="flex justify-center -my-1 text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Step 4: Stored Memory Rule */}
            <div className="bg-gradient-to-r from-violet-950/40 to-slate-950 border border-violet-800/40 rounded-xl p-4 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-violet-300">
                <span className="w-5 h-5 rounded-full bg-violet-900/60 text-violet-200 flex items-center justify-center font-mono text-[10px]">4</span>
                <span>Solidified Hindsight Memory Mandate</span>
              </div>
              <p className="text-slate-200 pl-7 font-medium">{chain.storedMemoryRule}</p>
            </div>

            <div className="flex justify-center -my-1 text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Step 5: Current Action Recommended */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-800/40 rounded-xl p-4 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <span className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-200 flex items-center justify-center font-mono text-[10px]">5</span>
                <span>Personalized Fix Synthesized</span>
              </div>
              <p className="text-slate-200 pl-7 font-medium">{chain.currentAction}</p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Backed by persistent team memory · <span className="text-cyan-400">Zero duplicate debate</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
