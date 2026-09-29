import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  MessageSquare, 
  Mail, 
  Send, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use the live shared deployment URL or current origin
  const defaultShareUrl = 'https://ais-pre-kivugknsb32viicimku6ab-1977474078.asia-east1.run.app';
  const currentUrl = typeof window !== 'undefined' && window.location.href.startsWith('http') 
    ? window.location.href 
    : defaultShareUrl;

  const shareTitle = 'MemoryCode AI — The Code Review Agent That Remembers';
  const shareText = 'Check out MemoryCode AI: An AI-powered code review agent with persistent team memory!';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + currentUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\nLink: ' + currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0b101b] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 border-b border-slate-800/80 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Share With Your Friend
              </h3>
              <p className="text-xs text-slate-400">
                Share MemoryCode AI live web preview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Preview Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MemoryCode AI · Persistent Team Memory</span>
            </div>
            <p className="text-sm font-bold text-white">
              The Code Review Agent That Remembers
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalized code reviews that learn from every decision your team makes, with real-time error detection and language compilation guard.
            </p>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Website Share Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono select-all overflow-x-auto whitespace-nowrap">
                {currentUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                Link copied to clipboard! You can now paste and send it to your friend.
              </p>
            )}
          </div>

          {/* 1-Click Quick Share Buttons */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-400 block">
              Send Directly Via:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs font-medium transition-all group hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 text-sky-300 text-xs font-medium transition-all group hover:scale-[1.02]"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram</span>
              </a>

              {/* Twitter / X */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all group hover:scale-[1.02]"
              >
                <Share2 className="w-4 h-4 text-slate-300" />
                <span>Twitter / X</span>
              </a>

              {/* Email */}
              <a
                href={emailUrl}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-violet-950/40 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 text-xs font-medium transition-all group hover:scale-[1.02]"
              >
                <Mail className="w-4 h-4 text-violet-400" />
                <span>Email</span>
              </a>

            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-400">
            <Smartphone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Your friend can open this URL on mobile or desktop without any login or installation. All code reviews, AI error detection, and memory simulations work instantly.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
