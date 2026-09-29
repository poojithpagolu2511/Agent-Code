import React, { useState } from 'react';
import { 
  History, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  User, 
  FileCode, 
  Repeat, 
  Clock, 
  Bookmark, 
  Tag,
  FastForward,
  RotateCcw
} from 'lucide-react';
import { TeamMemory } from '../types';

interface MemoryReplayViewProps {
  memories: TeamMemory[];
  onOpenWorkspace: () => void;
}

export const MemoryReplayView: React.FC<MemoryReplayViewProps> = ({
  memories,
  onOpenWorkspace
}) => {
  const [selectedMemoryId, setSelectedMemoryId] = useState<string>(memories[0]?.id || 'MEM-101');
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [replayStep, setReplayStep] = useState<number>(0);

  const selectedMemory = memories.find(m => m.id === selectedMemoryId) || memories[0];

  const handleStartReplay = () => {
    setIsReplaying(true);
    setReplayStep(0);
  };

  const handleNextStep = () => {
    if (replayStep < 3) {
      setReplayStep(s => s + 1);
    } else {
      setIsReplaying(false);
      setReplayStep(0);
    }
  };

  const handlePrevStep = () => {
    if (replayStep > 0) setReplayStep(s => s - 1);
  };

  const replayStages = [
    {
      title: '1. The Initial Vulnerability / Code Incident',
      subtitle: 'A developer introduced a recurring pattern in pull request.',
      badge: 'Past PR Submission',
      codeSnippet: selectedMemory.incorrectExample,
      narrative: `During an earlier sprint, code matching this pattern was submitted by the team without automated validation. It bypassed initial manual peer review and risked causing outages or security leaks.`
    },
    {
      title: '2. Team Review & Architectural Consensus',
      subtitle: 'Senior reviewers debated and formulated a definitive resolution.',
      badge: 'Team Discussion',
      codeSnippet: `// Reviewer comment by ${selectedMemory.authorName}:\n// "We agreed as a team to standardize on this policy.\n// Let's create an automated memory rule to protect future pull requests."`,
      narrative: `${selectedMemory.authorName} flagged the issue and established clear team consensus. The decision was formally documented into the Hindsight memory lattice.`
    },
    {
      title: '3. Solidification into Hindsight Memory',
      subtitle: 'Rule registered as persistent team knowledge with high confidence.',
      badge: 'Hindsight Indexing',
      codeSnippet: selectedMemory.correctExample,
      narrative: `The approved fix pattern was ingested into MemoryCode. Hindsight indexed syntactic markers, AST patterns, and confidence weights so future reviews automatically catch this pattern.`
    },
    {
      title: '4. Continuous Prevention Across Repositories',
      subtitle: `Successfully prevented ${selectedMemory.preventedCount} times across subsequent PRs.`,
      badge: 'Automated Protection',
      codeSnippet: `// MemoryCode automatically intercepted similar PRs with ${selectedMemory.confidenceScore}% confidence.\n// Zero developer re-debate required.`,
      narrative: `Since creating ${selectedMemory.id}, MemoryCode has prevented this mistake ${selectedMemory.preventedCount} times across all repositories, saving hours of manual review cycles.`
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-800/40 text-violet-300 text-xs font-medium mb-2">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Decision Timeline</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Memory Replay</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Inspect the complete evolution of your engineering team's decisions. See how single review feedback moments evolved into permanent codebase protections.
          </p>
        </div>

        <button
          onClick={handleStartReplay}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 self-start md:self-auto active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Replay Selected Memory</span>
        </button>
      </div>

      {/* Horizontal Interactive Timeline Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">Evolution Timeline</span>
          <span className="text-cyan-400 font-mono text-[11px]">Click any memory node to inspect</span>
        </div>

        {/* Timeline Horizontal Scrollable Container */}
        <div className="overflow-x-auto pb-4 pt-2 no-scrollbar">
          <div className="flex items-center min-w-[850px] relative px-4">
            
            {/* Background connecting track line */}
            <div className="absolute left-6 right-6 top-6 h-0.5 bg-slate-800 -z-0" />

            {memories.slice(0, 7).map((mem, idx) => {
              const isSelected = mem.id === selectedMemoryId;
              return (
                <div key={mem.id} className="flex-1 flex flex-col items-center relative z-10">
                  
                  {/* Timeline Node Point */}
                  <button
                    onClick={() => {
                      setSelectedMemoryId(mem.id);
                      setIsReplaying(false);
                      setReplayStep(0);
                    }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 scale-110 ring-2 ring-cyan-400'
                        : 'bg-slate-950 text-slate-400 border border-slate-700 hover:border-cyan-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>

                  {/* Node Label Below */}
                  <div className="text-center mt-3 max-w-[110px]">
                    <span className="text-[10px] font-mono text-cyan-400 block font-semibold">
                      {mem.id}
                    </span>
                    <span className={`text-[11px] line-clamp-2 mt-0.5 leading-snug font-medium transition-colors ${
                      isSelected ? 'text-white font-semibold' : 'text-slate-400'
                    }`}>
                      {mem.title}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {mem.createdAt}
                    </span>
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Replay Interactive Player (if active) */}
      {isReplaying && (
        <div className="bg-gradient-to-b from-slate-900 to-indigo-950/40 border-2 border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-semibold">
                  {replayStages[replayStep].badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Step {replayStep + 1} of 4
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {replayStages[replayStep].title}
              </h3>
              <p className="text-xs text-slate-300">
                {replayStages[replayStep].subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                disabled={replayStep === 0}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>{replayStep === 3 ? 'Finish Replay' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsReplaying(false);
                  setReplayStep(0);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200"
                title="Close Replay"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-sm font-semibold text-white">Event Context & Narrative</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {replayStages[replayStep].narrative}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span>Origin Author: <span className="text-white font-medium">{selectedMemory.authorName}</span></span>
                <span>·</span>
                <span>Prevented: <span className="text-emerald-400 font-mono font-medium">{selectedMemory.preventedCount} times</span></span>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto">
              <div className="text-slate-500 text-[11px] mb-2">// Code snapshot at this stage</div>
              <pre className={replayStep === 0 ? 'text-rose-300' : 'text-emerald-300'}>
                {replayStages[replayStep].codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Selected Memory Detailed Inspection View */}
      {selectedMemory && !isReplaying && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Memory Specification */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold border border-slate-700">
                  {selectedMemory.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  selectedMemory.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                  selectedMemory.severity === 'High' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                  'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {selectedMemory.severity}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedMemory.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  {selectedMemory.confidenceScore}% Confidence
                </span>
                {selectedMemory.isActive ? (
                  <span className="text-xs text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Rule
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Archived</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {selectedMemory.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {selectedMemory.description}
              </p>
            </div>

            {/* Code Comparison (Incorrect vs Correct) */}
            <div className="space-y-3 pt-2">
              <div>
                <span className="text-xs font-semibold text-rose-400 block mb-1">
                  ✗ Incorrect Pattern (Violates Team Standard):
                </span>
                <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-3.5 font-mono text-xs text-rose-300 overflow-x-auto">
                  <pre>{selectedMemory.incorrectExample}</pre>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-400 block mb-1">
                  ✓ Correct Pattern (Adheres to Team Standard):
                </span>
                <div className="bg-slate-950 border border-emerald-900/40 rounded-xl p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <pre>{selectedMemory.correctExample}</pre>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                {selectedMemory.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[11px] font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={handleStartReplay}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Replay Evolution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Decision Precedent Feed */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Decision Precedent Feed</h4>
                <span className="text-xs text-cyan-400 font-mono">
                  {selectedMemory.preventedCount} issues prevented
                </span>
              </div>

              <div className="space-y-3">
                {selectedMemory.decisionHistory.map((h, i) => (
                  <div key={i} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{h.developerName}</span>
                      <span className="font-mono text-slate-500 text-[10px]">{h.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        h.action === 'strengthened' ? 'bg-emerald-950 text-emerald-300' :
                        h.action === 'rule_created' ? 'bg-indigo-950 text-indigo-300' :
                        h.action === 'accepted' ? 'bg-cyan-950 text-cyan-300' :
                        'bg-rose-950 text-rose-300'
                      }`}>
                        {h.action.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-[11px]">{h.reviewId}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {h.context}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenWorkspace}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Test this rule in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
