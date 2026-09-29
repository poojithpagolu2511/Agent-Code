import React, { useState } from 'react';
import { X, Github, GitPullRequest, GitBranch, Check, ExternalLink } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPR: (repo: string, prNumber: number, branch: string) => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  onImportPR
}) => {
  const [selectedRepo, setSelectedRepo] = useState('payments-gateway');
  const [selectedPR, setSelectedPR] = useState(142);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const mockPRs = [
    { number: 142, repo: 'payments-gateway', title: 'feat: Add Stripe Webhook listener & auth verify', branch: 'feat/stripe-webhooks', author: 'Elena Rostova' },
    { number: 89, repo: 'core-auth-service', title: 'fix: SQL string concatenation in login handler', branch: 'fix/login-query', author: 'Alex Chen' },
    { number: 64, repo: 'cloud-pipeline-worker', title: 'refactor: Move loop queries to bulk batching', branch: 'refactor/inventory-sync', author: 'David Kim' }
  ];

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onImportPR(selectedRepo, selectedPR, 'feat/stripe-webhooks');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Connect GitHub Pull Request</h3>
              <p className="text-xs text-slate-400">Zero authentication required for competition demo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PR Selector */}
        <div className="space-y-3 text-xs">
          <label className="text-slate-300 font-semibold block">Select Pull Request from Active Repositories:</label>
          
          <div className="space-y-2">
            {mockPRs.map(pr => (
              <div
                key={pr.number}
                onClick={() => {
                  setSelectedRepo(pr.repo);
                  setSelectedPR(pr.number);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedPR === pr.number
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">#{pr.number} · {pr.title}</span>
                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    {pr.repo}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px] mt-1.5">
                  <span className="flex items-center gap-1 font-mono">
                    <GitBranch className="w-3 h-3 text-slate-500" />
                    {pr.branch}
                  </span>
                  <span>·</span>
                  <span>By {pr.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md shadow-cyan-950 transition-all flex items-center gap-1.5"
          >
            {isLoading ? (
              <span>Importing Diff...</span>
            ) : (
              <>
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>Import PR #{selectedPR}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
