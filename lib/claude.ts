import Anthropic from '@anthropic-ai/sdk';

// Shared Claude settings for the text-generation routes.
export const CLAUDE_MODEL = 'claude-opus-5-5';

type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

/**
 * Stream the text of a single-turn Claude reply.
 *
 * Opus 5.5 always thinks (it can't be disabled); `effort` controls how much,
 * and thinking counts toward `maxTokens`, so leave room above the reply length.
 * `fallbacks: "default"` re-runs a safety-classifier refusal on Anthropic's
 * recommended model inside the same call. Reads the raw event stream rather
 * than the SDK's MessageStream so newer block types never trip the
 * accumulator of the pinned SDK version. Ends with an HTML notice if the
 * reply was refused or cut off.
 */
export async function* streamClaudeText({
  system,
  user,
  maxTokens = 16000,
  effort = 'medium',
}: {
  system: string;
  user: string;
  maxTokens?: number;
  effort?: Effort;
}): AsyncGenerator<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const params: any = {
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    output_config: { effort },
    fallbacks: 'default',
    system,
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
  // The routes render the reply as HTML, so end-of-stream notices are HTML too
  if (stopReason === 'refusal') {
    yield '<p><em>Le texte n\'a pas pu être généré. Réessayez.</em></p>';
  } else if (stopReason === 'max_tokens') {
    yield '<p><em>(Texte interrompu : longueur maximale atteinte.)</em></p>';
  }
}
