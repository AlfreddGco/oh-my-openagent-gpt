/**
 * Model version migration map: old full model strings → new full model strings.
 * Used to auto-upgrade hardcoded model versions in user configs when the plugin
 * bumps to newer model versions.
 *
 * Keys are full "provider/model" strings.
 */
export const MODEL_VERSION_MAP: Record<string, string> = {
  "anthropic/claude-opus-4-5": "openai/gpt-5.5",
  "anthropic/claude-opus-4-6": "openai/gpt-5.5",
  "anthropic/claude-opus-4-7": "openai/gpt-5.5",
  "anthropic/claude-sonnet-4-5": "openai/gpt-5.5",
  "anthropic/claude-sonnet-4-6": "openai/gpt-5.5",
  "anthropic/claude-haiku-4-5": "openai/gpt-5.4-mini-fast",
  "google/gemini-3.1-pro": "vercel/google/gemini-3.1-pro-preview",
  "google/gemini-3.1-pro-preview": "vercel/google/gemini-3.1-pro-preview",
  "google/gemini-3-flash": "vercel/google/gemini-3-flash",
  "google/gemini-3-flash-preview": "vercel/google/gemini-3-flash",
  "github-copilot/claude-opus-4.7": "openai/gpt-5.5",
  "github-copilot/claude-sonnet-4.6": "openai/gpt-5.5",
  "github-copilot/claude-haiku-4.5": "openai/gpt-5.4-mini-fast",
  "opencode/claude-opus-4-7": "openai/gpt-5.5",
  "opencode/claude-sonnet-4-6": "openai/gpt-5.5",
  "opencode/claude-haiku-4-5": "openai/gpt-5.4-mini-fast",
  "opencode/gpt-5-nano": "openai/gpt-5-nano",
  "opencode/kimi-k2.5-free": "vercel/moonshotai/kimi-k2.5",
  "opencode/big-pickle": "vercel/big-pickle",
  "opencode-go/minimax-m2.7": "vercel/minimax/minimax-m2.7",
  "opencode-go/minimax-m2.7-highspeed": "vercel/minimax/minimax-m2.7-highspeed",
  "zai-coding-plan/glm-5": "vercel/zai/glm-5",
  "zai-coding-plan/glm-4.6v": "vercel/zai/glm-4.6v",
  "kimi-for-coding/k2p5": "vercel/k2p5",
  "openai/gpt-5.3-codex": "openai/gpt-5.4",
  "openai/gpt-5.4": "openai/gpt-5.5",
  "openai/gpt-5.5-preview": "openai/gpt-5.5",
}

function migrationKey(oldModel: string, newModel: string): string {
  return `model-version:${oldModel}->${newModel}`
}

export function migrateModelVersions(
  configs: Record<string, unknown>,
  appliedMigrations?: Set<string>
): { migrated: Record<string, unknown>; changed: boolean; newMigrations: string[] } {
  const migrated: Record<string, unknown> = {}
  let changed = false
  const newMigrations: string[] = []

  for (const [key, value] of Object.entries(configs)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const config = value as Record<string, unknown>
      if (typeof config.model === "string" && MODEL_VERSION_MAP[config.model]) {
        const oldModel = config.model
        const newModel = MODEL_VERSION_MAP[oldModel]
        const mKey = migrationKey(oldModel, newModel)

        // Skip if this migration was already applied (user may have reverted)
        if (appliedMigrations?.has(mKey)) {
          migrated[key] = value
          continue
        }

        migrated[key] = { ...config, model: newModel }
        changed = true
        newMigrations.push(mKey)
        continue
      }
    }
    migrated[key] = value
  }

  return { migrated, changed, newMigrations }
}
