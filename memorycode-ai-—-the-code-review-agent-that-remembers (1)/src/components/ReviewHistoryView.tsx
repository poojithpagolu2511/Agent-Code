import React, { useState } from 'react';
import { 
  History, 
  GitPullRequest, 
  CheckCircle2, 
  ArrowRight, 
  FileCode, 
  Sparkles, 
  Clock, 
  Check, 
  X, 
  Columns, 
  Eye
} from 'lucide-react';
import { CodeReview } from '../types';

interface ReviewHistoryViewProps {
  reviews: CodeReview[];
  onSelectReview: (reviewId: string) => void;
}

export const ReviewHistoryView: React.FC<ReviewHistoryViewProps> = ({
  reviews,
  onSelectReview
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'then_vs_now'>('all');
  const [selectedReviewModal, setSelectedReviewModal] = useState<CodeReview | null>(null);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Review History & Audit Log</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track past code reviews, acceptance rates, and memory impact across all connected repositories.
          </p>
        </div>

        {/* View Switcher: All Reviews vs Then vs Now */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'all' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('then_vs_now')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'then_vs_now' ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-cyan-400" />
            <span>Then vs Now</span>
          </button>
        </div>
      </div>

      {/* "Then vs Now" Mode */}
      {activeTab === 'then_vs_now' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                  Longitudinal Comparison
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  How Auth Controller Code Evolved After Learning Rule MEM-101 & MEM-103
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-medium">
                +38 Points Quality Improvement
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Demonstrating the transformation in engineering habits. Sprint 1 code suffered from hardcoded credentials and non-standard database column casing. In Sprint 14, the team inherently avoided these pitfalls because MemoryCode reinforced the rules.
            </p>

            {/* Split Comparison Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
              
              {/* Sprint 1: Then */}
              <div className="bg-slate-950 border border-rose-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-rose-950/60 pb-2 text-xs">
                  <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                    <X className="w-4 h-4" /> THEN: Sprint 1 (Score: 58/100)
                  </span>
                  <span className="font-mono text-slate-500">March 2026</span>
                </div>
                
                <div className="font-mono text-xs text-rose-300 overflow-x-auto leading-relaxed">
                  <pre>{`// Controller with multiple recurring flaws
router.post('/login', async (req, res) => {
  var email = req.body.email;
  
  // Flaw 1: Hardcoded secret master key
  const API_KEY = "sec_live_908234820394820";

  // Flaw 2: Inconsistent camelCase DB column
  const user = await db.query(
    "SELECT userId, userEmail FROM users WHERE userId = $1", 
    [42]
  );
  
  res.json({ token: API_KEY, user });
});`}</pre>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-rose-300">Issues Flagged:</span> Hardcoded secret, var keyword, camelCase Postgres column in SQL query.
                </div>
              </div>

              {/* Sprint 14: Now */}
              <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2 text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> NOW: Sprint 14 (Score: 96/100)
                  </span>
                  <span className="font-mono text-slate-500">September 2026</span>
                </div>

                <div className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                  <pre>{`// Clean controller adhering to team memory
router.post('/login', async (req, res) => {
  const { email } = LoginSchema.parse(req.body);
  
  // Secret read safely from Secrets Manager
  const apiKey = config.auth.serviceKey;

  // Adheres to snake_case Postgres convention
  const user = await userService.findByUserId(
    req.user.user_id
  );
  
  res.json({ status: "success", user });
});`}</pre>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-emerald-300">Result:</span> Zero recurring mistakes. Code passed CI with immediate automated approval.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* All Reviews Table / Card View */}
      {activeTab === 'all' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-3.5 px-4">Review Title</th>
                  <th className="py-3.5 px-4">Repository</th>
                  <th className="py-3.5 px-4">Developer</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4 text-center">Issues</th>
                  <th className="py-3.5 px-4 text-center">Memory Impact</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reviews.map(rev => (
                  <tr 
                    key={rev.id}
                    onClick={() => setSelectedReviewModal(rev)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-100 max-w-[280px] truncate">
                      {rev.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {rev.repository}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {rev.author}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold text-xs ${
                        rev.score >= 90 ? 'text-emerald-400' : rev.score >= 75 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {rev.score}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300 tabular-nums">
                      {rev.suggestions.length}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-indigo-400 text-xs font-semibold tabular-nums">
                        {rev.memoryImpactCount} recalled
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {rev.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReviewModal(rev);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Details Inspection Modal */}
      {selectedReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedReviewModal.id}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedReviewModal.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Author: {selectedReviewModal.author}</span>
                  <span>·</span>
                  <span>Repo: {selectedReviewModal.repository}</span>
                  <span>·</span>
                  <span>Score: {selectedReviewModal.score}/100</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReviewModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Submitted Code</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre>{selectedReviewModal.code}</pre>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Review Suggestions ({selectedReviewModal.suggestions.length})
              </h4>
              {selectedReviewModal.suggestions.length === 0 ? (
                <p className="text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800">
                  ✓ Perfect review! No issues found.
                </p>
              ) : (
                selectedReviewModal.suggestions.map((s, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{s.title}</span>
                      <span className="font-mono text-cyan-400">{s.confidence}% conf</span>
                    </div>
                    <p className="text-slate-400">{s.problemExplanation}</p>
                    <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-300 text-[11px] overflow-x-auto">
                      <pre>{s.suggestedFix}</pre>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedReviewModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
