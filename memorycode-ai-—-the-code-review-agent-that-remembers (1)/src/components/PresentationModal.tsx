import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Zap, 
  Check, 
  Layers, 
  RefreshCw 
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToWorkspace: () => void;
  onSimulateFutureReview: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  onJumpToWorkspace,
  onSimulateFutureReview
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      number: '01',
      title: 'The Problem: Generic AI Reviewers Have Amnesia',
      category: 'Core Pain Point',
      description: 'Standard AI tools give generic, repetitive feedback. They forget previous architecture decisions, team conventions, accepted exceptions, and security policies. Every sprint, developers end up debating the exact same comments over and over.',
      highlight: 'Engineers spend 35% of code review time re-explaining previously agreed team conventions.',
      visual: (
        <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 text-xs font-mono text-rose-300 space-y-2">
          <div className="text-slate-500">// Traditional AI / Linter:</div>
          <div>⚠️ "Consider checking this token..."</div>
          <div>⚠️ "Warning: Promise chain detected..."</div>
          <div className="text-slate-500">// No memory of previous team consensus or why things are structured this way!</div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Step 1: Submit Code with Critical Flaws',
      category: 'Live Demonstration',
      description: 'A developer submits a new login controller containing a hardcoded API master key, SQL concatenation, and non-standard camelCase database columns.',
      highlight: 'MemoryCode immediately intercepts the PR upon creation via GitHub Webhook or CLI.',
      visual: (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 overflow-x-auto">
          <div className="text-slate-500">// auth.controller.ts</div>
          <div className="text-rose-400">const MASTER_KEY = "sec_live_908234820394820";</div>
          <div className="text-rose-400">const query = "SELECT userId FROM users WHERE email = '" + email + "'";</div>
          <div className="text-cyan-300">// MemoryCode initiates Hindsight query...</div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Step 2: Recall Persistent Team Memory',
      category: 'Hindsight Layer',
      description: 'Instead of generic warnings, MemoryCode recalls specific team precedents: Rule MEM-101 (established by Marcus Vance) and Rule MEM-103 (Postgres column snake_case naming).',
      highlight: 'Shows 99% confidence and displays the actual PR where the team decided this.',
      visual: (
        <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-700/60 text-xs font-mono text-indigo-200 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recalled Rule MEM-101 (99% Confidence)</span>
          </div>
          <div>"Marcus Vance established zero tolerance for hardcoded tokens in March 2026."</div>
          <div className="text-emerald-300 mt-2">✓ Verified fix: read from process.env with runtime guard</div>
        </div>
      )
    },
    {
      number: '04',
      title: 'Step 3: Accept Feedback with 1-Click Action',
      category: 'Developer Flow',
      description: 'The developer clicks "Accept & Reinforce Memory". MemoryCode automatically prepares the clean replacement diff and marks the suggestion as accepted.',
      highlight: 'Zero hostility, zero friction. Developers trust suggestions because they cite team consensus.',
      visual: (
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-800/60 text-xs font-mono text-emerald-300 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Suggestion Accepted by Contributor</span>
          </div>
          <div className="text-slate-400">// Patch applied cleanly:</div>
          <div>+ const apiKey = process.env.SERVICE_API_KEY;</div>
          <div>+ const user = await db.query(query, [email]);</div>
        </div>
      )
    },
    {
      number: '05',
      title: 'Step 4: Real-time Memory Reinforcement',
      category: 'Continuous Learning',
      description: 'Hindsight memory updates the rule’s confidence weight from 94% to 99%, records this review in the decision history log, and increments the prevented issue counter.',
      highlight: 'Analytics update reactively across the entire team dashboard in real-time.',
      visual: (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-mono">
            <span>MEM-101 Synapse Weight</span>
            <span className="text-emerald-400 font-bold">+5% Gain (99% max)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-cyan-400 h-2 rounded-full w-[99%]" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Prevented mistakes counter: 38 → 39 prevented
          </div>
        </div>
      )
    },
    {
      number: '06',
      title: 'Step 5: Simulate Future Review (Zero Re-Debate)',
      category: 'The Outcome',
      description: 'When another developer creates a PR in a different repository with a similar mistake, MemoryCode immediately catches it in 420ms with instant precedent citations.',
      highlight: 'A self-healing engineering culture that compounds knowledge over time.',
      visual: (
        <div className="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 p-4 rounded-xl border border-cyan-500/40 text-xs font-mono text-cyan-200 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-white">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Instant Precedent Interception</span>
          </div>
          <div>"Flagged in 420ms: Matches team rule MEM-101 accepted 6 times."</div>
          <div className="text-emerald-300">Result: Automated approval within 2 minutes of commit.</div>
        </div>
      )
    }
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono text-xs font-bold shadow-md shadow-cyan-950">
              Judges Demo
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400">Step {currentStep + 1} of {steps.length}</span>
              <h3 className="text-base font-bold text-white">MemoryCode AI Interactive Demo</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {current.category}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">
            {current.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {current.description}
          </p>

          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{current.highlight}</span>
          </div>

          {/* Step Visual Preview */}
          <div className="pt-2">
            {current.visual}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                onClick={() => {
                  onClose();
                  onJumpToWorkspace();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 transition-colors"
              >
                Open Workspace Now
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={() => {
                  onClose();
                  onSimulateFutureReview();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-950 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Future PR</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-950 transition-all flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                Finish Tour
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
