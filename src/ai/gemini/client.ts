import { GoogleGenAI } from '@google/genai';
import { AgentDecisionProposal, AgentPerceptionContext } from '../../types/ai';
import { parseDecisionProposal } from '../schemas/decision';
import { buildCharacterSystemPrompt, buildPerceptionPrompt } from '../prompts/characterPrompts';

export interface DecisionResult {
  proposal: AgentDecisionProposal;
  isFallback: boolean;
  model: string;
  latencyMs: number;
  tokensUsed?: number;
}

export interface IGeminiClient {
  decide(context: AgentPerceptionContext): Promise<DecisionResult>;
}

export class GeminiBrainClient implements IGeminiClient {
  private client: GoogleGenAI | null = null;
  private modelName: string;
  private apiKey: string | undefined;

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.modelName = modelName || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (this.apiKey) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  public async decide(context: AgentPerceptionContext): Promise<DecisionResult> {
    const startTime = Date.now();

    // If no client (no API key configured or test mode), use deterministic fallback
    if (!this.client) {
      const fallback = this.generateDeterministicFallback(context, 'No API key provided - using local deterministic mind');
      return {
        proposal: fallback,
        isFallback: true,
        model: 'deterministic-offline-fallback',
        latencyMs: Date.now() - startTime,
      };
    }

    const systemInstruction = buildCharacterSystemPrompt(context.characterId);
    const userPrompt = buildPerceptionPrompt(context);

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI deliberation timed out after 5000ms')), 5000)
      );

      const generatePromise = this.client.models.generateContent({
        model: this.modelName,
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nPerception Context:\n${userPrompt}` }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const rawText = response.text || '';
      const parsedJson = JSON.parse(rawText);

      const validation = parseDecisionProposal(parsedJson);
      if (!validation.success || !validation.data) {
        throw new Error(`Model returned invalid decision schema: ${validation.error}`);
      }

      return {
        proposal: validation.data,
        isFallback: false,
        model: this.modelName,
        latencyMs: Date.now() - startTime,
        tokensUsed: response.usageMetadata?.totalTokenCount,
      };
    } catch {
      // Graceful fallback if Gemini call fails, times out, or output schema fails validation
      const fallback = this.generateDeterministicFallback(context, 'Deliberation fallback triggered');
      return {
        proposal: fallback,
        isFallback: true,
        model: `${this.modelName}-fallback`,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  public generateDeterministicFallback(
    context: AgentPerceptionContext,
    reason: string
  ): AgentDecisionProposal {
    // Determine a logical next step based on needs and position
    let actionType: AgentDecisionProposal['action']['type'] = 'IDLE';
    let targetTile = context.currentPosition;
    let dialogue: string | null = null;
    let motivation = `Maintaining stability (${reason})`;

    if (context.needs.energy < 30) {
      motivation = 'Seeking a comfortable spot to rest';
      actionType = 'MOVE';
      targetTile = { x: 12, y: 10, landmark: 'Campfire' }; // Move toward campfire
    } else if (context.needs.curiosity > 70) {
      motivation = 'Exploring the surrounding island';
      actionType = 'INSPECT';
    } else if (context.nearbyCharacters.length > 0 && context.needs.sociability > 50) {
      motivation = 'Greeting my fellow island companion';
      actionType = 'SPEAK';
      dialogue = context.characterId === 'naufal' 
        ? 'Halo! Senang melihatmu di dekat sini.' 
        : 'Hai Naufal, bagaimana keadaanmu hari ini?';
    }

    return {
      schemaVersion: 2,
      requestId: `fallback-${context.characterId}-${Date.now()}`,
      characterId: context.characterId,
      internalThought: `[Deterministic Thought]: ${motivation}.`,
      activeMotivation: motivation,
      simulatedEmotion: {
        valence: 0.2,
        arousal: 0.3,
        label: 'calm',
      },
      action: {
        type: actionType,
        targetTile: { x: targetTile.x, y: targetTile.y },
        dialogue,
      },
      memoryCandidate: {
        content: `I paused and observed my surroundings at ${context.currentPosition.landmark}.`,
        importance: 2,
        confidence: 0.9,
      },
    };
  }
}
