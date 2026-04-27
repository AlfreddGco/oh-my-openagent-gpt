/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test"

import { generateModelConfig } from "./model-fallback"
import type { InstallConfig } from "./types"

function createConfig(overrides: Partial<InstallConfig> = {}): InstallConfig {
  return {
    hasClaude: false,
    isMax20: false,
    hasOpenAI: false,
    hasGemini: false,
    hasCopilot: false,
    hasOpencodeZen: false,
    hasZaiCodingPlan: false,
    hasKimiForCoding: false,
    hasOpencodeGo: false,
    hasVercelAiGateway: false,
    ...overrides,
  }
}

describe("generateModelConfig", () => {
  describe("no providers available", () => {
    test("returns ULTIMATE_FALLBACK for all agents and categories when no providers", () => {
      // #given no providers are available
      const config = createConfig()

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use ULTIMATE_FALLBACK for everything
      expect(result).toMatchSnapshot()
    })
  })

  describe("single native provider", () => {
    test("avoids Anthropic agent defaults when only Claude is available", () => {
      // #given only Claude is available
      const config = createConfig({ hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should avoid Anthropic agent defaults
      expect(result).toMatchSnapshot()
    })

    test("avoids Anthropic agent defaults with isMax20 flag", () => {
      // #given Claude is available with Max 20 plan
      const config = createConfig({ hasClaude: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should avoid Anthropic agent defaults even on Max 20
      expect(result).toMatchSnapshot()
    })

    test("uses OpenAI models when only OpenAI is available", () => {
      // #given only OpenAI is available
      const config = createConfig({ hasOpenAI: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use OpenAI models
      expect(result).toMatchSnapshot()
    })

    test("uses OpenAI models with isMax20 flag", () => {
      // #given OpenAI is available with Max 20 plan
      const config = createConfig({ hasOpenAI: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported Gemini-only availability", () => {
      // #given only Gemini is available
      const config = createConfig({ hasGemini: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported native Gemini should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported Gemini-only availability with isMax20 flag", () => {
      // #given Gemini is available with Max 20 plan
      const config = createConfig({ hasGemini: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported native Gemini should not affect routing
      expect(result).toMatchSnapshot()
    })
  })

  describe("all native providers", () => {
    test("uses supported-provider routing when all native providers are available", () => {
      // #given all native providers are available
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then OpenAI and Vercel-capable entries should win
      expect(result).toMatchSnapshot()
    })

    test("uses supported-provider routing with isMax20 flag when all native providers are available", () => {
      // #given all native providers are available with Max 20 plan
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
        isMax20: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then OpenAI and Vercel-capable entries should win
      expect(result).toMatchSnapshot()
    })
  })

  describe("fallback providers", () => {
    test("ignores unsupported OpenCode Zen-only availability", () => {
      // #given only OpenCode Zen is available
      const config = createConfig({ hasOpencodeZen: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported OpenCode Zen-only availability with isMax20 flag", () => {
      // #given OpenCode Zen is available with Max 20 plan
      const config = createConfig({ hasOpencodeZen: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported Copilot-only availability", () => {
      // #given only GitHub Copilot is available
      const config = createConfig({ hasCopilot: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported Copilot-only availability with isMax20 flag", () => {
      // #given GitHub Copilot is available with Max 20 plan
      const config = createConfig({ hasCopilot: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported ZAI-only availability", () => {
      // #given only ZAI is available
      const config = createConfig({ hasZaiCodingPlan: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported ZAI-only availability with isMax20 flag", () => {
      // #given ZAI is available with Max 20 plan
      const config = createConfig({ hasZaiCodingPlan: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })
  })

  describe("mixed provider scenarios", () => {
    test("ignores unsupported Claude + OpenCode Zen combination", () => {
      // #given Claude and OpenCode Zen are available
      const config = createConfig({
        hasClaude: true,
        hasOpencodeZen: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("uses OpenAI and ignores unsupported Copilot", () => {
      // #given OpenAI and Copilot are available
      const config = createConfig({
        hasOpenAI: true,
        hasCopilot: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then OpenAI should remain the only supported provider
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported Claude + ZAI combination", () => {
      // #given Claude and ZAI are available
      const config = createConfig({
        hasClaude: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores unsupported Gemini + Claude combination", () => {
      // #given Gemini and Claude are available
      const config = createConfig({
        hasGemini: true,
        hasClaude: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("ignores all unsupported fallback providers together", () => {
      // #given all fallback providers are available
      const config = createConfig({
        hasOpencodeZen: true,
        hasCopilot: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then unsupported providers should not affect routing
      expect(result).toMatchSnapshot()
    })

    test("uses supported providers when all providers are available", () => {
      // #given all providers are available
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
        hasOpencodeZen: true,
        hasCopilot: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then only OpenAI and Vercel-routed models should remain
      expect(result).toMatchSnapshot()
    })

    test("uses supported providers with isMax20 flag when all providers are available", () => {
      // #given all providers are available with Max 20 plan
      const config = createConfig({
        hasClaude: true,
        hasOpenAI: true,
        hasGemini: true,
        hasOpencodeZen: true,
        hasCopilot: true,
        hasZaiCodingPlan: true,
        isMax20: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then only OpenAI and Vercel-routed models should remain
      expect(result).toMatchSnapshot()
    })
  })

  describe("explore agent special cases", () => {
    test("explore uses gpt-5-nano when only Gemini available (no Claude)", () => {
      // #given only Gemini is available (no Claude)
      const config = createConfig({ hasGemini: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use gpt-5-nano (Claude haiku not available)
      expect(result.agents?.explore?.model).toBe("openai/gpt-5-nano")
    })

    test("explore uses gpt-5-nano when only Claude is available", () => {
      // #given Claude is available
      const config = createConfig({ hasClaude: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use the non-Anthropic ultimate fallback
      expect(result.agents?.explore?.model).toBe("openai/gpt-5-nano")
    })

    test("explore uses gpt-5-nano regardless of isMax20 flag", () => {
      // #given Claude is available without Max 20 plan
      const config = createConfig({ hasClaude: true, isMax20: false })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should keep the same non-Anthropic fallback
      expect(result.agents?.explore?.model).toBe("openai/gpt-5-nano")
    })

    test("explore uses OpenAI model when only OpenAI available", () => {
      // #given only OpenAI is available
      const config = createConfig({ hasOpenAI: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use native OpenAI mini-fast (primary model)
      expect(result.agents?.explore?.model).toBe("openai/gpt-5.4-mini-fast")
      expect(result.agents?.explore?.variant).toBeUndefined()
    })

    test("explore ignores unsupported Copilot-only availability", () => {
      // #given only Copilot is available
      const config = createConfig({ hasCopilot: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should fall back to the supported-provider default
      expect(result.agents?.explore?.model).toBe("openai/gpt-5-nano")
    })
  })

  describe("Sisyphus agent special cases", () => {
    test("Sisyphus is omitted when only Claude is available", () => {
      // #given
      const config = createConfig({ hasClaude: true, isMax20: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.sisyphus).toBeUndefined()
    })

    test("Sisyphus is omitted when only unsupported providers are available", () => {
      // #given
      const config = createConfig({
        hasClaude: true,
        hasKimiForCoding: true,
        hasOpencodeZen: true,
        hasZaiCodingPlan: true,
        isMax20: true,
      })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.sisyphus).toBeUndefined()
    })

    test("Sisyphus resolves to gpt-5.5 xhigh when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.sisyphus?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.sisyphus?.variant).toBe("xhigh")
    })
  })

  describe("OpenAI fallback coverage", () => {
    test("Atlas resolves to OpenAI when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.atlas?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.atlas?.variant).toBe("medium")
    })

    test("Metis resolves to OpenAI when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.metis?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.metis?.variant).toBe("xhigh")
    })

    test("Sisyphus-Junior resolves to OpenAI when only OpenAI is available", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.["sisyphus-junior"]?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.["sisyphus-junior"]?.variant).toBe("medium")
    })
  })

  describe("Hephaestus agent special cases", () => {
    test("Hephaestus is created when OpenAI is available (openai provider connected)", () => {
      // #given
      const config = createConfig({ hasOpenAI: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.hephaestus?.variant).toBe("medium")
    })

    test("Hephaestus ignores unsupported Copilot-only availability", () => {
      // #given
      const config = createConfig({ hasCopilot: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus).toEqual({
        model: "openai/gpt-5-nano",
      })
    })

    test("Hephaestus falls back when only unsupported OpenCode Zen is available", () => {
      // #given
      const config = createConfig({ hasOpencodeZen: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus?.model).toBe("openai/gpt-5-nano")
      expect(result.agents?.hephaestus?.variant).toBeUndefined()
    })

    test("Hephaestus falls back to gpt-5-nano when only Claude is available", () => {
      // #given
      const config = createConfig({ hasClaude: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus?.model).toBe("openai/gpt-5-nano")
    })

    test("Hephaestus falls back when only unsupported Gemini is available", () => {
      // #given
      const config = createConfig({ hasGemini: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus?.model).toBe("openai/gpt-5-nano")
    })

    test("Hephaestus falls back when only unsupported ZAI is available", () => {
      // #given
      const config = createConfig({ hasZaiCodingPlan: true })

      // #when
      const result = generateModelConfig(config)

      // #then
      expect(result.agents?.hephaestus?.model).toBe("openai/gpt-5-nano")
    })
  })

  describe("librarian agent special cases", () => {
    test("librarian ignores unsupported ZAI-only availability", () => {
      // #given ZAI and Claude are available
      const config = createConfig({
        hasClaude: true,
        hasZaiCodingPlan: true,
      })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should fall back to the supported-provider default
      expect(result.agents?.librarian?.model).toBe("openai/gpt-5-nano")
    })

    test("librarian falls back to gpt-5-nano when only Claude is available", () => {
      // #given only Claude is available (no openai, opencode-go, or ZAI)
      const config = createConfig({ hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should use the non-Anthropic ultimate fallback
      expect(result.agents?.librarian?.model).toBe("openai/gpt-5-nano")
    })
  })

  describe("special-case agents include fallback_models", () => {
    test("explore omits fallback_models when OpenAI and ignored Claude are both available", () => {
      // #given both OpenAI and Claude are available
      const config = createConfig({ hasOpenAI: true, hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then Claude availability should not add Anthropic fallbacks
      expect(result.agents?.explore?.model).toBe("openai/gpt-5.4-mini-fast")
      expect(result.agents?.explore?.fallback_models).toBeUndefined()
    })

    test("explore omits fallback_models when only one provider matches chain entries", () => {
      // #given only Claude is available
      const config = createConfig({ hasClaude: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should not have fallback_models (only the ultimate fallback remains)
      expect(result.agents?.explore?.model).toBe("openai/gpt-5-nano")
      expect(result.agents?.explore?.fallback_models).toBeUndefined()
    })

    test("librarian ignores unsupported opencode-go when OpenAI is available", () => {
      // #given OpenAI and opencode-go are available
      const config = createConfig({ hasOpenAI: true, hasOpencodeGo: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should resolve from the OpenAI-only override set
      expect(result.agents?.librarian?.model).toBe("openai/gpt-5.4-mini-fast")
      expect(result.agents?.librarian?.fallback_models).toBeUndefined()
    })

    test("librarian falls back cleanly when only unsupported ZAI is available", () => {
      // #given only ZAI is available
      const config = createConfig({ hasZaiCodingPlan: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should not have fallback_models
      expect(result.agents?.librarian?.model).toBe("openai/gpt-5-nano")
      expect(result.agents?.librarian?.fallback_models).toBeUndefined()
    })
  })

  describe("Vercel AI Gateway provider", () => {
    test("uses vercel/ model strings when only Vercel AI Gateway is available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use vercel/<sub-provider>/<model> format
      expect(result).toMatchSnapshot()
    })

    test("uses vercel/ model strings with isMax20 flag", () => {
      // #given Vercel AI Gateway is available with Max 20 plan
      const config = createConfig({ hasVercelAiGateway: true, isMax20: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should use higher capability models via gateway
      expect(result).toMatchSnapshot()
    })

    test("explore uses a Vercel-routed non-GPT model when only gateway available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then explore should use the first supported Vercel fallback
      expect(result.agents?.explore?.model).toBe("vercel/minimax/minimax-m2.7-highspeed")
    })

    test("librarian uses a Vercel-routed non-GPT model when only gateway available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then librarian should use the first supported Vercel fallback
      expect(result.agents?.librarian?.model).toBe("vercel/minimax/minimax-m2.7-highspeed")
    })

    test("Hephaestus is omitted when only Vercel AI Gateway is available", () => {
      // #given only Vercel AI Gateway is available
      const config = createConfig({ hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then hephaestus should be omitted because its chain is OpenAI-only
      expect(result.agents?.hephaestus).toBeUndefined()
    })

    test("native providers take priority over gateway", () => {
      // #given OpenAI and Vercel AI Gateway are both available
      const config = createConfig({ hasOpenAI: true, hasVercelAiGateway: true })

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then restored fallback order should still prefer Kimi before later GPT entries
      expect(result.agents?.sisyphus?.model).toBe("openai/gpt-5.5")
      expect(result.agents?.sisyphus?.variant).toBe("xhigh")
    })
  })

  describe("schema URL", () => {
    test("always includes correct schema URL", () => {
      // #given any config
      const config = createConfig()

      // #when generateModelConfig is called
      const result = generateModelConfig(config)

      // #then should include correct schema URL
      expect(result.$schema).toBe(
        "https://raw.githubusercontent.com/AlfreddGco/oh-my-openagent-gpt/dev/assets/oh-my-openagent-gpt.schema.json"
      )
    })
  })
})
