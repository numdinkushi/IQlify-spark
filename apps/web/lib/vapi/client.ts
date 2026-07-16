import { buildAssistantOverrides } from "@/lib/vapi/prompts";
import type { SkillLevel } from "@iqlify-spark/domain";

export type VapiCallConfig = {
  assistantId: string;
  durationMinutes?: number;
  skillLevel?: SkillLevel;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onError?: (error: unknown) => void;
  onMessage?: (message: unknown) => void;
  onCallId?: (callId: string) => void;
};

export class VapiService {
  private static instance: VapiService;
  private client: {
    on: (event: string, handler: (...args: unknown[]) => void) => void;
    start: (
      assistantId: string,
      overrides?: Record<string, unknown>,
    ) => Promise<{ id?: string } | null>;
    stop: () => void;
  } | null = null;

  static getInstance(): VapiService {
    if (!VapiService.instance) {
      VapiService.instance = new VapiService();
    }
    return VapiService.instance;
  }

  async startCall(config: VapiCallConfig): Promise<string | null> {
    if (!config.assistantId) {
      throw new Error("Assistant ID is required");
    }

    const token = process.env.NEXT_PUBLIC_VAPI_WEBTOKEN;
    if (!token) {
      throw new Error("NEXT_PUBLIC_VAPI_WEBTOKEN is not set");
    }

    const Vapi = (await import("@vapi-ai/web")).default;
    this.client = new Vapi(token) as typeof this.client;

    if (!this.client) throw new Error("Failed to create Vapi client");

    if (config.onCallStart) {
      this.client.on("call-start", () => config.onCallStart?.());
    }
    if (config.onCallEnd) {
      this.client.on("call-end", () => config.onCallEnd?.());
    }
    if (config.onError) {
      this.client.on("error", (error) => config.onError?.(error));
    }
    if (config.onMessage) {
      this.client.on("message", (message) => config.onMessage?.(message));
    }
    if (config.onCallId) {
      this.client.on("call-start-success", (event) => {
        const callId = (event as { callId?: string } | undefined)?.callId;
        if (callId && callId !== "unknown") config.onCallId?.(callId);
      });
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      // Vapi will request mic permission if needed
    }

    const durationMinutes = config.durationMinutes ?? 10;
    const skillLevel = config.skillLevel ?? "intermediate";
    const overrides = buildAssistantOverrides({
      skillLevel,
      durationMinutes,
    });

    const webCall = await this.client.start(config.assistantId, overrides);
    const callId = webCall?.id ?? null;
    if (callId) config.onCallId?.(callId);
    return callId;
  }

  endCall(): void {
    this.client?.stop();
    this.client = null;
  }
}

export function getTechnicalAssistantId(): string {
  const id = process.env.NEXT_PUBLIC_VAPI_TECHNICAL_ASSISTANT_ID;
  if (!id) {
    throw new Error("NEXT_PUBLIC_VAPI_TECHNICAL_ASSISTANT_ID is not set");
  }
  return id;
}

export function isVapiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VAPI_ENABLED === "true";
}
