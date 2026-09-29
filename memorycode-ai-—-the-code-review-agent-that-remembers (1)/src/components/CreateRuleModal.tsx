import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Tag } from 'lucide-react';
import { Category, Severity } from '../types';
import { CreateRuleInput } from '../services/HindsightMemoryService';

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateRuleInput) => void;
}

export const CreateRuleModal: React.FC<CreateRuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Security');
  const [severity, setSeverity] = useState<Severity>('High');
  const [correctExample, setCorrectExample] = useState('');
  const [incorrectExample, setIncorrectExample] = useState('');
  const [authorName, setAuthorName] = useState('Alex Chen');
  const [tagsStr, setTagsStr] = useState('standards, team-mandate');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    onSubmit({
      title,
      description,
      category,
      severity,
      correctExample: correctExample.trim() || '// Correct example implementation',
      incorrectExample: incorrectExample.trim() || '// Anti-pattern example to avoid',
      authorId: 'dev-current',
      authorName,
      tags
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Team Rule</h3>
              <p className="text-xs text-slate-400">Register a new coding mandate in Hindsight memory</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Rule Title */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Rule Title / Mandate</label>
            <input
              type="text"
              required
              placeholder="e.g. Always use parameterized queries for SQL operations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Description & Rationale</label>
            <textarea
              required
              rows={3}
              placeholder="Explain why this rule matters and what recurring issues it prevents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              >
                <option value="Security">Security</option>
                <option value="Quality">Quality</option>
                <option value="Architecture">Architecture</option>
                <option value="Naming Convention">Naming Convention</option>
                <option value="Performance">Performance</option>
                <option value="Testing">Testing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Code Examples */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-emerald-400 font-semibold block">✓ Correct Code Example</label>
              <textarea
                rows={3}
                placeholder="const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);"
                value={correctExample}
                onChange={(e) => setCorrectExample(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-900/40 font-mono text-emerald-300 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-rose-400 font-semibold block">✗ Incorrect Code Example</label>
              <textarea
                rows={3}
                placeholder="const user = await db.query('SELECT * FROM users WHERE id = ' + userId);"
                value={incorrectExample}
                onChange={(e) => setIncorrectExample(e.target.value)}
                className="w-full bg-slate-950 border border-rose-900/40 font-mono text-rose-300 rounded-lg p-2.5 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          {/* Author & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="postgres, sql, security"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md shadow-cyan-950 transition-all text-xs"
            >
              Save Rule to Hindsight
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
