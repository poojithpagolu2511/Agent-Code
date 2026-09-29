import { CodeReview, Suggestion, ReviewPersonality } from '../types';
import { hindsightMemoryService } from './HindsightMemoryService';
import { compileAndAnalyzeCode } from './languageCompilerService';

export interface ReviewProgressCallback {
  (stepIndex: number, stepLabel: string): void;
}

export const REVIEW_STEPS = [
  'Parsing abstract syntax tree (AST)...',
  'Executing static vulnerability heuristics...',
  'Querying Hindsight team memory lattice...',
  'Comparing historical feedback & PR decisions...',
  'Synthesizing memory-aware recommendations...'
];

export async function runCodeReview(
  code: string,
  language: string,
  filename: string,
  personality: ReviewPersonality,
  onProgress?: ReviewProgressCallback
): Promise<CodeReview> {
  const startTime = Date.now();

  // Progress simulation steps
  for (let i = 0; i < REVIEW_STEPS.length; i++) {
    onProgress?.(i, REVIEW_STEPS[i]);
    // realistic step duration
    await new Promise(r => setTimeout(r, 260));
  }

  // 1. Recall team memories for this code
  const recalledResults = await hindsightMemoryService.recallMemories(code, language);
  const memoryMap = new Map(recalledResults.map(r => [r.memory.id, r]));

  // Try calling the server endpoint /api/review if available
  let serverReviewSuggestions: Suggestion[] | null = null;
  try {
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language,
        filename,
        personality,
        recalledMemories: recalledResults.slice(0, 5).map(r => ({
          id: r.memory.id,
          title: r.memory.title,
          category: r.memory.category,
          severity: r.memory.severity
        }))
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        serverReviewSuggestions = data.suggestions;
      }
    }
  } catch {
    // Graceful fallback to deterministic client analyzer
  }

  // Run static compiler and universal syntax analyzer
  const compilerResult = compileAndAnalyzeCode(code, language);
  const compilerSuggestions: Suggestion[] = compilerResult.errors.map((err, i) => ({
    id: `compiler-sug-${i}-${err.id}`,
    file: filename,
    line: err.line,
    title: `${personality === 'strict_security' ? 'COMPILER ALERT: ' : ''}${err.message}`,
    problemExplanation: err.message,
    whyItMatters: err.type === 'SyntaxError' 
      ? `This fatal syntax error causes the ${language} compiler/interpreter to fail with an unhandled exception before code execution.`
      : err.type === 'LanguageMismatch'
        ? `Foreign language constructs detected. The ${language} runtime cannot compile this syntax.`
        : `Violates team security or architectural standard.`,
    suggestedFix: err.fixedCode,
    originalCodeSnippet: err.originalCode,
    category: err.type === 'SecurityBreach' ? 'Security' : err.type === 'ConventionMismatch' ? 'Naming Convention' : 'Quality',
    severity: err.severity,
    confidence: 99,
    followsTeamConvention: false,
    status: 'pending',
    decisionChain: {
      currentCode: err.originalCode,
      similarPastIssue: `Syntax violation prevented by compiler guard.`,
      pastFeedback: `Automated compiler guard rejected unclosed or invalid syntax.`,
      storedMemoryRule: err.ruleCiting || `COMPILER-${language.toUpperCase()}-SYNTAX: Code must compile cleanly.`,
      currentAction: `Repaired syntax to ensure valid ${language} compilation.`
    }
  }));

  const baseSuggestions: Suggestion[] = serverReviewSuggestions || generateLocalSuggestions(code, filename, personality, memoryMap);
  
  // Combine compiler errors with heuristic suggestions (avoiding duplicate line items)
  const combinedSuggestions: Suggestion[] = [...compilerSuggestions];
  for (const s of baseSuggestions) {
    const isDuplicate = combinedSuggestions.some(existing => existing.line === s.line && existing.category === s.category);
    if (!isDuplicate) {
      combinedSuggestions.push(s);
    }
  }

  const durationMs = Date.now() - startTime;
  const memoryImpactCount = combinedSuggestions.filter(s => !!s.recalledMemoryId).length;

  // Calculate score (100 minus weighted penalties)
  let penalty = 0;
  for (const s of combinedSuggestions) {
    if (s.severity === 'Critical') penalty += 35;
    else if (s.severity === 'High') penalty += 18;
    else if (s.severity === 'Medium') penalty += 8;
    else penalty += 4;
  }
  
  // If there are syntax or compiler errors, max score is strictly capped
  let score = Math.max(15, 100 - penalty);
  if (compilerResult.errors.length > 0) {
    score = Math.min(score, 35);
  }

  const reviewId = `rev-${Date.now().toString(36)}`;

  let summary = 'All checks passed. The submitted code conforms perfectly to team conventions and security policies.';
  if (compilerResult.status === 'mismatched') {
    summary = `❌ Language Mismatch: Selected '${language}' but code does not belong to ${language}. Compilation rejected.`;
  } else if (compilerResult.errors.length > 0) {
    summary = `❌ Compilation Failed: Found ${compilerResult.errors.length} fatal syntax/compiler error(s). Code cannot execute in ${language}. Fix errors below.`;
  } else if (combinedSuggestions.length > 0) {
    summary = `MemoryCode recalled ${recalledResults.length} relevant team memories and flagged ${combinedSuggestions.length} potential issues (${combinedSuggestions.filter(s => s.severity === 'Critical').length} critical).`;
  }

  return {
    id: reviewId,
    title: `Code Review — ${filename}`,
    repository: 'payments-gateway',
    branch: 'main',
    author: 'Current Contributor',
    authorId: 'dev-current',
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    language,
    score,
    code,
    suggestions: combinedSuggestions.map(s => ({ ...s, reviewId })),
    summary,
    memoryImpactCount,
    durationMs,
    personalityUsed: personality
  };
}

function generateLocalSuggestions(
  code: string,
  filename: string,
  personality: ReviewPersonality,
  memoryMap: Map<string, any>
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');

  // Helper tone adjustments
  const tonePrefix = 
    personality === 'strict_security' ? 'SECURITY ALERT: ' :
    personality === 'friendly_mentor' ? 'Quick tip: ' :
    personality === 'architecture_expert' ? 'Architectural constraint: ' :
    '';

  // 1. Check Hardcoded Secret (ignore environment variable access)
  const literalSecretRegex = /(sk_live_[a-zA-Z0-9]+|sec_live_[a-zA-Z0-9]+|whsec_[a-zA-Z0-9]+|prod_db_secret|["']sec_[a-zA-Z0-9]{12,}["']|api_key\s*=\s*["'][a-zA-Z0-9_-]{8,}["']|MASTER_API_KEY\s*=\s*["'][a-zA-Z0-9_-]{8,}["'])/i;
  for (let idx = 0; idx < lines.length; idx++) {
    const lineStr = lines[idx];
    const isEnv = /process\.env|os\.environ|System\.getenv|config\.|secretManager/i.test(lineStr);
    if (!isEnv && literalSecretRegex.test(lineStr)) {
      const recalled = memoryMap.get('MEM-101');
      suggestions.push({
        id: `sug-${idx + 1}-secret`,
        file: filename,
        line: idx + 1,
        title: `${tonePrefix}Hardcoded credentials or API key detected`,
        problemExplanation: 'Cryptographic API tokens and credentials are hardcoded as raw string literals in source code.',
        whyItMatters: 'Hardcoded secrets are frequently leaked via repository forks, docker layers, and logs, exposing staging and production assets to compromise.',
        suggestedFix: 'const apiKey = process.env.SERVICE_API_KEY;\nif (!apiKey) {\n  throw new Error("Missing required SERVICE_API_KEY environment variable");\n}',
        originalCodeSnippet: lineStr.trim(),
        category: 'Security',
        severity: 'Critical',
        recalledMemoryId: recalled ? 'MEM-101' : undefined,
        recalledMemoryTitle: recalled ? recalled.memory.title : 'API keys must never be hardcoded',
        recalledMemorySnippet: 'Marcus Vance established zero-tolerance for embedded credentials in March 2026.',
        confidence: recalled ? 99 : 92,
        followsTeamConvention: false,
        status: 'pending',
        decisionChain: {
          currentCode: lineStr.trim(),
          similarPastIssue: 'Twilio auth key was checked into customer-portal repo in PR #42.',
          pastFeedback: 'Marcus Vance rejected hardcoded strings and mandated secret manager access.',
          storedMemoryRule: 'MEM-101: Never hardcode credentials in source code.',
          currentAction: 'Extracted key to process.env with runtime guard.'
        }
      });
      break;
    }
  }

  // 2. Check SQL Injection (String concat)
  const sqlConcatRegex = /(select.*from.*where.*\+.*['"]|where.*\$\{)/i;
  for (let idx = 0; idx < lines.length; idx++) {
    const lineStr = lines[idx];
    if (sqlConcatRegex.test(lineStr) || (lineStr.includes('WHERE') && lineStr.includes('+') && lineStr.includes('"'))) {
      const recalled = memoryMap.get('MEM-106');
      suggestions.push({
        id: `sug-${idx + 1}-sqli`,
        file: filename,
        line: idx + 1,
        title: `${tonePrefix}SQL injection vulnerability via string concatenation`,
        problemExplanation: 'Directly interpolating user variables into an SQL string allows malicious SQL payloads to alter query execution.',
        whyItMatters: 'Attackers can bypass authentication, exfiltrate the full database table, or execute destructive commands (CWE-89).',
        suggestedFix: 'const query = "SELECT * FROM users WHERE email = $1 AND password_hash = $2";\nconst result = await db.query(query, [email, hashedPassword]);',
        originalCodeSnippet: lineStr.trim(),
        category: 'Security',
        severity: 'Critical',
        recalledMemoryId: recalled ? 'MEM-106' : undefined,
        recalledMemoryTitle: recalled ? recalled.memory.title : 'Prevent SQL injection via parameterized queries',
        recalledMemorySnippet: 'Marcus Vance mandated 100% parameterization without string concatenation.',
        confidence: recalled ? 99 : 94,
        followsTeamConvention: false,
        status: 'pending',
        decisionChain: {
          currentCode: lineStr.trim(),
          similarPastIssue: 'User search query allowed OR 1=1 bypass in Sprint 4.',
          pastFeedback: 'Security lead Marcus Vance rejected PR and added parameterized query rule.',
          storedMemoryRule: 'MEM-106: Always parameterize SQL queries with placeholders ($1, ?).',
          currentAction: 'Converted raw string query into parameterized placeholder statement.'
        }
      });
      break;
    }
  }

  // 3. Check CamelCase Column in SQL
  const camelCaseRegex = /select.*(userId|createdAt|userEmail|tenantId|orderId)/i;
  for (let idx = 0; idx < lines.length; idx++) {
    const lineStr = lines[idx];
    if (camelCaseRegex.test(lineStr)) {
      const recalled = memoryMap.get('MEM-103');
      suggestions.push({
        id: `sug-${idx + 1}-naming`,
        file: filename,
        line: idx + 1,
        title: `${tonePrefix}Column naming violates database convention (snake_case required)`,
        problemExplanation: 'Found camelCase identifiers in SQL query (e.g. userId, createdAt) instead of snake_case.',
        whyItMatters: 'Postgres folds unquoted identifiers to lowercase, resulting in "column does not exist" errors or breaking DTO contracts.',
        suggestedFix: 'SELECT id, user_id, created_at, user_email FROM user_profiles WHERE user_id = $1',
        originalCodeSnippet: lineStr.trim(),
        category: 'Naming Convention',
        severity: 'High',
        recalledMemoryId: recalled ? 'MEM-103' : undefined,
        recalledMemoryTitle: recalled ? recalled.memory.title : 'Database columns must use snake_case',
        recalledMemorySnippet: 'Priya Sharma instituted snake_case DB standard after schema migration breakdown.',
        confidence: recalled ? 97 : 89,
        followsTeamConvention: false,
        status: 'pending',
        decisionChain: {
          currentCode: lineStr.trim(),
          similarPastIssue: 'Auth service migration crashed in staging due to quoted camelCase column references.',
          pastFeedback: 'Priya Sharma enforced snake_case for all Postgres tables.',
          storedMemoryRule: 'MEM-103: DB columns must use snake_case; map to camelCase at DTO boundary.',
          currentAction: 'Rewrote query to use user_id, created_at, user_email.'
        }
      });
      break;
    }
  }

  // 4. Check Promise Chain (.then)
  for (let idx = 0; idx < lines.length; idx++) {
    const lineStr = lines[idx];
    if (/\.then\s*\(/.test(lineStr)) {
      const recalled = memoryMap.get('MEM-102');
      suggestions.push({
        id: `sug-${idx + 1}-promise`,
        file: filename,
        line: idx + 1,
        title: `${tonePrefix}Nested Promise chain: Prefer modern async/await syntax`,
        problemExplanation: 'Found raw .then() chain instead of modern async/await control flow.',
        whyItMatters: 'Promise callback chains frequently cause unhandled rejections, nested scope issues, and obscure stack traces.',
        suggestedFix: 'try {\n  const user = await db.query(query, [email]);\n  return res.json({ user });\n} catch (err) {\n  logger.error("Auth failed", { err });\n  return res.status(500).json({ error: "Authentication failed" });\n}',
        originalCodeSnippet: lineStr.trim(),
        category: 'Quality',
        severity: 'Medium',
        recalledMemoryId: recalled ? 'MEM-102' : undefined,
        recalledMemoryTitle: recalled ? recalled.memory.title : 'Prefer async/await over Promise chains',
        recalledMemorySnippet: 'Alex Chen standardized async/await for clear control flow.',
        confidence: recalled ? 95 : 88,
        followsTeamConvention: false,
        status: 'pending',
        decisionChain: {
          currentCode: lineStr.trim(),
          similarPastIssue: 'Node unhandled rejection in production customer lookup worker.',
          pastFeedback: 'Alex Chen refactored nested .then() callbacks to async/await with try/catch.',
          storedMemoryRule: 'MEM-102: Prefer async/await over nested promise chains.',
          currentAction: 'Converted .then() callback into clean async/await try/catch block.'
        }
      });
      break;
    }
  }

  // 5. Check var keyword
  for (let idx = 0; idx < lines.length; idx++) {
    const lineStr = lines[idx];
    if (/\bvar\s+[a-zA-Z0-9_$]+/.test(lineStr)) {
      const recalled = memoryMap.get('MEM-108');
      suggestions.push({
        id: `sug-${idx + 1}-var`,
        file: filename,
        line: idx + 1,
        title: `${tonePrefix}Use of legacy 'var' declaration`,
        problemExplanation: 'Variables declared with "var" are function-scoped rather than block-scoped, leading to accidental variable leakage.',
        whyItMatters: 'Accidental variable hoisting and re-declaration can cause subtle logic bugs that are hard to detect at runtime.',
        suggestedFix: 'const email = req.body.email;\nconst password = req.body.password;',
        originalCodeSnippet: lineStr.trim(),
        category: 'Quality',
        severity: 'Low',
        recalledMemoryId: recalled ? 'MEM-108' : undefined,
        recalledMemoryTitle: recalled ? recalled.memory.title : 'Avoid var keyword: declare with const or let',
        recalledMemorySnippet: 'Elena Rostova established ES6 block scoping as a baseline hygiene rule.',
        confidence: recalled ? 98 : 95,
        followsTeamConvention: false,
        status: 'pending',
        decisionChain: {
          currentCode: lineStr.trim(),
          similarPastIssue: 'Variable hoisting bug in legacy billing calculator.',
          pastFeedback: 'Elena Rostova removed all var occurrences and added ESLint rule.',
          storedMemoryRule: 'MEM-108: Always declare variables with const, or let if mutated.',
          currentAction: 'Replaced var with const.'
        }
      });
      break;
    }
  }

  // 6. Check Token logging
  for (let idx = 0; idx < lines.length; idx++) {
    const lineStr = lines[idx];
    if (/(console\.log.*(key|secret|password|token)|print.*(key|secret|token))/i.test(lineStr)) {
      const recalled = memoryMap.get('MEM-109');
      suggestions.push({
        id: `sug-${idx + 1}-log-pii`,
        file: filename,
        line: idx + 1,
        title: `${tonePrefix}Sensitive authentication token emitted to standard logs`,
        problemExplanation: 'Printing credentials or tokens to console.log exposes secrets to log aggregation pipelines.',
        whyItMatters: 'Any team member, audit service, or third-party monitoring agent with log access can view live bearer tokens.',
        suggestedFix: 'logger.info("User authenticated successfully", { userId: user.id });',
        originalCodeSnippet: lineStr.trim(),
        category: 'Security',
        severity: 'Critical',
        recalledMemoryId: recalled ? 'MEM-109' : undefined,
        recalledMemoryTitle: recalled ? recalled.memory.title : 'Never log sensitive PII or tokens',
        recalledMemorySnippet: 'Marcus Vance created rule during SOC2 audit when tokens were leaked to Datadog.',
        confidence: recalled ? 99 : 91,
        followsTeamConvention: false,
        status: 'pending',
        decisionChain: {
          currentCode: lineStr.trim(),
          similarPastIssue: 'Datadog log index contained raw customer auth headers.',
          pastFeedback: 'Marcus Vance instituted sanitized logger with automated secret redaction.',
          storedMemoryRule: 'MEM-109: Never emit credentials or PII to console logs.',
          currentAction: 'Sanitized log output to only log non-sensitive user identifier.'
        }
      });
      break;
    }
  }

  // 7. Dynamic evaluation of custom rules recalled from Hindsight memory bank
  for (const [memId, rec] of memoryMap.entries()) {
    if (rec && rec.memory) {
      const incSnippet = rec.memory.incorrectExample ? rec.memory.incorrectExample.trim() : '';
      if (incSnippet && code.includes(incSnippet)) {
        const alreadyCovered = suggestions.some(s => s.recalledMemoryId === memId);
        if (!alreadyCovered) {
          const matchingLineIdx = lines.findIndex(l => l.includes(incSnippet));
          const lineNum = matchingLineIdx >= 0 ? matchingLineIdx + 1 : 1;
          suggestions.push({
            id: `sug-custom-${memId}`,
            file: filename,
            line: lineNum,
            title: `${tonePrefix}${rec.memory.title}`,
            problemExplanation: rec.memory.description,
            whyItMatters: `Recalled from team memory bank (${rec.source === 'hindsight-cloud' ? 'Hindsight Cloud' : 'Team Memory'}): Violates established standard.`,
            suggestedFix: rec.memory.correctExample || '// Follow team standard',
            originalCodeSnippet: incSnippet,
            category: rec.memory.category,
            severity: rec.memory.severity,
            recalledMemoryId: memId,
            recalledMemoryTitle: rec.memory.title,
            recalledMemorySnippet: rec.recalledSnippet || rec.memory.description,
            confidence: rec.relevanceScore,
            followsTeamConvention: false,
            status: 'pending',
            decisionChain: {
              currentCode: incSnippet,
              similarPastIssue: `Historical incident recorded in team memory rule ${memId}.`,
              pastFeedback: `${rec.memory.authorName} established rule to prevent recurrence.`,
              storedMemoryRule: `${memId}: ${rec.memory.title}`,
              currentAction: 'Applied recommended team pattern.'
            }
          });
        }
      }
    }
  }

  return suggestions;
}
