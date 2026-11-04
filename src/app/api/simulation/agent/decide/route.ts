import { NextRequest, NextResponse } from 'next/server';
import { GeminiBrainClient } from '@/ai/gemini/client';
import { AgentPerceptionContext } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const context = body as AgentPerceptionContext;

    if (!context || !context.characterId) {
      return NextResponse.json(
        { error: 'Missing required perception context' },
        { status: 400 }
      );
    }

    const brainClient = new GeminiBrainClient();
    const result = await brainClient.decide(context);

    return NextResponse.json({
      success: true,
      data: result.proposal,
      telemetry: {
        latencyMs: result.latencyMs,
        model: result.model,
        isFallback: result.isFallback,
        tokensUsed: result.tokensUsed,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Deliberation failed' },
      { status: 500 }
    );
  }
}
