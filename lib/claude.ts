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
