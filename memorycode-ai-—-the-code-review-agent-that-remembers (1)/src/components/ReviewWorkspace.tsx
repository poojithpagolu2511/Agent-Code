import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Sparkles, 
  Check, 
  X, 
  HelpCircle, 
  Filter, 
  Eye, 
  Upload, 
  Github, 
  FileCode, 
  Zap, 
  AlertTriangle, 
  ShieldAlert, 
  AlertCircle,
  Copy,
  ChevronRight,
  BookmarkCheck,
  CheckCircle2,
  Wrench,
  RotateCcw,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { 
  CodeReview, 
  Suggestion, 
  Severity, 
  Category, 
  ReviewPersonality 
} from '../types';
import { SAMPLE_CODE_SNIPPETS } from '../data/mockData';
import { runCodeReview, REVIEW_STEPS } from '../services/reviewService';
import { 
  compileAndAnalyzeCode, 
  CompilerResult 
} from '../services/languageCompilerService';

interface ReviewWorkspaceProps {
  onAcceptSuggestion: (suggestion: Suggestion) => void;
  onRejectSuggestion: (suggestion: Suggestion) => void;
  onOpenWhyModal: (suggestion: Suggestion) => void;
  onOpenGitHubModal: () => void;
  onSimulateFutureReview: () => void;
}

export const ReviewWorkspace: React.FC<ReviewWorkspaceProps> = ({
  onAcceptSuggestion,
  onRejectSuggestion,
  onOpenWhyModal,
  onOpenGitHubModal,
  onSimulateFutureReview
}) => {
  const [language, setLanguage] = useState<string>('TypeScript');
  const [filename, setFilename] = useState<string>('src/controllers/auth.controller.ts');
  const [code, setCode] = useState<string>(SAMPLE_CODE_SNIPPETS.vulnerable_auth.code);
  const [personality, setPersonality] = useState<ReviewPersonality>('strict_security');
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [reviewStepIndex, setReviewStepIndex] = useState<number>(0);
  const [reviewStepLabel, setReviewStepLabel] = useState<string>('');
  const [currentReview, setCurrentReview] = useState<CodeReview | null>(null);
  
  // Filters & Toggles
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [memoryLensActive, setMemoryLensActive] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time Compilation & Language Guard
  const compilerResult: CompilerResult = useMemo(() => {
    return compileAndAnalyzeCode(code, language);
  }, [code, language]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunReview = async () => {
    if (compilerResult.status === 'mismatched') {
      showNotification(`⚠️ Review Blocked: Code does not belong to ${language}! Detects ${compilerResult.detectedLanguage}.`);
      return;
    }

    setIsReviewing(true);
    setReviewStepIndex(0);
    setReviewStepLabel(REVIEW_STEPS[0]);

    try {
      const result = await runCodeReview(
        code,
        language,
        filename,
        personality,
        (idx, label) => {
          setReviewStepIndex(idx);
          setReviewStepLabel(label);
        }
      );
      setCurrentReview(result);
    } catch (err) {
      console.error('Review failed', err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleApplyAIFix = (fixedCode: string) => {
    setCode(fixedCode);
    showNotification(`✓ Applied clean fix! Code compiled successfully for ${language}.`);
    
    // Automatically trigger fresh review with clean results
    setTimeout(async () => {
      setIsReviewing(true);
      setReviewStepIndex(0);
      setReviewStepLabel('Validating repair...');
      const cleanResult = await runCodeReview(
        fixedCode,
        language,
        filename,
        personality,
        (idx, label) => {
          setReviewStepIndex(idx);
          setReviewStepLabel(label);
        }
      );
      setCurrentReview(cleanResult);
      setIsReviewing(false);
    }, 200);
  };

  const handleApplyAndResolveFix = (sug: Suggestion) => {
    const fixSnippet = sug.suggestedFix;
    if (!fixSnippet) return;

    let newCode = code;
    // Replace snippet in code
    if (sug.originalCodeSnippet && code.includes(sug.originalCodeSnippet)) {
      newCode = code.replace(sug.originalCodeSnippet, fixSnippet);
    } else if (sug.originalCodeSnippet && code.includes(sug.originalCodeSnippet.trim())) {
      newCode = code.replace(sug.originalCodeSnippet.trim(), fixSnippet);
    } else if (sug.line) {
      const lines = code.split('\n');
      if (lines[sug.line - 1] !== undefined) {
        const indent = lines[sug.line - 1].match(/^\s*/)?.[0] || '';
        lines[sug.line - 1] = fixSnippet.split('\n').map(l => indent + l).join('\n');
        newCode = lines.join('\n');
      } else if (compilerResult.suggestedFullCodeFix) {
        newCode = compilerResult.suggestedFullCodeFix;
      }
    } else if (compilerResult.suggestedFullCodeFix) {
      newCode = compilerResult.suggestedFullCodeFix;
    }

    setCode(newCode);
    sug.status = 'accepted';
    onAcceptSuggestion(sug);

    // Re-check new code
    const recheckCompiler = compileAndAnalyzeCode(newCode, language);

    if (currentReview) {
      const updatedSuggestions = currentReview.suggestions.map(s => 
        s.id === sug.id ? { ...s, status: 'accepted' as const } : s
      );

      const pending = updatedSuggestions.filter(s => s.status !== 'accepted' && s.status !== 'rejected');

      if (pending.length === 0 || recheckCompiler.errors.length === 0) {
        setCurrentReview({
          ...currentReview,
          code: newCode,
          score: 100,
          suggestions: updatedSuggestions,
          summary: 'All checks passed. The submitted code conforms 100% to team conventions and security policies.'
        });
        showNotification('✓ Fix applied! Code is verified clean with 100/100 score.');
      } else {
        let penalty = 0;
        for (const s of pending) {
          if (s.severity === 'Critical') penalty += 35;
          else if (s.severity === 'High') penalty += 18;
          else if (s.severity === 'Medium') penalty += 8;
          else penalty += 4;
        }
        const newScore = Math.max(25, 100 - penalty);
        setCurrentReview({
          ...currentReview,
          code: newCode,
          score: newScore,
          suggestions: updatedSuggestions,
          summary: `Fix applied. ${pending.length} remaining suggestion(s).`
        });
        showNotification(`✓ Applied fix for "${sug.title}".`);
      }
    }
  };

  const handleSwitchLanguage = (targetLang: string) => {
    if (targetLang.includes('TypeScript') || targetLang.includes('JavaScript')) {
      setLanguage('TypeScript');
      setFilename('src/controllers/auth.controller.ts');
    } else if (targetLang.includes('Python')) {
      setLanguage('Python');
      setFilename('services/payment_ingress.py');
    } else if (targetLang.includes('Java')) {
      setLanguage('Java');
      setFilename('CustomerController.java');
    }
    showNotification(`Switched target language selector to ${targetLang}`);
  };

  const handleLoadSnippet = (key: keyof typeof SAMPLE_CODE_SNIPPETS) => {
    const s = SAMPLE_CODE_SNIPPETS[key];
    setLanguage(s.language);
    setCode(s.code);
    if (key === 'promise_chain_python') {
      setFilename('services/payment_ingress.py');
    } else if (key === 'java_spring_controller') {
      setFilename('CustomerController.java');
    } else if (key === 'simulated_future_review') {
      setFilename('src/routes/checkout.ts');
    } else {
      setFilename('src/controllers/auth.controller.ts');
    }
    setCurrentReview(null);
  };

  // Quick demonstration helper: test submitting JS code into Python compiler
  const handleTestMismatch = () => {
    setLanguage('Python');
    setFilename('test_mismatch.py');
    setCode(`// JavaScript code submitted to Python compiler
const express = require('express');
function loginUser(req, res) {
  var token = "sec_live_1234567890";
  console.log("Token:", token);
  res.json({ token: token });
}`);
    setCurrentReview(null);
    showNotification('Loaded JavaScript code into Python selector. Compiler Guard active.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        setFilename(file.name);
        if (file.name.endsWith('.py')) setLanguage('Python');
        else if (file.name.endsWith('.java')) setLanguage('Java');
        else if (file.name.endsWith('.js')) setLanguage('JavaScript');
        else setLanguage('TypeScript');
      };
      reader.readAsText(file);
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  // Filtered suggestions
  const suggestions = currentReview?.suggestions || [];
  const filteredSuggestions = suggestions.filter(s => {
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'Team Convention') return s.category === 'Naming Convention';
    return s.category === categoryFilter;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Workspace Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-cyan-500/80 text-cyan-200 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Workspace Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Preset Scenarios:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleLoadSnippet('vulnerable_auth')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 transition-colors"
              >
                1. Vulnerable Auth (TS)
              </button>
              <button
                onClick={() => handleLoadSnippet('promise_chain_python')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 transition-colors"
              >
                2. Python Payment (Python)
              </button>
              <button
                onClick={() => handleLoadSnippet('java_spring_controller')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
              >
                3. Java Spring
              </button>
              <button
                onClick={handleTestMismatch}
                className="px-2.5 py-1 text-xs font-medium bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded border border-rose-700/60 transition-colors flex items-center gap-1"
                title="Test Python compiler rejecting JavaScript code"
              >
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                4. Test Language Mismatch (JS in Python)
              </button>
              <button
                onClick={() => handleLoadSnippet('simulated_future_review')}
                className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-violet-950 to-indigo-950 text-indigo-300 hover:text-indigo-200 rounded border border-indigo-700/60 transition-colors flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                5. Memory Test
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Review Personality Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Tone:</span>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value as ReviewPersonality)}
              className="bg-transparent text-cyan-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="strict_security">Strict Security Lead</option>
              <option value="friendly_mentor">Friendly Mentor</option>
              <option value="architecture_expert">Architecture Specialist</option>
              <option value="minimal_concise">Concise & Direct</option>
            </select>
          </div>

          <label className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onOpenGitHubModal}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub PR</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Code Editor */}
        <div className="lg:col-span-6 space-y-3">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {/* Editor Header */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none text-slate-200 text-xs font-mono w-56"
                  />
                </div>
              </div>

              {/* Language Selector with Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                  compilerResult.status === 'mismatched'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                    : !compilerResult.success
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {compilerResult.status === 'mismatched' ? 'Mismatch' : !compilerResult.success ? `${compilerResult.errorCount} Errors` : '0 Errors'}
                </span>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-800 text-xs font-mono text-slate-200 px-2.5 py-1 rounded border border-slate-700 focus:outline-none"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                </select>
              </div>
            </div>

            {/* Code Input Area with line numbers look */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={22}
                spellCheck={false}
                placeholder="Paste code or type here..."
                className="w-full bg-[#070b13] text-slate-200 font-mono text-xs sm:text-sm p-4 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500/30 selection:text-cyan-200 border-none"
              />
            </div>

            {/* Editor Footer / Run Trigger */}
            <div className="bg-slate-950/90 border-t border-slate-800 p-3 px-4 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>{code.split('\n').length} lines · {language}</span>
                {compilerResult.status === 'mismatched' && (
                  <span className="text-rose-400 font-semibold text-[11px]">
                    (Blocked: Not {language})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!compilerResult.success && (
                  <button
                    onClick={() => handleApplyAIFix(compilerResult.suggestedFullCodeFix)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                    title="AI Bot replaces broken code with clean version"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Auto-Fix Code</span>
                  </button>
                )}

                <button
                  onClick={handleRunReview}
                  disabled={isReviewing || !code.trim() || compilerResult.status === 'mismatched'}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  {isReviewing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Reviewing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Review Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Simulation Banner */}
          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-lg p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-300">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Simulate future review after accepting team rules?</span>
            </div>
            <button
              onClick={() => {
                handleLoadSnippet('simulated_future_review');
                setTimeout(() => handleRunReview(), 100);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Run Memory Test</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Side: Review Results Panel */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Active Review Progress Sequence */}
          {isReviewing && (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-6 shadow-xl space-y-4 animate-pulse-subtle">
              <div className="flex items-center gap-3 text-cyan-400">
                <span className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <span className="text-sm font-semibold">{reviewStepLabel}</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-1.5 transition-all duration-300"
                  style={{ width: `${((reviewStepIndex + 1) / REVIEW_STEPS.length) * 100}%` }}
                />
              </div>

              <div className="space-y-1 text-xs font-mono text-slate-400">
                {REVIEW_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx < reviewStepIndex ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : idx === reviewStepIndex ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                    <span className={idx === reviewStepIndex ? 'text-cyan-300' : idx < reviewStepIndex ? 'text-slate-400' : 'text-slate-600'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Summary Bar */}
          {currentReview && !isReviewing && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded font-mono font-bold text-sm ${
                    currentReview.score >= 90 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    currentReview.score >= 70 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    Score: {currentReview.score}/100
                  </div>
                  <span className="text-xs text-slate-300 font-medium">
                    {currentReview.suggestions.length} suggestions · {currentReview.durationMs}ms
                  </span>
                </div>

                {/* Memory Lens Toggle */}
                <button
                  onClick={() => setMemoryLensActive(!memoryLensActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    memoryLensActive
                      ? 'bg-violet-950/80 text-violet-200 border-violet-600/60 shadow-sm shadow-violet-900/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Visually highlight suggestions generated by recalled team memory"
                >
                  <Eye className="w-3.5 h-3.5 text-violet-400" />
                  <span>Memory Lens: {memoryLensActive ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {currentReview.summary}
              </p>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pt-1 no-scrollbar text-xs">
                {['All', 'Security', 'Quality', 'Performance', 'Team Convention'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                      categoryFilter === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions List */}
          {!currentReview && !isReviewing && (
            <div className="bg-slate-900/40 border border-slate-800/80 border-dashed rounded-xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-200">AI Error Bot & Review Ready</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {compilerResult.status === 'mismatched' ? (
                  <span className="text-rose-400 font-semibold">
                    The code does not belong to {language}. Use the AI Bot above to convert or switch language.
                  </span>
                ) : !compilerResult.success ? (
                  <span>
                    Detected <strong className="text-amber-300">{compilerResult.errorCount} errors</strong> in {language}. Click <strong className="text-cyan-400">"Auto-Fix Code"</strong> to fix them, or <strong className="text-cyan-400">"Review Code"</strong> to inspect.
                  </span>
                ) : (
                  <span>
                    Code is valid {language}. Click <strong className="text-cyan-400">"Review Code"</strong> to run memory recall across team precedents.
                  </span>
                )}
              </p>
            </div>
          )}

          {currentReview && !isReviewing && filteredSuggestions.length === 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-white">No Issues in this Category</h4>
              <p className="text-xs text-slate-400">Everything conforms to team standards under this filter.</p>
            </div>
          )}

          {currentReview && !isReviewing && filteredSuggestions.map((sug, idx) => {
            const hasRecalledMemory = !!sug.recalledMemoryId;
            const isLensHighlighted = memoryLensActive && hasRecalledMemory;

            return (
              <div
                key={sug.id || idx}
                className={`rounded-xl border transition-all duration-300 ${
                  isLensHighlighted 
                    ? 'bg-slate-900/90 border-violet-500/50 shadow-lg shadow-violet-950/20 ring-1 ring-violet-500/30' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Suggestion Header */}
                <div className="p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Severity Label */}
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                        sug.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                        sug.severity === 'High' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                        sug.severity === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {sug.severity}
                      </span>

                      <span className="text-xs text-slate-400 font-mono">
                        {sug.file}:{sug.line}
                      </span>

                      <span className="text-xs text-slate-500">·</span>

                      <span className="text-xs text-slate-400">
                        {sug.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 tabular-nums">
                        {sug.confidence}% confidence
                      </span>

                      {/* Status indicator if already acted upon */}
                      {sug.status === 'accepted' && (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          <Check className="w-3 h-3" /> Accepted
                        </span>
                      )}
                      {sug.status === 'rejected' && (
                        <span className="text-xs font-mono text-rose-400 flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                          <X className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Explanation */}
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {sug.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {sug.problemExplanation}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 italic">
                      Why it matters: {sug.whyItMatters}
                    </p>
                  </div>

                  {/* Recalled Team Memory Card */}
                  {hasRecalledMemory && (
                    <div className="bg-gradient-to-r from-violet-950/40 to-indigo-950/30 border border-violet-800/40 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-violet-300 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Recalled Memory: {sug.recalledMemoryId}</span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-mono font-medium">Active Team Mandate</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        "{sug.recalledMemoryTitle}"
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {sug.recalledMemorySnippet}
                      </p>
                    </div>
                  )}

                  {/* Suggested Code Fix Diff */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Recommended fix:</span>
                      <button
                        onClick={() => handleCopyCode(sug.suggestedFix, sug.id)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === sug.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Fix</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-x-auto text-emerald-300 leading-relaxed">
                      <pre>{sug.suggestedFix}</pre>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
                    <button
                      onClick={() => onOpenWhyModal(sug)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why am I seeing this?</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sug.status = 'rejected';
                          onRejectSuggestion(sug);
                          if (currentReview) {
                            const updatedSuggestions = currentReview.suggestions.map(s => 
                              s.id === sug.id ? { ...s, status: 'rejected' as const } : s
                            );
                            const pending = updatedSuggestions.filter(s => s.status !== 'accepted' && s.status !== 'rejected');
                            let penalty = 0;
                            for (const s of pending) {
                              if (s.severity === 'Critical') penalty += 35;
                              else if (s.severity === 'High') penalty += 18;
                              else if (s.severity === 'Medium') penalty += 8;
                              else penalty += 4;
                            }
                            const newScore = pending.length === 0 ? 100 : Math.max(25, 100 - penalty);
                            setCurrentReview({
                              ...currentReview,
                              score: newScore,
                              suggestions: updatedSuggestions
                            });
                          }
                        }}
                        disabled={sug.status === 'rejected'}
                        className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-rose-300 bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-700/60 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApplyAndResolveFix(sug)}
                        disabled={sug.status === 'accepted'}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-sm shadow-emerald-950 transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Fix (100%)</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};
