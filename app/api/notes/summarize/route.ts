import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Summarize this note in 1 sentence:\n\n${content}`,
      },
    ],
  });

  const summary =
    message.content[0].type === 'text' ? message.content[0].text : '';

  return NextResponse.json({ summary });
}
