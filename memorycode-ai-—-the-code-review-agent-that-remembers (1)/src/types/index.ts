export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type Category = 
  | 'Security' 
  | 'Quality' 
  | 'Architecture' 
  | 'Naming Convention' 
  | 'Performance' 
  | 'Testing';

export type ReviewPersonality = 
  | 'strict_security' 
  | 'friendly_mentor' 
  | 'architecture_expert' 
  | 'minimal_concise';

export interface Developer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  feedbackStyle: 'Concise' | 'Detailed';
  reviewMode: 'Strict' | 'Coaching';
  totalReviews: number;
  acceptedSuggestions: number;
  rejectedSuggestions: number;
  frequentIssues: string[];
  bio: string;
}

export interface TeamMemory {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  correctExample: string;
  incorrectExample: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  preventedCount: number;
  confidenceScore: number;
  isActive: boolean;
  isPinned: boolean;
  relatedReviewIds: string[];
  tags: string[];
  // History of decisions that built this memory
  decisionHistory: {
    reviewId: string;
    developerName: string;
    date: string;
    action: 'accepted' | 'rejected' | 'rule_created' | 'strengthened';
    context: string;
  }[];
}

export interface Suggestion {
  id: string;
  reviewId?: string;
  file: string;
  line: number;
  title: string;
  problemExplanation: string;
  whyItMatters: string;
  suggestedFix: string;
  originalCodeSnippet?: string;
  category: Category;
  severity: Severity;
  recalledMemoryId?: string;
  recalledMemoryTitle?: string;
  recalledMemorySnippet?: string;
  confidence: number; // 0 - 100
  followsTeamConvention: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
  personalityTone?: string;
  // Why am I seeing this chain
  decisionChain: {
    currentCode: string;
    similarPastIssue: string;
    pastFeedback: string;
    storedMemoryRule: string;
    currentAction: string;
  };
}

export interface CodeReview {
  id: string;
  title: string;
  repository: string;
  branch: string;
  author: string;
  authorId: string;
  createdAt: string;
  language: string;
  score: number; // 0 - 100
  code: string;
  suggestions: Suggestion[];
  summary: string;
  memoryImpactCount: number;
  durationMs: number;
  personalityUsed: ReviewPersonality;
}

export interface ReviewAnalytics {
  reviewsCompleted: number;
  memoriesStored: number;
  recurringMistakesPrevented: number;
  suggestionAcceptanceRate: number; // percentage
  memoryHealthScore: number; // 0 - 100
  healthBreakdown: {
    securitySafety: number;
    conventionConsistency: number;
    architecturalAdherence: number;
    testCoverage: number;
  };
  monthlyTrends: {
    month: string;
    recurringMistakes: number;
    preventedByMemory: number;
    acceptedSuggestions: number;
  }[];
  categoryDistribution: {
    category: Category;
    count: number;
  }[];
}
