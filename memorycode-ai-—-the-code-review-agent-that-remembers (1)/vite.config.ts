import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function geminiReviewApiPlugin(): Plugin {
  return {
    name: 'gemini-review-api',
    configureServer(server) {
      server.middlewares.use('/api/review', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              // Return fallback signal so client seamlessly uses local heuristic engine
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fallback: true, message: 'Local review engine active' }));
              return;
            }

            const { code, language, filename, personality, recalledMemories } = JSON.parse(body || '{}');

            // Dynamically import @google/genai on server
            const { GoogleGenAI, Type } = await import('@google/genai');
            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const prompt = `You are MemoryCode AI, an expert code review agent with persistent team memory.
Review this code for ${language} in file "${filename}".
Personality style: ${personality || 'friendly_mentor'}.

Recalled team memory rules from past reviews:
${JSON.stringify(recalledMemories || [], null, 2)}

Analyze the code for:
1. Security vulnerabilities (hardcoded secrets, SQL injection, timing attacks, sensitive logging)
2. Team convention violations (snake_case in DB, async/await instead of promise chains, var keyword)
3. Quality & performance issues (N+1 queries, unhandled errors, long monolith functions)

For each issue, cite relevant team memory rule if applicable and explain the decision chain.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    suggestions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          file: { type: Type.STRING },
                          line: { type: Type.INTEGER },
                          title: { type: Type.STRING },
                          problemExplanation: { type: Type.STRING },
                          whyItMatters: { type: Type.STRING },
                          suggestedFix: { type: Type.STRING },
                          category: { type: Type.STRING },
                          severity: { type: Type.STRING },
                          recalledMemoryId: { type: Type.STRING },
                          recalledMemoryTitle: { type: Type.STRING },
                          recalledMemorySnippet: { type: Type.STRING },
                          confidence: { type: Type.INTEGER },
                          followsTeamConvention: { type: Type.BOOLEAN },
                          status: { type: Type.STRING },
                          decisionChain: {
                            type: Type.OBJECT,
                            properties: {
                              currentCode: { type: Type.STRING },
                              similarPastIssue: { type: Type.STRING },
                              pastFeedback: { type: Type.STRING },
                              storedMemoryRule: { type: Type.STRING },
                              currentAction: { type: Type.STRING },
                            },
                          },
                        },
                        required: [
                          'id',
                          'file',
                          'line',
                          'title',
                          'problemExplanation',
                          'whyItMatters',
                          'suggestedFix',
                          'category',
                          'severity',
                          'confidence',
                          'followsTeamConvention',
                          'status',
                        ],
                      },
                    },
                  },
                },
              },
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(response.text || JSON.stringify({ fallback: true }));
          } catch (err: any) {
            console.error('Gemini review error:', err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ fallback: true, error: err?.message }));
          }
        });
      });
    },
  };
}

function hindsightApiPlugin(): Plugin {
  return {
    name: 'hindsight-api',
    configureServer(server) {
      server.middlewares.use('/api/hindsight', async (req, res) => {
        try {
          const { handleHindsightRequest } = await import('./server/hindsightHandler.js');
          await handleHindsightRequest(req, res);
        } catch (err: any) {
          console.error('[Hindsight Middleware Error]:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, fallback: true, error: err?.message || 'Internal server error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiReviewApiPlugin(), hindsightApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

