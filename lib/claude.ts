import Anthropic from '@anthropic-ai/sdk';

// Shared Claude settings for the text-generation routes.
export const CLAUDE_MODEL = 'claude-opus-5-5';

type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

/** Thrown (with `onIncomplete: 'throw'`) when the reply was refused or cut off. */
export class ClaudeIncompleteError extends Error {
  stopReason: string;
  constructor(stopReason: string) {
    super(`Claude reply incomplete: ${stopReason}`);
    this.stopReason = stopReason;
  }
}

/**
 * Stream the text of a single-turn Claude reply.
 *
 * Opus 5.5 always thinks (it can't be disabled); `effort` controls how much,
 * and thinking counts toward `maxTokens`, so leave room above the reply length.
 * `fallbacks: "default"` re-runs a safety-classifier refusal on Anthropic's
 * recommended model inside the same call. Reads the raw event stream rather
 * than the SDK's MessageStream so newer block types never trip the
 * accumulator of the pinned SDK version.
 *
 * If the reply was refused or cut off: `onIncomplete: 'html'` (default) ends
 * the stream with a short HTML notice, `'throw'` raises ClaudeIncompleteError
 * after the partial text, `'ignore'` just ends.
 */
export async function* streamClaudeText({
  system,
  user,
  maxTokens = 16000,
  effort = 'medium',
  onIncomplete = 'html',
}: {
  system?: string;
  user: string;
  maxTokens?: number;
  effort?: Effort;
  onIncomplete?: 'html' | 'throw' | 'ignore';
}): AsyncGenerator<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const params: any = {
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    output_config: { effort },
    fallbacks: 'default',
    ...(system && { system }),
    messages: [{ role: 'user', content: user }],
    stream: true,
  };
  const stream: any = await anthropic.messages.create(params, {
    headers: { 'anthropic-beta': 'server-side-fallback-2026-07-01' },
  });
  let stopReason = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      yield event.delta.text as string;
    } else if (event.type === 'message_delta' && event.delta?.stop_reason) {
      stopReason = event.delta.stop_reason;
    }
  }
  if (stopReason !== 'refusal' && stopReason !== 'max_tokens') return;
  if (onIncomplete === 'throw') throw new ClaudeIncompleteError(stopReason);
  if (onIncomplete === 'ignore') return;
  if (stopReason === 'refusal') {
    yield '<p><em>Le texte n\'a pas pu être généré. Réessayez.</em></p>';
  } else if (stopReason === 'max_tokens') {
    yield '<p><em>(Texte interrompu : longueur maximale atteinte.)</em></p>';
  }
}

// Features that call Claude, for the admin status panel
export const CLAUDE_FEATURES = [
  'Interprétation du ChromobioTest (site public)',
  'Traduction des articles de blog (site public)',
  'Lecture approfondie du Test des 4 Éléments (admin)',
  'Lecture astrologique (admin)',
  'Interprétation des rêves (admin)',
];

/**
 * Health check for the admin status panel.
 * Always: look up the configured model (free, validates the key and access).
 * With `generate`: a tiny real request through the same settings as the
 * routes, reporting which model actually answered (differs on a fallback).
 */
export async function checkClaude(generate: boolean) {
  const result: {
    model: string;
    keyConfigured: boolean;
    modelOk: boolean;
    displayName?: string;
    error?: string;
    generation?: { ok: boolean; answeredBy?: string; stopReason?: string; ms?: number; text?: string; error?: string };
  } = { model: CLAUDE_MODEL, keyConfigured: !!process.env.ANTHROPIC_API_KEY, modelOk: false };
  if (!result.keyConfigured) return { ...result, error: 'ANTHROPIC_API_KEY absente' };

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const info: any = await anthropic.models.retrieve(CLAUDE_MODEL);
    result.modelOk = true;
    result.displayName = info.display_name;
  } catch (e: any) {
    result.error = e?.status ? `HTTP ${e.status} : ${e?.error?.error?.message || e.message}` : e.message;
    return result;
  }

  if (generate) {
    const start = Date.now();
    try {
      const params: any = {
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        output_config: { effort: 'low' },
        fallbacks: 'default',
        messages: [{ role: 'user', content: 'Réponds uniquement : « Bonjour Valérie ».' }],
      };
      const msg: any = await anthropic.messages.create(params, {
        headers: { 'anthropic-beta': 'server-side-fallback-2026-07-01' },
      });
      const text = (msg.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('').trim();
      result.generation = {
        ok: msg.stop_reason === 'end_turn' && !!text,
        answeredBy: msg.model,
        stopReason: msg.stop_reason,
        ms: Date.now() - start,
        text,
      };
    } catch (e: any) {
      result.generation = { ok: false, ms: Date.now() - start, error: e?.status ? `HTTP ${e.status} : ${e?.error?.error?.message || e.message}` : e.message };
    }
  }
  return result;
}
