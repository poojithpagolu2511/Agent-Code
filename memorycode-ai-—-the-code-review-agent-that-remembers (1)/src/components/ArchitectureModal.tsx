import React from 'react';
import { 
  X, 
  BookOpen, 
  GitBranch, 
  Database, 
  Shield, 
  Terminal, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-950">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System Architecture & Technical Blueprint</h3>
              <p className="text-xs text-slate-400">MemoryCode AI · Technical Architecture & Engine Blueprint</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* Section 1: The Problem */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              1. The Problem: AI Code Review Amnesia
            </h4>
            <p>
              Current AI review bots (and static linters) operate ephemerally. They assess each pull request in isolation, with zero retention of previous decisions. If a team spent days agreeing on an architecture exception, a naming convention, or a security mandate, the AI forgets it in the very next pull request. This causes reviewer fatigue, repetitive debates, and erosion of developer trust.
            </p>
          </div>

          {/* Section 2: How Persistent Memory Works */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              2. How Hindsight Persistent Memory Works
            </h4>
            <p>
              MemoryCode incorporates an intelligent memory layer via <span className="text-cyan-300 font-semibold">HindsightMemoryService</span>. When a developer accepts or rejects a suggestion, that interaction is treated as an explicit training signal:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Syntactic Pattern Indexing:</strong> Code snippets, AST nodes, and token sequences are linked to rule IDs.</li>
              <li><strong className="text-slate-200">Dynamic Confidence Scoring:</strong> Accepted fixes reinforce rule weights (e.g. 90% → 99%), making future warnings more authoritative.</li>
              <li><strong className="text-slate-200">The Decision Chain:</strong> Every suggestion retains the exact precedent chain: <span className="font-mono text-cyan-400 text-[11px]">Current Code → Past Incident → Peer Feedback → Stored Memory → Fix</span>.</li>
            </ul>
          </div>

          {/* Section 3: Hindsight API Integration Blueprint */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
            <span className="text-cyan-400 font-bold block">// Production Hindsight Remote Service Blueprint:</span>
            <pre className="text-slate-300 overflow-x-auto">{`interface HindsightRemoteConfig {
  endpoint: "https://api.hindsight.ai/v1/memories";
  apiKey: process.env.HINDSIGHT_API_KEY;
  tenantId: "team_engineering_core";
  indexingMode: "hybrid_vector_ast";
}

// In this competition build, HindsightMemoryService provides
// a realistic high-fidelity local vector-heuristic layer with
// browser storage persistence, ready for zero-downtime swap.`}</pre>
          </div>

          {/* Section 4: What is Mocked in Demo Mode */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              3. Demo Mode vs. Production Runtime
            </h4>
            <p>
              In this environment, all code review logic and memory queries run in-browser or through a local server proxy. If a <span className="font-mono text-cyan-300">GEMINI_API_KEY</span> is supplied in the environment, the server-side proxy routes queries to Google Gemini 3.8 Flash with structured schema extraction. Otherwise, our deterministic heuristic engine handles all checks with zero external network dependencies.
            </p>
          </div>

          {/* Section 5: GitHub CI/CD & PR Extension */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              4. Extension to GitHub Actions & PR Bots
            </h4>
            <p>
              MemoryCode deploys seamlessly into GitHub Actions via a lightweight container runner. On <span className="font-mono text-cyan-300">pull_request: [opened, synchronize]</span>:
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              $ memorycode-review --diff HEAD~1 --repo $GITHUB_REPOSITORY --hindsight-token $HINDSIGHT_SECRET
            </div>
            <p className="text-slate-400">
              The bot leaves inline comments with 1-click GitHub suggestions and memory precedent badges.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">MemoryCode AI v1.4-Hackathon</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
