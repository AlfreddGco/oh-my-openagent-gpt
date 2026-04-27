export type FallbackEntry = {
  providers: string[];
  model: string;
  variant?: string; // Entry-specific variant (e.g., GPT→high, Opus→max)
  reasoningEffort?: string;
  temperature?: number;
  top_p?: number;
  maxTokens?: number;
  thinking?: { type: "enabled" | "disabled"; budgetTokens?: number };
};

export type ModelRequirement = {
  fallbackChain: FallbackEntry[];
  variant?: string; // Default variant (used when entry doesn't specify one)
  requiresModel?: string; // If set, only activates when this model is available (fuzzy match)
  requiresAnyModel?: boolean; // If true, requires at least ONE model in fallbackChain to be available (or empty availability treated as unavailable)
  requiresProvider?: string[]; // If set, only activates when any of these providers is connected
};

export const AGENT_MODEL_REQUIREMENTS: Record<string, ModelRequirement> = {
  sisyphus: {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      { providers: ["vercel"], model: "kimi-k2.5" },
      { providers: ["vercel"], model: "k2p5" },
      { providers: ["vercel"], model: "kimi-k2.5" },
      { providers: ["openai"], model: "gpt-5.5", variant: "medium" },
      { providers: ["vercel"], model: "glm-5" },
      { providers: ["vercel"], model: "big-pickle" },
    ],
    requiresAnyModel: true,
  },
  hephaestus: {
    fallbackChain: [
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "medium",
      },
    ],
    requiresProvider: ["openai"],
  },
  oracle: {
    fallbackChain: [
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "high",
      },
      {
        providers: ["vercel"],
        model: "gemini-3.1-pro",
        variant: "high",
      },
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      { providers: ["vercel"], model: "glm-5" },
    ],
  },
  librarian: {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.4-mini-fast" },
      { providers: ["vercel"], model: "minimax-m2.7-highspeed" },
      { providers: ["vercel"], model: "minimax-m2.7" },
      { providers: ["openai"], model: "gpt-5.4-mini-fast" },
      { providers: ["openai"], model: "gpt-5.4-nano" },
    ],
  },
  explore: {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.4-mini-fast" },
      { providers: ["vercel"], model: "minimax-m2.7-highspeed" },
      { providers: ["vercel"], model: "minimax-m2.7" },
      { providers: ["openai"], model: "gpt-5.4-mini-fast" },
      { providers: ["openai"], model: "gpt-5.4-nano" },
    ],
  },
  "multimodal-looker": {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "medium" },
      { providers: ["vercel"], model: "kimi-k2.5" },
      { providers: ["vercel"], model: "glm-4.6v" },
      { providers: ["openai"], model: "gpt-5-nano" },
    ],
  },
  prometheus: {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "high",
      },
      { providers: ["vercel"], model: "glm-5" },
      {
        providers: ["vercel"],
        model: "gemini-3.1-pro",
      },
    ],
  },
  metis: {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "high",
      },
      { providers: ["vercel"], model: "glm-5" },
      { providers: ["vercel"], model: "k2p5" },
    ],
  },
  momus: {
    fallbackChain: [
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "xhigh",
      },
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      {
        providers: ["vercel"],
        model: "gemini-3.1-pro",
        variant: "high",
      },
      { providers: ["vercel"], model: "glm-5" },
    ],
  },
  atlas: {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "medium" },
      { providers: ["vercel"], model: "kimi-k2.5" },
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "medium",
      },
      { providers: ["vercel"], model: "minimax-m2.7" },
    ],
  },
  "sisyphus-junior": {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "medium" },
      { providers: ["vercel"], model: "kimi-k2.5" },
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "medium",
      },
      { providers: ["vercel"], model: "minimax-m2.7" },
      { providers: ["vercel"], model: "big-pickle" },
    ],
  },
};

export const CATEGORY_MODEL_REQUIREMENTS: Record<string, ModelRequirement> = {
  "visual-engineering": {
    fallbackChain: [
      {
        providers: ["vercel"],
        model: "gemini-3.1-pro",
        variant: "high",
      },
      { providers: ["vercel"], model: "glm-5" },
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      { providers: ["vercel"], model: "glm-5" },
      { providers: ["vercel"], model: "k2p5" },
    ],
  },
  ultrabrain: {
    fallbackChain: [
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "xhigh",
      },
      {
        providers: ["vercel"],
        model: "gemini-3.1-pro",
        variant: "high",
      },
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      { providers: ["vercel"], model: "glm-5" },
    ],
  },
  deep: {
    fallbackChain: [
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "medium",
      },
      {
        providers: ["vercel"],
        model: "gemini-3.1-pro",
        variant: "high",
      },
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
    ],
  },
  artistry: {
    fallbackChain: [
      {
        providers: ["vercel"],
        model: "gemini-3.1-pro",
        variant: "high",
      },
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      { providers: ["openai"], model: "gpt-5.5" },
    ],
    requiresModel: "gemini-3.1-pro",
  },
  quick: {
    fallbackChain: [
      {
        providers: ["openai"],
        model: "gpt-5.4-mini",
      },
      {
        providers: ["openai"],
        model: "gpt-5.4-mini-fast",
      },
      {
        providers: ["vercel"],
        model: "gemini-3-flash",
      },
      { providers: ["vercel"], model: "minimax-m2.7" },
      { providers: ["openai"], model: "gpt-5-nano" },
    ],
  },
  "unspecified-low": {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "medium" },
      {
        providers: ["openai"],
        model: "gpt-5.3-codex",
        variant: "medium",
      },
      { providers: ["vercel"], model: "kimi-k2.5" },
      {
        providers: ["vercel"],
        model: "gemini-3-flash",
      },
      { providers: ["vercel"], model: "minimax-m2.7" },
    ],
  },
  "unspecified-high": {
    fallbackChain: [
      { providers: ["openai"], model: "gpt-5.5", variant: "xhigh" },
      {
        providers: ["openai"],
        model: "gpt-5.5",
        variant: "high",
      },
      { providers: ["vercel"], model: "glm-5" },
      { providers: ["vercel"], model: "k2p5" },
      { providers: ["vercel"], model: "glm-5" },
      { providers: ["vercel"], model: "kimi-k2.5" },
      { providers: ["vercel"], model: "kimi-k2.5" },
    ],
  },
  writing: {
    fallbackChain: [
      {
        providers: ["vercel"],
        model: "gemini-3-flash",
      },
      { providers: ["vercel"], model: "kimi-k2.5" },
      { providers: ["openai"], model: "gpt-5.5", variant: "medium" },
      { providers: ["vercel"], model: "minimax-m2.7" },
    ],
  },
};
