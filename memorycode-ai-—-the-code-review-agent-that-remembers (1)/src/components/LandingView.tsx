import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  GitPullRequest, 
  Clock, 
  Sparkles,
  Zap,
  Lock,
  Database,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { ReviewAnalytics, TeamMemory, CodeReview } from '../types';

interface LandingViewProps {
  analytics: ReviewAnalytics;
  memories: TeamMemory[];
  reviews: CodeReview[];
  onStartReview: () => void;
  onExploreMemory: () => void;
  onSelectReview: (reviewId: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  analytics,
  memories,
  reviews,
  onStartReview,
  onExploreMemory,
  onSelectReview
}) => {
  return (
    <div className="space-y-10 pb-16">
      
      {/* Privacy Notice Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Hindsight Local Memory Engine Active</span>
          <span className="text-slate-600">·</span>
          <span>Demo mode: Code is processed locally unless an AI provider is configured.</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-[#090d16] p-6 lg:p-12">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen PR Intelligence with Hindsight Memory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your codebase <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                has a memory.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Personalized code reviews that learn from every decision your team makes. 
              MemoryCode remembers past architectural choices, security mandates, and accepted PR fixes—so you never debate the same mistake twice.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartReview}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <Terminal className="w-4 h-4" />
                <span>Start a Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreMemory}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Explore Team Memory</span>
              </button>
            </div>

            {/* Quick Micro-stats */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block">Active Team Rules</span>
                <span className="text-white font-mono font-bold text-base tabular-nums">42 rules</span>
              </div>
              <div>
                <span className="text-slate-400 block">Recall Accuracy</span>
                <span className="text-cyan-400 font-mono font-bold text-base tabular-nums">99.4%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Avg. Review Time</span>
                <span className="text-white font-mono font-bold text-base tabular-nums">640ms</span>
              </div>
              <div>
                <span className="text-slate-400 block">Engine Version</span>
                <span className="text-slate-300 font-mono font-bold text-base">Hindsight v1</span>
              </div>
            </div>
          </div>

          {/* Hero Architecture Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950/80 shadow-2xl group">
              <img 
                src="/src/assets/images/memorycode_architecture_1790612303337.jpg" 
                alt="MemoryCode Architecture" 
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover opacity-80 group-hover:opacity-95 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                <span className="text-xs font-mono text-cyan-400 font-semibold">Hindsight Neural Lattice</span>
                <p className="text-xs text-slate-300 mt-1">
                  Persistent graph linking syntactic code patterns to historical PR approvals and reviewer preferences.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Primary Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Reviews Completed</span>
            <GitPullRequest className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {analytics.reviewsCompleted}
            </span>
            <span className="text-xs text-emerald-400 font-medium">100% automated</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Across 4 microservices repositories.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Team Memories Stored</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {memories.length}
            </span>
            <span className="text-xs text-indigo-300 font-medium">+3 this sprint</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Security policies, naming conventions, & architectural rules.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Recurring Mistakes Prevented</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {analytics.recurringMistakesPrevented}
            </span>
            <span className="text-xs text-emerald-400 font-medium font-mono tabular-nums">-64% bugs</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Detected before code reached staging CI.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Suggestion Acceptance</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {analytics.suggestionAcceptanceRate}%
            </span>
            <span className="text-xs text-teal-400 font-medium">high trust</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Developers accept suggestions because they recall team consensus.
          </p>
        </div>

      </section>

      {/* Memory Health & What Learned Today */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Memory Health Score */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Team Memory Health</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Alignment index between active PR reviews and established architectural standards.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                {analytics.memoryHealthScore}%
              </span>
              <span className="block text-[11px] text-emerald-400 font-medium">Optimal Status</span>
            </div>
          </div>

          {/* Breakdown Progress Bars */}
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Security & Secret Safety</span>
                <span className="font-mono text-slate-400 tabular-nums">{analytics.healthBreakdown.securitySafety}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${analytics.healthBreakdown.securitySafety}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Convention Consistency (Naming & Style)</span>
                <span className="font-mono text-slate-400 tabular-nums">{analytics.healthBreakdown.conventionConsistency}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${analytics.healthBreakdown.conventionConsistency}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Architectural Adherence (Service Boundaries)</span>
                <span className="font-mono text-slate-400 tabular-nums">{analytics.healthBreakdown.architecturalAdherence}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${analytics.healthBreakdown.architecturalAdherence}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Test Assertion Quality</span>
                <span className="font-mono text-slate-400 tabular-nums">{analytics.healthBreakdown.testCoverage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-violet-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${analytics.healthBreakdown.testCoverage}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* What MemoryCode Learned Today */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>What MemoryCode Learned Today</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Rule MEM-114 Strengthened
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Elena Rostova accepted a recommendation requiring <span className="font-mono text-cyan-300">Idempotency-Key</span> headers 
              on mutating payment POST operations. The agent reinforced this rule with 
              <span className="text-emerald-400 font-mono font-medium"> 98% confidence</span> across the payments-gateway repository.
            </p>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300">
              <span className="text-slate-500">// Learned pattern:</span>
              <div className="text-cyan-300 mt-1">
                + stripe.charges.create(params, &#123; idempotencyKey &#125;)
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Confidence gain: <span className="text-emerald-400 font-mono">+4%</span></span>
            <button
              onClick={onExploreMemory}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View in Replay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* Decision Loop Architecture Visual */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">The Continuous Decision Loop</h2>
            <p className="text-xs text-slate-400">How MemoryCode evolves from passive linting to team-aligned intelligence.</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-800/40">
            Hindsight Closed-Loop Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 relative">
            <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold mb-3">
              01
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Code Review</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developer submits PR. Agent parses AST and checks security, performance, & naming.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 relative">
            <div className="w-7 h-7 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold mb-3">
              02
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Developer Decision</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineer accepts, edits, or rejects suggestion with contextual rationale.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 relative">
            <div className="w-7 h-7 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-400 font-mono text-xs flex items-center justify-center font-bold mb-3">
              03
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Memory Update</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hindsight memory layer updates rule confidence weights and records precedent.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 relative">
            <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs flex items-center justify-center font-bold mb-3">
              04
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Smarter Future Review</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subsequent code reviews cite previous team decisions. Zero repetitive debates.
            </p>
          </div>

        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">Recent Team Review Events</h2>
          </div>
          <span className="text-xs text-slate-400">Live memory activity</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {reviews.slice(0, 3).map(rev => (
            <div 
              key={rev.id} 
              onClick={() => onSelectReview(rev.id)}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-100 hover:text-cyan-300 transition-colors">
                    {rev.title}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    {rev.repository}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Author: {rev.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rev.createdAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-400 font-mono">{rev.memoryImpactCount} memories recalled</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className={`text-sm font-mono font-bold ${
                    rev.score >= 90 ? 'text-emerald-400' : rev.score >= 75 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {rev.score}/100
                  </span>
                  <span className="block text-[10px] text-slate-500">Quality score</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
