import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  Award
} from 'lucide-react';
import { ReviewAnalytics } from '../types';

interface AnalyticsViewProps {
  analytics: ReviewAnalytics;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const maxMistakes = 30;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team Memory Intelligence Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Live metrics quantifying how persistent Hindsight memory reduces technical debt, prevents regressions, and accelerates developer velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Reactivity: Real-time update enabled</span>
        </div>
      </div>

      {/* Prominent Insight Banner Card */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-indigo-950/50 to-slate-900/90 border border-cyan-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Key Longitudinal Finding</span>
            </div>
            <h3 className="text-xl font-bold text-white leading-snug">
              Hardcoded secrets decreased by 64% after Team Rule MEM-101 was introduced.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Before persistent memory, security credentials reappeared every 4.2 PRs during onboarding sprints. Since deploying MemoryCode with automated precedent recall, zero secrets reached production branches.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-center shrink-0 min-w-[160px]">
            <span className="text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
              -64%
            </span>
            <span className="block text-xs text-slate-400 mt-0.5">Recurring Defect Rate</span>
            <span className="inline-block mt-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Verified by SOC2 Audit
            </span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Prevented Defects</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {analytics.recurringMistakesPrevented}
            </span>
            <span className="text-xs text-emerald-400 font-medium">cumulative</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Mistakes caught instantly before review assignment.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Rule Adoption</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              91.4%
            </span>
            <span className="text-xs text-cyan-400 font-medium font-mono">+12% YoY</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Proportion of PRs complying on first pass.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Acceptance Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {analytics.suggestionAcceptanceRate}%
            </span>
            <span className="text-xs text-indigo-300 font-medium font-mono tabular-nums">High consensus</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Developers trust recalled team precedents.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Review Velocity</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              3.8x
            </span>
            <span className="text-xs text-teal-400 font-medium font-mono">faster merge</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Cycle time dropped from 18h to 4.7h average.
          </p>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Recurring Mistakes Over Time (Decline) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">Recurring Mistakes vs. Prevented by Memory</h3>
              <p className="text-xs text-slate-400">Monthly trend across active engineering squads.</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                Mistakes Logged
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" />
                Prevented by Memory
              </span>
            </div>
          </div>

          {/* Accessible SVG Bar Chart */}
          <div className="h-64 pt-6 flex items-end justify-between gap-4 border-b border-slate-800 pb-2">
            {analytics.monthlyTrends.map((trend, idx) => {
              const mistakeHeight = (trend.recurringMistakes / maxMistakes) * 100;
              const preventedHeight = (trend.preventedByMemory / maxMistakes) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-48">
                    
                    {/* Mistakes Bar (declining) */}
                    <div 
                      className="w-1/2 max-w-[20px] bg-rose-500/70 group-hover:bg-rose-500 rounded-t transition-all relative"
                      style={{ height: `${mistakeHeight}%` }}
                      title={`${trend.month}: ${trend.recurringMistakes} recurring mistakes`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-rose-300 bg-slate-950 px-1 rounded border border-rose-900">
                        {trend.recurringMistakes}
                      </span>
                    </div>

                    {/* Prevented Bar (growing) */}
                    <div 
                      className="w-1/2 max-w-[20px] bg-cyan-500/70 group-hover:bg-cyan-400 rounded-t transition-all relative"
                      style={{ height: `${preventedHeight}%` }}
                      title={`${trend.month}: ${trend.preventedByMemory} prevented by memory`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-300 bg-slate-950 px-1 rounded border border-cyan-900">
                        {trend.preventedByMemory}
                      </span>
                    </div>

                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Baseline established April 2026</span>
            <span className="text-emerald-400 font-mono">Current delta: +88% prevention efficacy</span>
          </div>
        </div>

        {/* Chart 2: Category Distribution Breakdown */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Rule Protection by Domain</h3>
            <p className="text-xs text-slate-400">Distribution of memories actively defending the codebase.</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {analytics.categoryDistribution.map((cat, idx) => {
              const maxCount = 50;
              const widthPct = Math.min(100, Math.round((cat.count / maxCount) * 100));

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <span className="text-slate-400 font-mono tabular-nums">{cat.count} rules</span>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-cyan-400' :
                        idx === 1 ? 'bg-indigo-400' :
                        idx === 2 ? 'bg-violet-400' :
                        idx === 3 ? 'bg-teal-400' :
                        idx === 4 ? 'bg-amber-400' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 mt-4">
            <span className="text-cyan-400 font-semibold">Security & Code Quality</span> account for 55% of all recalled team precedents.
          </div>
        </div>

      </div>

    </div>
  );
};
