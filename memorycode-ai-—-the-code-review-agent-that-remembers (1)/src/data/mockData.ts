import { Developer, TeamMemory, CodeReview, ReviewAnalytics } from '../types';

export const INITIAL_DEVELOPERS: Developer[] = [
  {
    id: 'dev-1',
    name: 'Alex Chen',
    role: 'Staff Platform Engineer & Tech Lead',
    avatar: '/src/assets/images/avatar_alex_lead_1790612318097.jpg',
    email: 'alex.chen@memorycode.internal',
    feedbackStyle: 'Detailed',
    reviewMode: 'Coaching',
    totalReviews: 48,
    acceptedSuggestions: 42,
    rejectedSuggestions: 6,
    frequentIssues: ['Database index omission', 'Unused service parameters', 'Async error propagation'],
    bio: 'Leads backend architectural standards and distributed systems resiliency across microservices.'
  },
  {
    id: 'dev-2',
    name: 'Marcus Vance',
    role: 'Principal Security Architect',
    avatar: '/src/assets/images/avatar_marcus_sec_1790612330343.jpg',
    email: 'marcus.vance@memorycode.internal',
    feedbackStyle: 'Concise',
    reviewMode: 'Strict',
    totalReviews: 64,
    acceptedSuggestions: 61,
    rejectedSuggestions: 3,
    frequentIssues: ['Hardcoded credentials', 'SQL concatenation', 'Sensitive data in logs'],
    bio: 'AppSec lead focused on OWASP Top 10 prevention, zero-trust tokens, and secret leakage prevention.'
  },
  {
    id: 'dev-3',
    name: 'Priya Sharma',
    role: 'Senior Fullstack Engineer',
    avatar: '/src/assets/images/avatar_priya_dev_1790612342254.jpg',
    email: 'priya.sharma@memorycode.internal',
    feedbackStyle: 'Detailed',
    reviewMode: 'Coaching',
    totalReviews: 39,
    acceptedSuggestions: 35,
    rejectedSuggestions: 4,
    frequentIssues: ['Promise chain nesting', 'Uncontrolled re-renders', 'Missing Zod validation'],
    bio: 'Author of team API schemas, TypeScript interfaces, and end-to-end telemetry hooks.'
  },
  {
    id: 'dev-4',
    name: 'David Kim',
    role: 'Systems & DevOps Engineer',
    avatar: '',
    email: 'david.kim@memorycode.internal',
    feedbackStyle: 'Concise',
    reviewMode: 'Strict',
    totalReviews: 29,
    acceptedSuggestions: 24,
    rejectedSuggestions: 5,
    frequentIssues: ['Uncapped worker concurrency', 'Missing timeout on outbound HTTP', 'Docker root user'],
    bio: 'Focuses on container security, Kubernetes manifest linting, and infrastructure performance.'
  },
  {
    id: 'dev-5',
    name: 'Elena Rostova',
    role: 'Backend Software Engineer',
    avatar: '',
    email: 'elena.rostova@memorycode.internal',
    feedbackStyle: 'Detailed',
    reviewMode: 'Coaching',
    totalReviews: 22,
    acceptedSuggestions: 19,
    rejectedSuggestions: 3,
    frequentIssues: ['Database column casing mismatch', 'Missing unit test assertions', 'Magic numbers'],
    bio: 'Works on core payment integration, webhooks processing, and idempotency keys.'
  }
];

export const INITIAL_MEMORIES: TeamMemory[] = [
  {
    id: 'MEM-101',
    title: 'API keys & secrets must NEVER be hardcoded in source code',
    description: 'All cloud credentials, JWT secrets, and third-party API tokens must be read exclusively from environment variables or vault secret managers, never embedded as string literals.',
    category: 'Security',
    severity: 'Critical',
    correctExample: 'const apiKey = process.env.STRIPE_SECRET_KEY;\nif (!apiKey) throw new ConfigurationError("Missing STRIPE_SECRET_KEY");',
    incorrectExample: 'const apiKey = "sk_live_51M0x48924b12c8b0932840294"; // NEVER DO THIS',
    authorId: 'dev-2',
    authorName: 'Marcus Vance',
    createdAt: '2026-03-12',
    updatedAt: '2026-09-24',
    preventedCount: 38,
    confidenceScore: 99,
    isActive: true,
    isPinned: true,
    relatedReviewIds: ['rev-01', 'rev-04', 'rev-08'],
    tags: ['secrets', 'security', 'env-vars', 'compliance'],
    decisionHistory: [
      {
        reviewId: 'rev-01',
        developerName: 'Marcus Vance',
        date: '2026-03-12',
        action: 'rule_created',
        context: 'Created rule after staging incident where live Twilio token was checked into customer-portal repo.'
      },
      {
        reviewId: 'rev-04',
        developerName: 'Elena Rostova',
        date: '2026-05-18',
        action: 'accepted',
        context: 'Blocked hardcoded payment secret in PR #114; replaced with Secrets Manager accessor.'
      },
      {
        reviewId: 'rev-08',
        developerName: 'David Kim',
        date: '2026-08-02',
        action: 'strengthened',
        context: 'Added automated regex matching for AWS, Stripe, and Sendgrid key signatures.'
      }
    ]
  },
  {
    id: 'MEM-102',
    title: 'Prefer async/await over nested Promise chains (.then/.catch)',
    description: 'Nested promise chains cause unhandled rejection leaks and obscure control flow. Standardize on modern async/await syntax with explicit try/catch blocks.',
    category: 'Quality',
    severity: 'Medium',
    correctExample: 'async function fetchUserProfile(userId: string): Promise<User> {\n  try {\n    const res = await api.get(`/users/${userId}`);\n    return res.data;\n  } catch (err) {\n    logger.error("Failed to load user", { userId, err });\n    throw new UserFetchError(userId);\n  }\n}',
    incorrectExample: 'function fetchUserProfile(userId) {\n  return api.get("/users/" + userId).then(res => {\n    return res.data;\n  }).catch(err => console.log(err));\n}',
    authorId: 'dev-1',
    authorName: 'Alex Chen',
    createdAt: '2026-04-05',
    updatedAt: '2026-09-15',
    preventedCount: 26,
    confidenceScore: 94,
    isActive: true,
    isPinned: true,
    relatedReviewIds: ['rev-02', 'rev-05'],
    tags: ['typescript', 'clean-code', 'async-await', 'error-handling'],
    decisionHistory: [
      {
        reviewId: 'rev-02',
        developerName: 'Alex Chen',
        date: '2026-04-05',
        action: 'rule_created',
        context: 'Established team guideline to prevent floating unhandled promise bugs in Node.js microservices.'
      },
      {
        reviewId: 'rev-05',
        developerName: 'Priya Sharma',
        date: '2026-06-11',
        action: 'accepted',
        context: 'Refactored customer lookup pipeline from 4 nested .then() callbacks to clean async generator.'
      }
    ]
  },
  {
    id: 'MEM-103',
    title: 'Database records must use snake_case (user_id, created_at), not camelCase',
    description: 'PostgreSQL columns and database schema contracts adhere strictly to snake_case. Map to camelCase only at the domain boundary DTO layer.',
    category: 'Naming Convention',
    severity: 'High',
    correctExample: 'SELECT id, user_id, tenant_id, created_at FROM audit_events WHERE user_id = $1;',
    incorrectExample: 'SELECT id, userId, tenantId, createdAt FROM audit_events WHERE userId = $1;',
    authorId: 'dev-3',
    authorName: 'Priya Sharma',
    createdAt: '2026-04-20',
    updatedAt: '2026-08-19',
    preventedCount: 19,
    confidenceScore: 96,
    isActive: true,
    isPinned: true,
    relatedReviewIds: ['rev-03', 'rev-07'],
    tags: ['database', 'postgres', 'schema', 'naming'],
    decisionHistory: [
      {
        reviewId: 'rev-03',
        developerName: 'Priya Sharma',
        date: '2026-04-20',
        action: 'rule_created',
        context: 'Prevented production runtime failure where Drizzle ORM failed to query quoted camelCase column names.'
      }
    ]
  },
  {
    id: 'MEM-104',
    title: 'All external API calls must implement explicit timeouts and typed error handlers',
    description: 'Never issue unbounded network requests. Always provide an AbortController or client timeout (max 5000ms for internal APIs, 10000ms for third-party).',
    category: 'Architecture',
    severity: 'High',
    correctExample: 'const controller = new AbortController();\nconst timeout = setTimeout(() => controller.abort(), 5000);\ntry {\n  const res = await fetch(url, { signal: controller.signal });\n  return await res.json();\n} finally {\n  clearTimeout(timeout);\n}',
    incorrectExample: 'const res = await fetch(unreliableExternalUrl);\nconst data = await res.json();',
    authorId: 'dev-4',
    authorName: 'David Kim',
    createdAt: '2026-05-02',
    updatedAt: '2026-09-10',
    preventedCount: 31,
    confidenceScore: 97,
    isActive: true,
    isPinned: true,
    relatedReviewIds: ['rev-06', 'rev-09'],
    tags: ['reliability', 'timeout', 'resilience', 'networking'],
    decisionHistory: [
      {
        reviewId: 'rev-06',
        developerName: 'David Kim',
        date: '2026-05-02',
        action: 'rule_created',
        context: 'Created after outbound payment gateway hung connections and exhausted the Node server pool.'
      }
    ]
  },
  {
    id: 'MEM-105',
    title: 'Use Service-Layer abstraction for business logic instead of fat controllers',
    description: 'Express and FastAPI route handlers must only handle request validation, status response, and authentication context. All calculations and DB mutations belong in dedicated service classes.',
    category: 'Architecture',
    severity: 'Medium',
    correctExample: '// Controller:\nexport async function handleCheckout(req, res) {\n  const result = await checkoutService.processOrder(req.user.id, req.body);\n  return res.status(200).json(result);\n}',
    incorrectExample: '// Controller with 120 lines of SQL, third-party calls, and discount math directly in route handler',
    authorId: 'dev-1',
    authorName: 'Alex Chen',
    createdAt: '2026-05-14',
    updatedAt: '2026-08-28',
    preventedCount: 15,
    confidenceScore: 92,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-02'],
    tags: ['architecture', 'modularity', 'separation-of-concerns'],
    decisionHistory: [
      {
        reviewId: 'rev-02',
        developerName: 'Alex Chen',
        date: '2026-05-14',
        action: 'rule_created',
        context: 'Adopted across team to improve testability and isolate business logic from HTTP frameworks.'
      }
    ]
  },
  {
    id: 'MEM-106',
    title: 'Prevent SQL injection: Parameterize all database queries without exception',
    description: 'String template interpolation or string concatenation inside database queries is prohibited. Always pass query values through parameterized $1 placeholders.',
    category: 'Security',
    severity: 'Critical',
    correctExample: 'const user = await db.query("SELECT * FROM users WHERE email = $1 AND tenant_id = $2", [email, tenantId]);',
    incorrectExample: 'const user = await db.query(`SELECT * FROM users WHERE email = "${email}" AND tenant_id = "${tenantId}"`);',
    authorId: 'dev-2',
    authorName: 'Marcus Vance',
    createdAt: '2026-03-18',
    updatedAt: '2026-09-22',
    preventedCount: 44,
    confidenceScore: 100,
    isActive: true,
    isPinned: true,
    relatedReviewIds: ['rev-01', 'rev-07'],
    tags: ['sql-injection', 'security', 'postgres', 'cwe-89'],
    decisionHistory: [
      {
        reviewId: 'rev-01',
        developerName: 'Marcus Vance',
        date: '2026-03-18',
        action: 'rule_created',
        context: 'Mandated zero-tolerance for SQL string concatenation across all microservices.'
      }
    ]
  },
  {
    id: 'MEM-107',
    title: 'Always validate external API input payloads using Zod or Pydantic schemas',
    description: 'Never cast raw `req.body` directly to a TypeScript interface with `as Payload`. Validate and parse inputs at the network boundary.',
    category: 'Quality',
    severity: 'High',
    correctExample: 'const CreateUserSchema = z.object({ email: z.string().email(), age: z.number().min(18) });\nconst validated = CreateUserSchema.parse(req.body);',
    incorrectExample: 'const payload = req.body as CreateUserPayload; // Unchecked type assertion',
    authorId: 'dev-3',
    authorName: 'Priya Sharma',
    createdAt: '2026-06-02',
    updatedAt: '2026-09-01',
    preventedCount: 22,
    confidenceScore: 95,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-05'],
    tags: ['zod', 'validation', 'typescript', 'runtime-safety'],
    decisionHistory: [
      {
        reviewId: 'rev-05',
        developerName: 'Priya Sharma',
        date: '2026-06-02',
        action: 'rule_created',
        context: 'Prevented invalid undefined object properties from crashing customer billing workers.'
      }
    ]
  },
  {
    id: 'MEM-108',
    title: 'Avoid var keyword: Always declare with const, or let only if reassigned',
    description: 'The `var` keyword introduces function-scoped hoisting and subtle mutation bugs. Enforce block-scoped `const` by default.',
    category: 'Quality',
    severity: 'Low',
    correctExample: 'const maxRetries = 3;\nlet currentAttempt = 0;',
    incorrectExample: 'var maxRetries = 3;\nvar currentAttempt = 0;',
    authorId: 'dev-5',
    authorName: 'Elena Rostova',
    createdAt: '2026-04-10',
    updatedAt: '2026-07-14',
    preventedCount: 14,
    confidenceScore: 98,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-04'],
    tags: ['es6', 'code-hygiene', 'javascript'],
    decisionHistory: [
      {
        reviewId: 'rev-04',
        developerName: 'Elena Rostova',
        date: '2026-04-10',
        action: 'rule_created',
        context: 'Cleaned legacy JavaScript code snippets from old billing microservice.'
      }
    ]
  },
  {
    id: 'MEM-109',
    title: 'Never log sensitive PII or Authorization Bearer tokens in console logs',
    description: 'Ensure audit logs and Winston/Pino formatters scrub passwords, card CVVs, and Authorization headers before persisting to Datadog or CloudWatch.',
    category: 'Security',
    severity: 'Critical',
    correctExample: 'logger.info("Processed auth request", { userId: user.id, status: "success" });',
    incorrectExample: 'logger.info("Processed auth request", { headers: req.headers, body: req.body }); // Leaks token!',
    authorId: 'dev-2',
    authorName: 'Marcus Vance',
    createdAt: '2026-06-15',
    updatedAt: '2026-09-18',
    preventedCount: 29,
    confidenceScore: 99,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-08'],
    tags: ['pii', 'security', 'logging', 'gdpr'],
    decisionHistory: [
      {
        reviewId: 'rev-08',
        developerName: 'Marcus Vance',
        date: '2026-06-15',
        action: 'rule_created',
        context: 'Caught during SOC2 compliance audit when full authorization headers were discovered in log aggregators.'
      }
    ]
  },
  {
    id: 'MEM-110',
    title: 'Functions exceeding 50 lines must be decomposed into single-responsibility sub-routines',
    description: 'High cyclomatic complexity and monolith functions degrade testability and comprehension. Keep functions focused on a single logical transformation.',
    category: 'Quality',
    severity: 'Medium',
    correctExample: 'async function processSubscription(req) {\n  const user = await validateSubscriptionEligibility(req);\n  const invoice = await generateInvoice(user);\n  return await dispatchConfirmation(invoice);\n}',
    incorrectExample: '// 180-line uninterrupted function containing DB queries, Stripe calls, email formatting, and logging.',
    authorId: 'dev-1',
    authorName: 'Alex Chen',
    createdAt: '2026-05-22',
    updatedAt: '2026-08-30',
    preventedCount: 18,
    confidenceScore: 90,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-09'],
    tags: ['refactoring', 'cyclomatic-complexity', 'clean-code'],
    decisionHistory: [
      {
        reviewId: 'rev-09',
        developerName: 'Alex Chen',
        date: '2026-05-22',
        action: 'rule_created',
        context: 'Adopted in Sprint 8 after complex billing recalculation PR took 4 days to review.'
      }
    ]
  },
  {
    id: 'MEM-111',
    title: 'Unit tests must assert business logic outcomes, not just mock invocations',
    description: 'Ensure test suites verify return data state and error throwing conditions rather than merely verifying that `service.call()` was invoked once.',
    category: 'Testing',
    severity: 'Medium',
    correctExample: 'expect(result.status).toBe("ACTIVATED");\nexpect(result.balance).toEqual(100.50);',
    incorrectExample: 'expect(service.call).toHaveBeenCalledTimes(1); // No assertion on state output',
    authorId: 'dev-5',
    authorName: 'Elena Rostova',
    createdAt: '2026-06-28',
    updatedAt: '2026-09-05',
    preventedCount: 16,
    confidenceScore: 91,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-05'],
    tags: ['vitest', 'unit-tests', 'quality', 'assertions'],
    decisionHistory: [
      {
        reviewId: 'rev-05',
        developerName: 'Elena Rostova',
        date: '2026-06-28',
        action: 'rule_created',
        context: 'Established after mock-only tests passed during a silent regression in invoice discount calculations.'
      }
    ]
  },
  {
    id: 'MEM-112',
    title: 'Batch operations in loops must execute with bulk queries, not sequential roundtrips (N+1 query)',
    description: 'Never execute `await db.query(...)` inside an unbounded `for` or `forEach` loop. Collect identifiers and execute a single `WHERE id IN (...)` query.',
    category: 'Performance',
    severity: 'High',
    correctExample: 'const userIds = orders.map(o => o.userId);\nconst users = await db.query("SELECT * FROM users WHERE id = ANY($1)", [userIds]);',
    incorrectExample: 'for (const order of orders) {\n  const user = await db.query("SELECT * FROM users WHERE id = $1", [order.userId]); // N+1 bottleneck\n}',
    authorId: 'dev-4',
    authorName: 'David Kim',
    createdAt: '2026-07-04',
    updatedAt: '2026-09-12',
    preventedCount: 25,
    confidenceScore: 97,
    isActive: true,
    isPinned: true,
    relatedReviewIds: ['rev-06'],
    tags: ['performance', 'n-plus-1', 'database', 'optimization'],
    decisionHistory: [
      {
        reviewId: 'rev-06',
        developerName: 'David Kim',
        date: '2026-07-04',
        action: 'rule_created',
        context: 'Identified during load testing when 200 orders produced 1,800 database roundtrips.'
      }
    ]
  },
  {
    id: 'MEM-113',
    title: 'Never swallow exceptions in catch blocks with empty handlers or blind console.error',
    description: 'Catch blocks must either re-throw a domain-specific custom exception, return an explicit error result, or log with full stack trace and alert telemetry.',
    category: 'Quality',
    severity: 'High',
    correctExample: 'try {\n  await paymentClient.charge(chargeRequest);\n} catch (err) {\n  logger.error("Payment charge failed", { err, customerId });\n  throw new PaymentProcessingError("Card charge failed", { cause: err });\n}',
    incorrectExample: 'try {\n  await paymentClient.charge(chargeRequest);\n} catch (e) {\n  // ignore error\n}',
    authorId: 'dev-1',
    authorName: 'Alex Chen',
    createdAt: '2026-05-30',
    updatedAt: '2026-09-19',
    preventedCount: 28,
    confidenceScore: 95,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-02', 'rev-09'],
    tags: ['error-handling', 'silent-failures', 'reliability'],
    decisionHistory: [
      {
        reviewId: 'rev-02',
        developerName: 'Alex Chen',
        date: '2026-05-30',
        action: 'rule_created',
        context: 'Created following an incident where swallowed database disconnect exceptions caused ghost orders.'
      }
    ]
  },
  {
    id: 'MEM-114',
    title: 'Idempotency keys must accompany all mutating payment and billing POST operations',
    description: 'Ensure every checkout and card transaction receives an `Idempotency-Key` HTTP header to prevent double billing during network retry storms.',
    category: 'Architecture',
    severity: 'Critical',
    correctExample: 'await stripe.charges.create(chargeParams, { idempotencyKey: order.idempotencyToken });',
    incorrectExample: 'await stripe.charges.create(chargeParams); // Risk of duplicate deduction on network retry',
    authorId: 'dev-5',
    authorName: 'Elena Rostova',
    createdAt: '2026-07-15',
    updatedAt: '2026-09-20',
    preventedCount: 20,
    confidenceScore: 98,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-04'],
    tags: ['idempotency', 'payments', 'resilience', 'critical'],
    decisionHistory: [
      {
        reviewId: 'rev-04',
        developerName: 'Elena Rostova',
        date: '2026-07-15',
        action: 'rule_created',
        context: 'Added rule after client-side double-click caused 3 duplicate subscriptions in production.'
      }
    ]
  },
  {
    id: 'MEM-115',
    title: 'Use constant-time comparison algorithms when comparing cryptographic HMAC signatures or tokens',
    description: 'Standard `===` or `==` operators are vulnerable to side-channel timing attacks. Use `crypto.timingSafeEqual` for webhook signatures and token validation.',
    category: 'Security',
    severity: 'High',
    correctExample: 'import crypto from "crypto";\nconst isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));',
    incorrectExample: 'const isValid = (signature === computed); // Vulnerable to timing attack',
    authorId: 'dev-2',
    authorName: 'Marcus Vance',
    createdAt: '2026-06-20',
    updatedAt: '2026-09-14',
    preventedCount: 15,
    confidenceScore: 96,
    isActive: true,
    isPinned: false,
    relatedReviewIds: ['rev-08'],
    tags: ['timing-attacks', 'crypto', 'webhooks', 'security'],
    decisionHistory: [
      {
        reviewId: 'rev-08',
        developerName: 'Marcus Vance',
        date: '2026-06-20',
        action: 'rule_created',
        context: 'Stood up following security assessment of external webhook ingress handlers.'
      }
    ]
  }
];

export const INITIAL_REVIEWS: CodeReview[] = [
  {
    id: 'rev-01',
    title: 'Add customer billing webhook listener and Stripe verification',
    repository: 'payments-gateway',
    branch: 'feat/stripe-webhooks',
    author: 'Elena Rostova',
    authorId: 'dev-5',
    createdAt: '2026-09-26 14:22',
    language: 'TypeScript',
    score: 82,
    code: `import express from 'express';\n\nexport const webhookRouter = express.Router();\n\nwebhookRouter.post('/stripe', async (req, res) => {\n  var event = req.body;\n  // Hardcoded secret check\n  const webhookSecret = "whsec_9940294824bba910482048";\n  \n  if (req.headers['stripe-signature'] === webhookSecret) {\n    await processEvent(event);\n  }\n  res.sendStatus(200);\n});`,
    summary: 'Identified 2 security rule violations (hardcoded webhook secret and insecure signature check) and 1 code quality issue (var keyword). Recalled team memories MEM-101 and MEM-108.',
    memoryImpactCount: 3,
    durationMs: 740,
    personalityUsed: 'strict_security',
    suggestions: [
      {
        id: 'sug-101',
        reviewId: 'rev-01',
        file: 'src/routes/webhooks.ts',
        line: 8,
        title: 'Hardcoded Stripe Webhook Secret detected',
        problemExplanation: 'The webhook secret string is hardcoded directly inside the controller file.',
        whyItMatters: 'If this file is pushed or mirrored, anyone with repository read access can forge fraudulent Stripe events and bypass billing.',
        suggestedFix: 'const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;\nif (!webhookSecret) {\n  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");\n}',
        category: 'Security',
        severity: 'Critical',
        recalledMemoryId: 'MEM-101',
        recalledMemoryTitle: 'API keys & secrets must NEVER be hardcoded in source code',
        recalledMemorySnippet: 'Marcus Vance established in March 2026 that all tokens must be read from environment variables.',
        confidence: 99,
        followsTeamConvention: false,
        status: 'accepted',
        decisionChain: {
          currentCode: 'const webhookSecret = "whsec_9940294824bba910482048";',
          similarPastIssue: 'PR #42 in customer-portal included hardcoded Twilio tokens.',
          pastFeedback: 'Marcus Vance rejected hardcoded credentials and instituted secret manager mandates.',
          storedMemoryRule: 'MEM-101: Never embed secret keys or tokens in code.',
          currentAction: 'Extracted secret to process.env with fail-fast initialization check.'
        }
      },
      {
        id: 'sug-102',
        reviewId: 'rev-01',
        file: 'src/routes/webhooks.ts',
        line: 10,
        title: 'Vulnerable signature verification using standard equality operator',
        problemExplanation: 'String equality operator (===) leaks timing information about matching byte prefixes.',
        whyItMatters: 'Attackers can repeatedly send crafted headers to deduce the secret key over thousands of requests via timing side channels.',
        suggestedFix: 'const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(webhookSecret));',
        category: 'Security',
        severity: 'High',
        recalledMemoryId: 'MEM-115',
        recalledMemoryTitle: 'Use constant-time comparison algorithms for HMAC signatures',
        recalledMemorySnippet: 'Recalled security mandate to use crypto.timingSafeEqual for signature matching.',
        confidence: 96,
        followsTeamConvention: false,
        status: 'accepted',
        decisionChain: {
          currentCode: 'req.headers["stripe-signature"] === webhookSecret',
          similarPastIssue: 'Webhook audit in core-auth-service found non-constant time token verification.',
          pastFeedback: 'Marcus Vance required constant-time timingSafeEqual helper across all microservices.',
          storedMemoryRule: 'MEM-115: Enforce crypto.timingSafeEqual for cryptographic hashes.',
          currentAction: 'Replaced with constant-time buffer comparison.'
        }
      }
    ]
  },
  {
    id: 'rev-02',
    title: 'Migrate user profile lookup to async/await and fix column casing',
    repository: 'core-auth-service',
    branch: 'refactor/user-queries',
    author: 'Alex Chen',
    authorId: 'dev-1',
    createdAt: '2026-09-24 11:05',
    language: 'TypeScript',
    score: 95,
    code: `export async function getUserProfile(userId: string) {\n  const user = await db.query('SELECT id, user_id, email, created_at FROM users WHERE user_id = $1', [userId]);\n  return user.rows[0];\n}`,
    summary: 'Clean implementation adhering 100% to team conventions. Follows snake_case column standards (MEM-103) and parameterized queries (MEM-106).',
    memoryImpactCount: 2,
    durationMs: 420,
    personalityUsed: 'friendly_mentor',
    suggestions: []
  },
  {
    id: 'rev-03',
    title: 'Add bulk order item recalculation in checkout worker',
    repository: 'payments-gateway',
    branch: 'feat/bulk-recalc',
    author: 'David Kim',
    authorId: 'dev-4',
    createdAt: '2026-09-21 16:40',
    language: 'TypeScript',
    score: 76,
    code: `async function syncInventoryForOrders(orders: Order[]) {\n  for (const o of orders) {\n    const item = await db.query('SELECT * FROM items WHERE id = $1', [o.itemId]);\n    await updateItemStock(item.id, o.quantity);\n  }\n}`,
    summary: 'Detected N+1 database query loop inside async for loop. Recalled performance memory MEM-112.',
    memoryImpactCount: 1,
    durationMs: 610,
    personalityUsed: 'architecture_expert',
    suggestions: [
      {
        id: 'sug-301',
        reviewId: 'rev-03',
        file: 'src/workers/inventory.ts',
        line: 2,
        title: 'N+1 database query roundtrip in sequential loop',
        problemExplanation: 'Executing a query per item causes linear database latency multiplication.',
        whyItMatters: 'With 100 orders, this executes 100 roundtrips instead of 1, degrading checkout response times by up to 2.4s.',
        suggestedFix: 'const itemIds = orders.map(o => o.itemId);\nconst items = await db.query("SELECT * FROM items WHERE id = ANY($1)", [itemIds]);',
        category: 'Performance',
        severity: 'High',
        recalledMemoryId: 'MEM-112',
        recalledMemoryTitle: 'Batch operations in loops must execute with bulk queries',
        recalledMemorySnippet: 'David Kim established in July that bulk queries must be used instead of loop roundtrips.',
        confidence: 97,
        followsTeamConvention: false,
        status: 'accepted',
        decisionChain: {
          currentCode: 'for (const o of orders) { await db.query(...) }',
          similarPastIssue: 'Order sync worker crashed during July load test due to connection exhaustion.',
          pastFeedback: 'David Kim mandated ANY($1) SQL array parameters.',
          storedMemoryRule: 'MEM-112: Prohibit N+1 query patterns in loops.',
          currentAction: 'Grouped item IDs into single bulk SQL query.'
        }
      }
    ]
  }
];

export const INITIAL_ANALYTICS: ReviewAnalytics = {
  reviewsCompleted: 128,
  memoriesStored: 42,
  recurringMistakesPrevented: 31,
  suggestionAcceptanceRate: 87,
  memoryHealthScore: 92,
  healthBreakdown: {
    securitySafety: 98,
    conventionConsistency: 94,
    architecturalAdherence: 89,
    testCoverage: 87
  },
  monthlyTrends: [
    { month: 'Apr', recurringMistakes: 24, preventedByMemory: 6, acceptedSuggestions: 32 },
    { month: 'May', recurringMistakes: 19, preventedByMemory: 12, acceptedSuggestions: 38 },
    { month: 'Jun', recurringMistakes: 14, preventedByMemory: 18, acceptedSuggestions: 44 },
    { month: 'Jul', recurringMistakes: 9, preventedByMemory: 23, acceptedSuggestions: 48 },
    { month: 'Aug', recurringMistakes: 6, preventedByMemory: 27, acceptedSuggestions: 52 },
    { month: 'Sep', recurringMistakes: 3, preventedByMemory: 31, acceptedSuggestions: 56 }
  ],
  categoryDistribution: [
    { category: 'Security', count: 44 },
    { category: 'Quality', count: 32 },
    { category: 'Architecture', count: 21 },
    { category: 'Naming Convention', count: 18 },
    { category: 'Performance', count: 15 },
    { category: 'Testing', count: 12 }
  ]
};

export const SAMPLE_CODE_SNIPPETS = {
  vulnerable_auth: {
    language: 'TypeScript',
    title: 'Vulnerable Authentication Controller (Demo)',
    code: `import express from 'express';
import { db } from '../db';

export const authRouter = express.Router();

// User login endpoint with multiple critical security and convention flaws
authRouter.post('/login', async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  // Flaw 1: Hardcoded fallback master key
  const MASTER_API_KEY = "sec_live_90823482039482039482";

  // Flaw 2: Direct SQL String Concatenation (SQL Injection)
  const query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
  
  // Flaw 3: Inconsistent camelCase column naming in database query
  const result = await db.query("SELECT userId, createdAt, userEmail FROM user_profiles WHERE userId = 42");

  // Flaw 4: Floating promise chain without error handling
  db.query(query).then(user => {
    // Flaw 5: Logging sensitive authorization token directly to stdout
    console.log("User authenticated successfully with token:", MASTER_API_KEY);
    res.json({ token: MASTER_API_KEY, user });
  }).catch(err => {
    // Flaw 6: Swallowed exception
  });
});`
  },

  promise_chain_python: {
    language: 'Python',
    title: 'Payment Ingress Service (Python)',
    code: `import os
import requests

def process_charge(user_id, amount):
    # Hardcoded stripe key
    stripe_key = "sk_live_9923849203948234"
    
    # Missing timeout on external HTTP call
    response = requests.post(
        "https://api.stripe.com/v1/charges",
        headers={"Authorization": f"Bearer {stripe_key}"},
        json={"amount": amount, "userId": user_id} # CamelCase instead of user_id
    )
    
    # Missing error handling and logging sensitive bearer token
    print(f"Charge executed with key: {stripe_key}")
    return response.json()`
  },

  java_spring_controller: {
    language: 'Java',
    title: 'Spring Boot Customer Controller (Java)',
    code: `package com.memorycode.controller;

import org.springframework.web.bind.annotation.*;
import java.sql.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    // Flaw: Hardcoded database password
    private static final String DB_PASS = "prod_db_secret_99812";

    @GetMapping("/search")
    public String searchCustomer(@RequestParam String query) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:postgresql://db:5432/app", "admin", DB_PASS);
        // SQL Injection flaw
        String sql = "SELECT * FROM customers WHERE name = '" + query + "'";
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql);
        return "Customer Found";
    }
}`
  },

  simulated_future_review: {
    language: 'TypeScript',
    title: 'Future PR (Demonstrating Instant Memory Recall)',
    code: `import express from 'express';
import { db } from '../db';

export const checkoutRouter = express.Router();

checkoutRouter.post('/process-payment', async (req, res) => {
  // Similar hardcoded secret mistake submitted again by a new contributor
  const paymentSecret = "whsec_live_449019283401928340";

  // Raw query with camelCase column
  const order = await db.query("SELECT orderId FROM orders WHERE orderId = 101");

  res.json({ status: "ok" });
});`
  }
};
