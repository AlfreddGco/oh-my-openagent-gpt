import { describe, it, expect } from "bun:test"
import { ACCEPTED_PACKAGE_NAMES, PLUGIN_NAME, CONFIG_BASENAME, LOG_FILENAME, CACHE_DIR_NAME } from "./plugin-identity"

describe("plugin-identity constants", () => {
  describe("PLUGIN_NAME", () => {
    it("equals oh-my-openagent-gpt", () => {
      // given

      // when

      // then
      expect(PLUGIN_NAME).toBe("oh-my-openagent-gpt")
    })
  })

  describe("CONFIG_BASENAME", () => {
    it("equals oh-my-openagent-gpt", () => {
      // given

      // when

      // then
      expect(CONFIG_BASENAME).toBe("oh-my-openagent-gpt")
    })
  })

  describe("LOG_FILENAME", () => {
    it("equals oh-my-openagent-gpt.log", () => {
      // given

      // when

      // then
      expect(LOG_FILENAME).toBe("oh-my-openagent-gpt.log")
    })
  })

  describe("CACHE_DIR_NAME", () => {
    it("equals oh-my-openagent-gpt", () => {
      // given

      // when

      // then
      expect(CACHE_DIR_NAME).toBe("oh-my-openagent-gpt")
    })
  })

  describe("ACCEPTED_PACKAGE_NAMES", () => {
    it("includes canonical and legacy package names", () => {
      expect(ACCEPTED_PACKAGE_NAMES).toContain("oh-my-opencode-gpt")
      expect(ACCEPTED_PACKAGE_NAMES).toContain("oh-my-openagent")
      expect(ACCEPTED_PACKAGE_NAMES).toContain("oh-my-opencode")
    })
  })
})
