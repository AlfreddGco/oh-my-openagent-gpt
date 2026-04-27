import { describe, expect, test } from "bun:test"
import {
  AGENT_MODEL_REQUIREMENTS,
  CATEGORY_MODEL_REQUIREMENTS,
  type FallbackEntry,
  type ModelRequirement,
} from "./model-requirements"

describe("AGENT_MODEL_REQUIREMENTS", () => {
  test("oracle has valid fallbackChain with gpt-5.5 as primary", () => {
    // given - oracle agent requirement
    const oracle = AGENT_MODEL_REQUIREMENTS["oracle"]

    // when - accessing oracle requirement
    // then - fallbackChain exists with gpt-5.5 as first entry
    expect(oracle).toBeDefined()
    expect(oracle.fallbackChain).toBeArray()
    expect(oracle.fallbackChain.length).toBeGreaterThan(0)

    const primary = oracle.fallbackChain[0]
    expect(primary.providers).toContain("openai")
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.variant).toBe("high")
  })

  test("sisyphus keeps the Opus-equivalent GPT primary and preserves Vercel fallbacks", () => {
    // #given - sisyphus agent requirement
    const sisyphus = AGENT_MODEL_REQUIREMENTS["sisyphus"]

    // #when - accessing Sisyphus requirement
    // #then - Anthropic Opus is replaced with GPT-5.5, and non-OpenAI fallbacks stay Vercel-routed
    expect(sisyphus).toBeDefined()
    expect(sisyphus.fallbackChain).toBeArray()
    expect(sisyphus.fallbackChain).toHaveLength(7)
    expect(sisyphus.requiresAnyModel).toBe(true)

    const primary = sisyphus.fallbackChain[0]
    expect(primary.providers).toEqual(["openai"])
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.variant).toBe("xhigh")

    const second = sisyphus.fallbackChain[1]
    expect(second.providers).toEqual(["vercel"])
    expect(second.model).toBe("kimi-k2.5")

    const third = sisyphus.fallbackChain[2]
    expect(third.providers).toEqual(["vercel"])
    expect(third.model).toBe("k2p5")

    const fourth = sisyphus.fallbackChain[3]
    expect(fourth.providers).toEqual(["vercel"])
    expect(fourth.model).toBe("kimi-k2.5")

    const fifth = sisyphus.fallbackChain[4]
    expect(fifth.model).toBe("gpt-5.5")
    expect(fifth.variant).toBe("medium")

    const sixth = sisyphus.fallbackChain[5]
    expect(sixth.providers).toEqual(["vercel"])
    expect(sixth.model).toBe("glm-5")

    const last = sisyphus.fallbackChain[6]
    expect(last.providers[0]).toBe("vercel")
    expect(last.model).toBe("big-pickle")
  })

  test("librarian has valid fallbackChain with openai/gpt-5.4-mini-fast as primary", () => {
    // given - librarian agent requirement
    const librarian = AGENT_MODEL_REQUIREMENTS["librarian"]

    // when - accessing librarian requirement
    // then - fallbackChain exists with openai/gpt-5.4-mini-fast as first entry
    expect(librarian).toBeDefined()
    expect(librarian.fallbackChain).toBeArray()
    expect(librarian.fallbackChain).toHaveLength(5)

    const primary = librarian.fallbackChain[0]
    expect(primary.providers).toEqual(["openai"])
    expect(primary.model).toBe("gpt-5.4-mini-fast")

    const second = librarian.fallbackChain[1]
	    expect(second.providers[0]).toBe("vercel")
    expect(second.model).toBe("minimax-m2.7-highspeed")

    const tertiary = librarian.fallbackChain[2]
	    expect(tertiary.providers[0]).toBe("vercel")
    expect(tertiary.model).toBe("minimax-m2.7")

    const quaternary = librarian.fallbackChain[3]
    expect(quaternary.providers).toContain("openai")
    expect(quaternary.model).toBe("gpt-5.4-mini-fast")

    const quinary = librarian.fallbackChain[4]
    expect(quinary.providers).toContain("openai")
    expect(quinary.model).toBe("gpt-5.4-nano")
  })

  test("explore has valid fallbackChain with openai/gpt-5.4-mini-fast as primary", () => {
    // given - explore agent requirement
    const explore = AGENT_MODEL_REQUIREMENTS["explore"]

    // when - accessing explore requirement
    expect(explore).toBeDefined()
    expect(explore.fallbackChain).toBeArray()
    expect(explore.fallbackChain).toHaveLength(5)

    const primary = explore.fallbackChain[0]
    expect(primary.providers).toEqual(["openai"])
    expect(primary.model).toBe("gpt-5.4-mini-fast")

    const secondary = explore.fallbackChain[1]
	    expect(secondary.providers).toContain("vercel")
    expect(secondary.model).toBe("minimax-m2.7-highspeed")

    const tertiary = explore.fallbackChain[2]
	    expect(tertiary.providers).toContain("vercel")
    expect(tertiary.model).toBe("minimax-m2.7")

    const quaternary = explore.fallbackChain[3]
    expect(quaternary.providers).toContain("openai")
    expect(quaternary.model).toBe("gpt-5.4-mini-fast")

    const quinary = explore.fallbackChain[4]
    expect(quinary.providers).toContain("openai")
    expect(quinary.model).toBe("gpt-5.4-nano")
  })

  test("multimodal-looker has valid fallbackChain with gpt-5.5 as primary", () => {
    // given - multimodal-looker agent requirement
    const multimodalLooker = AGENT_MODEL_REQUIREMENTS["multimodal-looker"]

    // when - accessing multimodal-looker requirement
    // then - fallbackChain: gpt-5.5 -> opencode-go/kimi-k2.5 -> glm-4.6v -> gpt-5-nano
    expect(multimodalLooker).toBeDefined()
    expect(multimodalLooker.fallbackChain).toBeArray()
    expect(multimodalLooker.fallbackChain).toHaveLength(4)

    const primary = multimodalLooker.fallbackChain[0]
	    expect(primary.providers).toEqual(["openai"])
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.variant).toBe("medium")

    const secondary = multimodalLooker.fallbackChain[1]
	    expect(secondary.providers).toEqual(["vercel"])
    expect(secondary.model).toBe("kimi-k2.5")

    const tertiary = multimodalLooker.fallbackChain[2]
    expect(tertiary.model).toBe("glm-4.6v")

    const last = multimodalLooker.fallbackChain[3]
	    expect(last.providers).toEqual(["openai"])
    expect(last.model).toBe("gpt-5-nano")
  })

  test("prometheus upgrades Opus fallback to GPT-5.5 xhigh", () => {
    // #given - prometheus agent requirement
    const prometheus = AGENT_MODEL_REQUIREMENTS["prometheus"]

    // #when - accessing Prometheus requirement
    // #then - Opus is replaced by GPT-5.5 xhigh ahead of the existing GPT-high fallback
    expect(prometheus).toBeDefined()
    expect(prometheus.fallbackChain).toBeArray()
    expect(prometheus.fallbackChain.length).toBeGreaterThan(1)

    const primary = prometheus.fallbackChain[0]
    expect(primary.model).toBe("gpt-5.5")
	    expect(primary.providers).toEqual(["openai"])
    expect(primary.variant).toBe("xhigh")
  })

  test("metis upgrades Opus fallback to GPT-5.5 xhigh", () => {
    // #given - metis agent requirement
    const metis = AGENT_MODEL_REQUIREMENTS["metis"]

    // #when - accessing Metis requirement
    // #then - Opus is replaced by GPT-5.5 xhigh ahead of the existing GPT-high fallback
    expect(metis).toBeDefined()
    expect(metis.fallbackChain).toBeArray()
    expect(metis.fallbackChain.length).toBeGreaterThan(1)

    const primary = metis.fallbackChain[0]
    expect(primary.model).toBe("gpt-5.5")
	    expect(primary.providers).toEqual(["openai"])
    expect(primary.variant).toBe("xhigh")

    const openAiFallback = metis.fallbackChain.find((entry) => entry.providers.includes("openai"))
    expect(openAiFallback).toEqual({
      providers: ["openai"],
      model: "gpt-5.5",
      variant: "xhigh",
    })
  })

  test("momus has valid fallbackChain with gpt-5.5 as primary", () => {
    // given - momus agent requirement
    const momus = AGENT_MODEL_REQUIREMENTS["momus"]

    // when - accessing Momus requirement
    // then - fallbackChain exists with gpt-5.5 as first entry, variant xhigh
    expect(momus).toBeDefined()
    expect(momus.fallbackChain).toBeArray()
    expect(momus.fallbackChain.length).toBeGreaterThan(0)

    const primary = momus.fallbackChain[0]
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.variant).toBe("xhigh")
    expect(primary.providers[0]).toBe("openai")
  })

  test("atlas replaces Sonnet with GPT-5.5 medium while keeping Vercel fallbacks", () => {
    // given - atlas agent requirement
    const atlas = AGENT_MODEL_REQUIREMENTS["atlas"]

    // when - accessing Atlas requirement
    // then - Sonnet is replaced by GPT-5.5 medium, followed by the original non-OpenAI fallbacks
    expect(atlas).toBeDefined()
    expect(atlas.fallbackChain).toBeArray()
    expect(atlas.fallbackChain).toHaveLength(4)

    const primary = atlas.fallbackChain[0]
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.providers[0]).toBe("openai")
    expect(primary.variant).toBe("medium")

    const secondary = atlas.fallbackChain[1]
    expect(secondary.model).toBe("kimi-k2.5")
    expect(secondary.providers[0]).toBe("vercel")

    const tertiary = atlas.fallbackChain[2]
    expect(tertiary.model).toBe("gpt-5.5")
    expect(tertiary.providers[0]).toBe("openai")
    expect(tertiary.variant).toBe("medium")

    const quaternary = atlas.fallbackChain[3]
    expect(quaternary.model).toBe("minimax-m2.7")
    expect(quaternary.providers[0]).toBe("vercel")
  })

  test("sisyphus-junior replaces Sonnet with GPT-5.5 medium and keeps big-pickle last", () => {
    // given - sisyphus-junior agent requirement
    const sisyphusJunior = AGENT_MODEL_REQUIREMENTS["sisyphus-junior"]

    // when - locating the OpenAI fallback entry
    const openAiFallback = sisyphusJunior.fallbackChain.find((entry) => entry.providers.includes("openai"))
    const openAiFallbackIndex = sisyphusJunior.fallbackChain.findIndex((entry) => entry.providers.includes("openai"))
    const minimaxIndex = sisyphusJunior.fallbackChain.findIndex((entry) => entry.model === "minimax-m2.7")
    const bigPickleIndex = sisyphusJunior.fallbackChain.findIndex((entry) => entry.model === "big-pickle")

    // then
    expect(openAiFallback).toEqual({
	      providers: ["openai"],
      model: "gpt-5.5",
      variant: "medium",
    })
    expect(openAiFallbackIndex).toBeGreaterThan(-1)
    expect(minimaxIndex).toBeGreaterThan(openAiFallbackIndex)
    expect(bigPickleIndex).toBeGreaterThan(minimaxIndex)
    expect(sisyphusJunior.fallbackChain[0]?.model).toBe("gpt-5.5")
  })

  test("hephaestus is openai-only", () => {
    // #given - hephaestus agent requirement
    const hephaestus = AGENT_MODEL_REQUIREMENTS["hephaestus"]

    // #when - accessing hephaestus requirement
    // #then - requiresProvider only includes openai
    expect(hephaestus).toBeDefined()
	    expect(hephaestus.requiresProvider).toEqual(["openai"])
    expect(hephaestus.requiresModel).toBeUndefined()
  })

  test("all 11 builtin agents have valid fallbackChain arrays", () => {
    // #given - list of 11 agent names
    const expectedAgents = [
      "sisyphus",
      "hephaestus",
      "oracle",
      "librarian",
      "explore",
      "multimodal-looker",
      "prometheus",
      "metis",
      "momus",
      "atlas",
      "sisyphus-junior",
    ]

    // when - checking AGENT_MODEL_REQUIREMENTS
    const definedAgents = Object.keys(AGENT_MODEL_REQUIREMENTS)

    // #then - all agents present with valid fallbackChain
    expect(definedAgents).toHaveLength(11)
    for (const agent of expectedAgents) {
      const requirement = AGENT_MODEL_REQUIREMENTS[agent]
      expect(requirement).toBeDefined()
      expect(requirement.fallbackChain).toBeArray()
      expect(requirement.fallbackChain.length).toBeGreaterThan(0)

      for (const entry of requirement.fallbackChain) {
        expect(entry.providers).toBeArray()
        expect(entry.providers.length).toBeGreaterThan(0)
        expect(typeof entry.model).toBe("string")
        expect(entry.model.length).toBeGreaterThan(0)
      }
    }
  })
})

describe("CATEGORY_MODEL_REQUIREMENTS", () => {
  test("ultrabrain has valid fallbackChain with gpt-5.5 as primary", () => {
    // given - ultrabrain category requirement
    const ultrabrain = CATEGORY_MODEL_REQUIREMENTS["ultrabrain"]

    // when - accessing ultrabrain requirement
    // then - fallbackChain exists with gpt-5.5 as first entry
    expect(ultrabrain).toBeDefined()
    expect(ultrabrain.fallbackChain).toBeArray()
    expect(ultrabrain.fallbackChain.length).toBeGreaterThan(0)

    const primary = ultrabrain.fallbackChain[0]
    expect(primary.variant).toBe("xhigh")
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.providers[0]).toBe("openai")
  })

  test("deep has valid fallbackChain with gpt-5.5 as primary", () => {
    // given - deep category requirement
    const deep = CATEGORY_MODEL_REQUIREMENTS["deep"]

    // when - accessing deep requirement
    // then - fallbackChain exists with gpt-5.5 as first entry, medium variant
    expect(deep).toBeDefined()
    expect(deep.fallbackChain).toBeArray()
    expect(deep.fallbackChain.length).toBeGreaterThan(0)

    const primary = deep.fallbackChain[0]
    expect(primary.variant).toBe("medium")
    expect(primary.model).toBe("gpt-5.5")
	    expect(primary.providers).toEqual(["openai"])
  })

  test("visual-engineering has valid fallbackChain with gemini-3.1-pro high as primary", () => {
    // given - visual-engineering category requirement
    const visualEngineering = CATEGORY_MODEL_REQUIREMENTS["visual-engineering"]

    // when - accessing visual-engineering requirement
    // then - fallbackChain: gemini-3.1-pro(high) → glm-5 → gpt-5.5(xhigh) → glm-5 → k2p5
    expect(visualEngineering).toBeDefined()
    expect(visualEngineering.fallbackChain).toBeArray()
    expect(visualEngineering.fallbackChain).toHaveLength(5)

    const primary = visualEngineering.fallbackChain[0]
    expect(primary.providers).toEqual(["vercel"])
    expect(primary.model).toBe("gemini-3.1-pro")
    expect(primary.variant).toBe("high")

    const second = visualEngineering.fallbackChain[1]
	    expect(second.providers[0]).toBe("vercel")
    expect(second.model).toBe("glm-5")

    const third = visualEngineering.fallbackChain[2]
    expect(third.providers[0]).toBe("openai")
    expect(third.model).toBe("gpt-5.5")
    expect(third.variant).toBe("xhigh")

    const fourth = visualEngineering.fallbackChain[3]
    expect(fourth.providers[0]).toBe("vercel")
    expect(fourth.model).toBe("glm-5")

    const fifth = visualEngineering.fallbackChain[4]
    expect(fifth.providers[0]).toBe("vercel")
    expect(fifth.model).toBe("k2p5")
  })

  test("quick has valid fallbackChain with gpt-5.4-mini as primary and gpt-5.4-mini-fast as secondary", () => {
    // given - quick category requirement
    const quick = CATEGORY_MODEL_REQUIREMENTS["quick"]

    // when - accessing quick requirement
    // then - fallbackChain exists with gpt-5.4-mini as first entry, mini-fast as second
    expect(quick).toBeDefined()
    expect(quick.fallbackChain).toBeArray()
    expect(quick.fallbackChain.length).toBeGreaterThan(1)

    const primary = quick.fallbackChain[0]
    expect(primary.model).toBe("gpt-5.4-mini")
    expect(primary.providers).toContain("openai")

    const secondary = quick.fallbackChain[1]
    expect(secondary.model).toBe("gpt-5.4-mini-fast")
    expect(secondary.providers).toContain("openai")
  })

  test("unspecified-low replaces Sonnet with GPT-5.5 medium", () => {
    // given - unspecified-low category requirement
    const unspecifiedLow = CATEGORY_MODEL_REQUIREMENTS["unspecified-low"]

    // when - accessing unspecified-low requirement
    // then - Sonnet is replaced by GPT-5.5 medium, ahead of the Codex fallback
    expect(unspecifiedLow).toBeDefined()
    expect(unspecifiedLow.fallbackChain).toBeArray()
    expect(unspecifiedLow.fallbackChain.length).toBeGreaterThan(0)

    const primary = unspecifiedLow.fallbackChain[0]
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.variant).toBe("medium")
    expect(primary.providers[0]).toBe("openai")

    const secondary = unspecifiedLow.fallbackChain[1]
    expect(secondary.model).toBe("gpt-5.3-codex")
    expect(secondary.variant).toBe("medium")
    expect(secondary.providers[0]).toBe("openai")
  })

  test("unspecified-high replaces Opus with GPT-5.5 xhigh", () => {
    // #given - unspecified-high category requirement
    const unspecifiedHigh = CATEGORY_MODEL_REQUIREMENTS["unspecified-high"]

    // #when - accessing unspecified-high requirement
    // #then - Opus is replaced by GPT-5.5 xhigh ahead of the GPT-high fallback
    expect(unspecifiedHigh).toBeDefined()
    expect(unspecifiedHigh.fallbackChain).toBeArray()
    expect(unspecifiedHigh.fallbackChain.length).toBeGreaterThan(1)

    const primary = unspecifiedHigh.fallbackChain[0]
    expect(primary.model).toBe("gpt-5.5")
    expect(primary.variant).toBe("xhigh")
    expect(primary.providers).toEqual(["openai"])

    const secondary = unspecifiedHigh.fallbackChain[1]
    expect(secondary.model).toBe("gpt-5.5")
    expect(secondary.variant).toBe("high")
    expect(secondary.providers).toEqual(["openai"])
  })

  test("artistry has valid fallbackChain with gemini-3.1-pro as primary", () => {
    // given - artistry category requirement
    const artistry = CATEGORY_MODEL_REQUIREMENTS["artistry"]

    // when - accessing artistry requirement
    // then - fallbackChain exists with gemini-3.1-pro as first entry
    expect(artistry).toBeDefined()
    expect(artistry.fallbackChain).toBeArray()
    expect(artistry.fallbackChain.length).toBeGreaterThan(0)

    const primary = artistry.fallbackChain[0]
    expect(primary.model).toBe("gemini-3.1-pro")
    expect(primary.variant).toBe("high")
    expect(primary.providers).toEqual(["vercel"])
  })

  test("writing has valid fallbackChain with gemini-3-flash as primary", () => {
    // given - writing category requirement
    const writing = CATEGORY_MODEL_REQUIREMENTS["writing"]

    // when - accessing writing requirement
    // then - fallbackChain: gemini-3-flash -> kimi-k2.5 -> gpt-5.5 medium -> minimax-m2.7
    expect(writing).toBeDefined()
    expect(writing.fallbackChain).toBeArray()
    expect(writing.fallbackChain).toHaveLength(4)

    const primary = writing.fallbackChain[0]
    expect(primary.model).toBe("gemini-3-flash")
    expect(primary.providers).toEqual(["vercel"])

    const second = writing.fallbackChain[1]
    expect(second.model).toBe("kimi-k2.5")
	    expect(second.providers[0]).toBe("vercel")

    const third = writing.fallbackChain[2]
    expect(third.model).toBe("gpt-5.5")
    expect(third.variant).toBe("medium")
    expect(third.providers[0]).toBe("openai")

    const fourth = writing.fallbackChain[3]
    expect(fourth.model).toBe("minimax-m2.7")
    expect(fourth.providers[0]).toBe("vercel")
  })

  test("all 8 categories have valid fallbackChain arrays", () => {
    // given - list of 8 category names
    const expectedCategories = [
      "visual-engineering",
      "ultrabrain",
      "deep",
      "artistry",
      "quick",
      "unspecified-low",
      "unspecified-high",
      "writing",
    ]

    // when - checking CATEGORY_MODEL_REQUIREMENTS
    const definedCategories = Object.keys(CATEGORY_MODEL_REQUIREMENTS)

    // then - all categories present with valid fallbackChain
    expect(definedCategories).toHaveLength(8)
    for (const category of expectedCategories) {
      const requirement = CATEGORY_MODEL_REQUIREMENTS[category]
      expect(requirement).toBeDefined()
      expect(requirement.fallbackChain).toBeArray()
      expect(requirement.fallbackChain.length).toBeGreaterThan(0)

      for (const entry of requirement.fallbackChain) {
        expect(entry.providers).toBeArray()
        expect(entry.providers.length).toBeGreaterThan(0)
        expect(typeof entry.model).toBe("string")
        expect(entry.model.length).toBeGreaterThan(0)
      }
    }
  })
})

describe("FallbackEntry type", () => {
  test("FallbackEntry structure is correct", () => {
    // given - a valid FallbackEntry object
    const entry: FallbackEntry = {
	      providers: ["openai", "vercel"],
	      model: "gpt-5.5",
      variant: "high",
    }

    // when - accessing properties
    // then - all properties are accessible
	    expect(entry.providers).toEqual(["openai", "vercel"])
	    expect(entry.model).toBe("gpt-5.5")
    expect(entry.variant).toBe("high")
  })

  test("FallbackEntry variant is optional", () => {
    // given - a FallbackEntry without variant
    const entry: FallbackEntry = {
	      providers: ["vercel"],
      model: "big-pickle",
    }

    // when - accessing variant
    // then - variant is undefined
    expect(entry.variant).toBeUndefined()
  })
})

describe("ModelRequirement type", () => {
  test("ModelRequirement structure with fallbackChain is correct", () => {
    // given - a valid ModelRequirement object
    const requirement: ModelRequirement = {
      fallbackChain: [
	        { providers: ["openai"], model: "gpt-5.5", variant: "high" },
	        { providers: ["vercel"], model: "gemini-3.1-pro", variant: "high" },
      ],
    }

    // when - accessing properties
    // then - fallbackChain is accessible with correct structure
    expect(requirement.fallbackChain).toBeArray()
    expect(requirement.fallbackChain).toHaveLength(2)
	    expect(requirement.fallbackChain[0].model).toBe("gpt-5.5")
	    expect(requirement.fallbackChain[1].model).toBe("gemini-3.1-pro")
  })

  test("ModelRequirement variant is optional", () => {
    // given - a ModelRequirement without top-level variant
    const requirement: ModelRequirement = {
	      fallbackChain: [{ providers: ["vercel"], model: "big-pickle" }],
    }

    // when - accessing variant
    // then - variant is undefined
    expect(requirement.variant).toBeUndefined()
  })

  test("no model in fallbackChain has provider prefix", () => {
    // given - all agent and category requirements
    const allRequirements = [
      ...Object.values(AGENT_MODEL_REQUIREMENTS),
      ...Object.values(CATEGORY_MODEL_REQUIREMENTS),
    ]

    // when - checking each model in fallbackChain
    // then - none contain "/" (provider prefix)
    for (const req of allRequirements) {
      for (const entry of req.fallbackChain) {
        expect(entry.model).not.toContain("/")
      }
    }
  })

  test("Gemini fallback entries are Vercel-only", () => {
    // given - all agent and category requirements
    const geminiEntries = [
      ...Object.values(AGENT_MODEL_REQUIREMENTS),
      ...Object.values(CATEGORY_MODEL_REQUIREMENTS),
    ]
      .flatMap((req) => req.fallbackChain)
      .filter((entry) => entry.model.startsWith("gemini-"))

    // when / #then - Gemini is kept, but routed through Vercel instead of native Google
    expect(geminiEntries.length).toBeGreaterThan(0)
    for (const entry of geminiEntries) {
      expect(entry.providers).toEqual(["vercel"])
    }
  })

  test("all fallbackChain providers are openai or vercel only", () => {
    // given - all agent and category requirements
    const allRequirements = [
      ...Object.values(AGENT_MODEL_REQUIREMENTS),
      ...Object.values(CATEGORY_MODEL_REQUIREMENTS),
    ]

    // when / then - every provider should be part of the supported transport set
    for (const req of allRequirements) {
      for (const entry of req.fallbackChain) {
        for (const provider of entry.providers) {
          expect(["openai", "vercel"]).toContain(provider)
        }
      }
    }
  })

   test("all fallbackChain entries have non-empty providers array", () => {
     // given - all agent and category requirements
     const allRequirements = [
       ...Object.values(AGENT_MODEL_REQUIREMENTS),
       ...Object.values(CATEGORY_MODEL_REQUIREMENTS),
     ]

     // when - checking each entry in fallbackChain
     // then - all have non-empty providers array
     for (const req of allRequirements) {
       for (const entry of req.fallbackChain) {
         expect(entry.providers).toBeArray()
         expect(entry.providers.length).toBeGreaterThan(0)
       }
     }
   })
})

describe("requiresModel field in categories", () => {
  test("deep category no longer has requiresModel (gpt-5.5 is widely available)", () => {
    // given
    const deep = CATEGORY_MODEL_REQUIREMENTS["deep"]

    // when / #then
    expect(deep.requiresModel).toBeUndefined()
  })

  test("artistry category has requiresModel set to gemini-3.1-pro", () => {
    // given
    const artistry = CATEGORY_MODEL_REQUIREMENTS["artistry"]

    // when / #then
    expect(artistry.requiresModel).toBe("gemini-3.1-pro")
  })
})

describe("gpt-5.3-codex provider restrictions", () => {
  test("all gpt-5.3-codex agent entries are openai-only", () => {
    // given - all agent requirements
    const allAgentEntries = Object.values(AGENT_MODEL_REQUIREMENTS).flatMap(
      (req) => req.fallbackChain
    )

    // when - filtering entries with gpt-5.3-codex model
    const codexEntries = allAgentEntries.filter((entry) => entry.model === "gpt-5.3-codex")

    // then - all of them use openai directly
    for (const entry of codexEntries) {
	      expect(entry.providers).toEqual(["openai"])
    }
  })

  test("all gpt-5.3-codex category entries are openai-only", () => {
    // given - all category requirements
    const allCategoryEntries = Object.values(CATEGORY_MODEL_REQUIREMENTS).flatMap(
      (req) => req.fallbackChain
    )

    // when - filtering entries with gpt-5.3-codex model
    const codexEntries = allCategoryEntries.filter((entry) => entry.model === "gpt-5.3-codex")

    // then - all of them use openai directly
    for (const entry of codexEntries) {
	      expect(entry.providers).toEqual(["openai"])
    }
  })
})
