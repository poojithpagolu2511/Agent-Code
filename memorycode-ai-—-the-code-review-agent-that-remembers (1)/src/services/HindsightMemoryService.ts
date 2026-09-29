import { TeamMemory, Category, Severity } from '../types';
import { INITIAL_MEMORIES } from '../data/mockData';

export interface MemoryRecallResult {
  memory: TeamMemory;
  relevanceScore: number; // 0 - 100
  matchedKeywords: string[];
  recalledSnippet: string;
  source?: 'hindsight-cloud' | 'local-heuristic';
}

export interface CreateRuleInput {
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  correctExample: string;
  incorrectExample: string;
  authorId: string;
  authorName: string;
  tags: string[];
}

export interface HindsightStatus {
  configured: boolean;
  connected: boolean;
  bankId: string;
  baseUrl: string;
  version?: string;
  message?: string;
}

const STORAGE_KEY = 'memorycode_hindsight_memories_v1';

/**
 * HindsightMemoryService provides persistent memory extraction, indexing,
 * recall, and reinforcement across code reviews.
 * 
 * PRIMARY: Real Hindsight through the secure server route /api/hindsight/*.
 * FALLBACK: In-browser local vector-heuristic memory engine.
 * 
 * Never exposes the Hindsight API key to browser/frontend code.
 */
class HindsightMemoryService {
  private memories: TeamMemory[] = [];
  private isConnectedToLiveHindsight = false;
  private isConfiguredOnServer = false;
  private liveBankId = 'memorycode-team-rules';
  private hasCheckedStatus = false;

  constructor() {
    this.loadFromStorage();
    // Non-blocking initial connectivity check
    this.checkLiveStatus().catch(() => {});
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.memories = JSON.parse(stored);
      } else {
        this.memories = [...INITIAL_MEMORIES];
        this.saveToStorage();
      }
    } catch {
      this.memories = [...INITIAL_MEMORIES];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memories));
    } catch (e) {
      console.warn('Could not save memories to localStorage:', e);
    }
  }

  /**
   * Check connection status to server-side Hindsight
   */
  public async checkLiveStatus(): Promise<HindsightStatus> {
    try {
      const res = await fetch('/api/hindsight/status');
      if (res.ok) {
        const data: HindsightStatus = await res.json();
        this.isConnectedToLiveHindsight = Boolean(data.connected);
        this.isConfiguredOnServer = Boolean(data.configured);
        if (data.bankId) {
          this.liveBankId = data.bankId;
        }
        this.hasCheckedStatus = true;
        return data;
      }
    } catch {
      // Server route unreachable or offline
    }

    this.isConnectedToLiveHindsight = false;
    this.hasCheckedStatus = true;
    return {
      configured: false,
      connected: false,
      bankId: this.liveBankId,
      baseUrl: 'https://api.hindsight.vectorize.io',
      message: 'Local fallback active'
    };
  }

  public isLiveApiConnected(): boolean {
    return this.isConnectedToLiveHindsight;
  }

  public getBankId(): string {
    return this.liveBankId;
  }

  public getAllMemories(): TeamMemory[] {
    return [...this.memories];
  }

  public getMemoryById(id: string): TeamMemory | undefined {
    return this.memories.find(m => m.id === id);
  }

  /**
   * Recall relevant memories for a code snippet.
   * 
   * PRIMARY: Calls real Hindsight RECALL (/api/hindsight/recall).
   * FALLBACK: Local vector-heuristic pattern matching engine.
   */
  public async recallMemories(code: string, language: string): Promise<MemoryRecallResult[]> {
    // 1. PRIMARY: Try real Hindsight RECALL via server
    try {
      const query = `Code review for ${language}: Identify team rules, conventions, security guidelines, and past decisions for:\n${code.slice(0, 2000)}`;

      const res = await fetch('/api/hindsight/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          bankId: this.liveBankId,
          tags: [language.toLowerCase()],
          maxTokens: 4096
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.results) && data.results.length > 0) {
          this.isConnectedToLiveHindsight = true;
          
          // Map Hindsight results to MemoryRecallResult format
          const hindsightResults: MemoryRecallResult[] = data.results.map((r: any, idx: number) => {
            const ruleId = r.metadata?.ruleId || r.metadata?.id;
            const existingMem = this.memories.find(m => m.id === ruleId || m.title === r.text);

            const memory: TeamMemory = existingMem ? { ...existingMem } : {
              id: ruleId || `HS-MEM-${r.id ? String(r.id).slice(0, 6) : idx + 1}`,
              title: r.metadata?.title || (r.text.length > 70 ? r.text.slice(0, 67) + '...' : r.text),
              description: r.text || 'Rule recalled from Hindsight memory bank.',
              category: (r.metadata?.category as Category) || 'Team Convention',
              severity: (r.metadata?.severity as Severity) || 'Medium',
              correctExample: r.metadata?.correctExample || '',
              incorrectExample: r.metadata?.incorrectExample || '',
              authorId: r.metadata?.authorId || 'hindsight-engine',
              authorName: r.metadata?.authorName || 'Hindsight Team Memory',
              createdAt: r.mentioned_at ? r.mentioned_at.split('T')[0] : new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0],
              preventedCount: parseInt(r.metadata?.preventedCount || '1', 10),
              confidenceScore: Math.round((r.scores?.final ?? 0.88) * 100),
              isActive: true,
              isPinned: false,
              relatedReviewIds: [],
              tags: Array.isArray(r.tags) ? r.tags : [language.toLowerCase()],
              decisionHistory: []
            };

            const finalScore = typeof r.scores?.final === 'number' 
              ? Math.min(100, Math.round(r.scores.final * 100))
              : 85;

            return {
              memory,
              relevanceScore: finalScore,
              matchedKeywords: r.tags || [language],
              recalledSnippet: `Hindsight Memory: ${r.text.slice(0, 140)}`,
              source: 'hindsight-cloud' as const
            };
          });

          // Also blend with any critical local rules (like secrets/syntax) if not already in results
          const localResults = this.recallLocalMemories(code, language);
          const combined = [...hindsightResults];
          
          for (const local of localResults) {
            const alreadyPresent = combined.some(h => 
              h.memory.id === local.memory.id || 
              h.memory.title.toLowerCase() === local.memory.title.toLowerCase()
            );
            if (!alreadyPresent) {
              combined.push(local);
            }
          }

          return combined.sort((a, b) => b.relevanceScore - a.relevanceScore);
        }
      }
    } catch (err) {
      console.warn('[Hindsight] Primary recall unavailable. Using local heuristic memory fallback:', err);
    }

    // 2. FALLBACK: Deterministic local vector-heuristic pattern matching
    return this.recallLocalMemories(code, language);
  }

  /**
   * Deterministic local memory pattern matching fallback
   */
  private recallLocalMemories(code: string, language: string): MemoryRecallResult[] {
    const lowerCode = code.toLowerCase();
    const results: MemoryRecallResult[] = [];

    for (const mem of this.memories) {
      if (!mem.isActive) continue;

      let score = 0;
      const matchedKeywords: string[] = [];

      // Keyword matching
      for (const tag of mem.tags) {
        if (lowerCode.includes(tag.toLowerCase())) {
          score += 25;
          matchedKeywords.push(tag);
        }
      }

      // Specific pattern checks based on known team rules
      if (mem.id === 'MEM-101') {
        // Hardcoded secrets (only if literal raw secret, not process.env)
        const isLiteral = /(["'](sk_live|sec_live|whsec_)[a-zA-Z0-9_-]+["'])|(MASTER_API_KEY\s*=\s*["'][a-zA-Z0-9_-]{6,}["'])|(api_key\s*=\s*["'][a-zA-Z0-9_-]{6,}["'])/i.test(code);
        if (isLiteral) {
          score += 65;
          matchedKeywords.push('hardcoded secret token');
        }
      }

      if (mem.id === 'MEM-102') {
        // Promise chains
        if (/\.then\s*\(/.test(code)) {
          score += 60;
          matchedKeywords.push('.then() promise chain');
        }
      }

      if (mem.id === 'MEM-103') {
        // CamelCase in SQL
        if (/select.*(userId|createdAt|userEmail|tenantId|orderId)/i.test(code)) {
          score += 65;
          matchedKeywords.push('camelCase column in SQL');
        }
      }

      if (mem.id === 'MEM-104') {
        // Missing timeout or external call
        if (/(fetch\(|requests\.post|requests\.get|axios\.get)/i.test(code) && !/timeout|abortcontroller|signal/i.test(code)) {
          score += 55;
          matchedKeywords.push('unbounded external HTTP call');
        }
      }

      if (mem.id === 'MEM-106') {
        // SQL string concatenation
        if (/(select.*from.*where.*\+.*['"]|where.*\$\{)/i.test(code)) {
          score += 70;
          matchedKeywords.push('SQL string concatenation');
        }
      }

      if (mem.id === 'MEM-108') {
        // Var keyword
        if (/\bvar\s+[a-zA-Z0-9_$]+/.test(code)) {
          score += 60;
          matchedKeywords.push('var declaration');
        }
      }

      if (mem.id === 'MEM-109') {
        // Sensitive data logging
        if (/(console\.log.*(key|secret|password|token|header)|print.*(key|secret|token))/i.test(code)) {
          score += 65;
          matchedKeywords.push('token in stdout logger');
        }
      }

      if (mem.id === 'MEM-112') {
        // N+1 loop query
        if (/(for\s*\(.*of.*\).*await.*(query|find|select)|for\s*\(.*in.*\).*await)/is.test(code)) {
          score += 65;
          matchedKeywords.push('await query in loop');
        }
      }

      if (mem.id === 'MEM-113') {
        // Swallowed exception
        if (/catch\s*\([^\)]*\)\s*\{\s*(\/\/.*|\s*)\}/m.test(code)) {
          score += 60;
          matchedKeywords.push('empty catch block');
        }
      }

      if (score >= 40) {
        results.push({
          memory: mem,
          relevanceScore: Math.min(100, Math.round(score + (mem.confidenceScore * 0.15))),
          matchedKeywords,
          recalledSnippet: `${mem.authorName} (${mem.createdAt}): "${mem.title}"`,
          source: 'local-heuristic'
        });
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Reinforce a memory when developer accepts or rejects a suggestion.
   * 
   * 1. Updates local storage immediately for responsive UI.
   * 2. Calls real Hindsight RETAIN via /api/hindsight/retain in background.
   */
  public reinforceMemory(
    memoryId: string,
    decision: 'accepted' | 'rejected',
    developerName: string,
    reviewId: string,
    context?: string
  ): TeamMemory | null {
    const memIndex = this.memories.findIndex(m => m.id === memoryId);
    if (memIndex === -1) return null;

    const mem = { ...this.memories[memIndex] };

    if (decision === 'accepted') {
      mem.preventedCount += 1;
      mem.confidenceScore = Math.min(100, mem.confidenceScore + 1);
      mem.decisionHistory = [
        {
          reviewId,
          developerName,
          date: new Date().toISOString().split('T')[0],
          action: 'strengthened',
          context: context || `Suggestion accepted during review. Memory reinforced.`
        },
        ...mem.decisionHistory
      ];
    } else {
      mem.decisionHistory = [
        {
          reviewId,
          developerName,
          date: new Date().toISOString().split('T')[0],
          action: 'rejected',
          context: context || `Suggestion was rejected by developer. Rule retained for team audit.`
        },
        ...mem.decisionHistory
      ];
    }

    mem.updatedAt = new Date().toISOString().split('T')[0];
    this.memories[memIndex] = mem;
    this.saveToStorage();

    // Asynchronously retain to real Hindsight
    this.retainDecisionToHindsight(mem, decision, developerName, reviewId, context).catch(err => {
      console.warn('[Hindsight] Background retain notice:', err?.message || err);
    });

    return mem;
  }

  /**
   * Background call to /api/hindsight/retain for accepted/rejected decisions
   */
  private async retainDecisionToHindsight(
    mem: TeamMemory,
    decision: 'accepted' | 'rejected',
    developerName: string,
    reviewId: string,
    context?: string
  ): Promise<void> {
    const actionStr = decision === 'accepted' ? 'accepted and reinforced' : 'rejected by developer with feedback';
    const content = `[Code Review Decision] Team rule "${mem.title}" (${mem.category}, severity: ${mem.severity}) was ${actionStr} by developer ${developerName} during review ${reviewId}.\nRule Details: ${mem.description}\nContext: ${context || 'General code review'}`;

    await fetch('/api/hindsight/retain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankId: this.liveBankId,
        content,
        context: `Code Review ${reviewId}`,
        metadata: {
          ruleId: mem.id,
          title: mem.title,
          category: mem.category,
          severity: mem.severity,
          decision,
          developerName,
          reviewId
        },
        tags: [...mem.tags, decision, 'code-review-decision']
      })
    });
  }

  /**
   * Store a newly created team rule as a persistent memory.
   * 
   * 1. Creates in local storage immediately.
   * 2. Calls real Hindsight RETAIN via /api/hindsight/retain in background.
   */
  public createRule(input: CreateRuleInput): TeamMemory {
    const nextIdNumber = this.memories.length + 101;
    const newMemory: TeamMemory = {
      id: `MEM-${nextIdNumber}`,
      title: input.title,
      description: input.description,
      category: input.category,
      severity: input.severity,
      correctExample: input.correctExample,
      incorrectExample: input.incorrectExample,
      authorId: input.authorId,
      authorName: input.authorName,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      preventedCount: 1,
      confidenceScore: 90,
      isActive: true,
      isPinned: false,
      relatedReviewIds: [],
      tags: input.tags.length > 0 ? input.tags : [input.category.toLowerCase().replace(' ', '-')],
      decisionHistory: [
        {
          reviewId: 'manual-creation',
          developerName: input.authorName,
          date: new Date().toISOString().split('T')[0],
          action: 'rule_created',
          context: `Manual team rule created by ${input.authorName} via Team Memory Console.`
        }
      ]
    };

    this.memories = [newMemory, ...this.memories];
    this.saveToStorage();

    // Asynchronously retain new rule to real Hindsight
    this.retainNewRuleToHindsight(newMemory, input).catch(err => {
      console.warn('[Hindsight] Background new rule retain notice:', err?.message || err);
    });

    return newMemory;
  }

  private async retainNewRuleToHindsight(mem: TeamMemory, input: CreateRuleInput): Promise<void> {
    const content = `[Team Rule] "${input.title}" (${input.category}, ${input.severity}): ${input.description}\nRecommended pattern: ${input.correctExample || 'N/A'}\nAnti-pattern to avoid: ${input.incorrectExample || 'N/A'}\nCreated by: ${input.authorName}`;

    await fetch('/api/hindsight/retain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankId: this.liveBankId,
        content,
        context: 'Team Rule Definition',
        metadata: {
          ruleId: mem.id,
          title: input.title,
          category: input.category,
          severity: input.severity,
          authorName: input.authorName
        },
        tags: [...mem.tags, 'team-rule']
      })
    });
  }

  public updateMemory(updated: TeamMemory): void {
    const idx = this.memories.findIndex(m => m.id === updated.id);
    if (idx !== -1) {
      this.memories[idx] = {
        ...updated,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      this.saveToStorage();
    }
  }

  public togglePin(id: string): void {
    const mem = this.memories.find(m => m.id === id);
    if (mem) {
      mem.isPinned = !mem.isPinned;
      this.saveToStorage();
    }
  }

  public toggleActive(id: string): void {
    const mem = this.memories.find(m => m.id === id);
    if (mem) {
      mem.isActive = !mem.isActive;
      this.saveToStorage();
    }
  }

  public resetToDefaults(): void {
    this.memories = [...INITIAL_MEMORIES];
    this.saveToStorage();
  }
}

export const hindsightMemoryService = new HindsightMemoryService();
