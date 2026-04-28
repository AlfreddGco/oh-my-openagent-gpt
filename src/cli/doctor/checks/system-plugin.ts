import { existsSync, readFileSync } from "node:fs"

import {
  LEGACY_PLUGIN_NAMES,
  PLUGIN_NAME,
  getOpenCodeConfigPaths,
  isAcceptedPluginEntry,
  parseJsonc,
} from "../../../shared"

export interface PluginInfo {
  registered: boolean
  configPath: string | null
  entry: string | null
  isPinned: boolean
  pinnedVersion: string | null
  isLocalDev: boolean
}

interface OpenCodeConfigShape {
  plugin?: string[]
}

function detectConfigPath(): string | null {
  const paths = getOpenCodeConfigPaths({ binary: "opencode", version: null })
  if (existsSync(paths.configJsonc)) return paths.configJsonc
  if (existsSync(paths.configJson)) return paths.configJson
  return null
}

function parsePluginVersion(entry: string): string | null {
  if (entry.startsWith(`${PLUGIN_NAME}@`)) {
    const value = entry.slice(PLUGIN_NAME.length + 1)
    if (!value || value === "latest") return null
    return value
  }

  for (const legacyPluginName of LEGACY_PLUGIN_NAMES) {
    if (entry.startsWith(`${legacyPluginName}@`)) {
      const value = entry.slice(legacyPluginName.length + 1)
      if (!value || value === "latest") return null
      return value
    }
  }
  return null
}

function findPluginEntry(entries: string[]): { entry: string; isLocalDev: boolean } | null {
  for (const entry of entries) {
    if (isAcceptedPluginEntry(entry)) {
      return { entry, isLocalDev: false }
    }
    if (entry.startsWith("file://") && [PLUGIN_NAME, ...LEGACY_PLUGIN_NAMES].some((pluginName) => entry.includes(pluginName))) {
      return { entry, isLocalDev: true }
    }
  }

  return null
}

export function getPluginInfo(): PluginInfo {
  const configPath = detectConfigPath()
  if (!configPath) {
    return {
      registered: false,
      configPath: null,
      entry: null,
      isPinned: false,
      pinnedVersion: null,
      isLocalDev: false,
    }
  }

  try {
    const content = readFileSync(configPath, "utf-8")
    const parsedConfig = parseJsonc<OpenCodeConfigShape>(content)
    const pluginEntry = findPluginEntry(parsedConfig.plugin ?? [])
    if (!pluginEntry) {
      return {
        registered: false,
        configPath,
        entry: null,
        isPinned: false,
        pinnedVersion: null,
        isLocalDev: false,
      }
    }

    const pinnedVersion = parsePluginVersion(pluginEntry.entry)
    return {
      registered: true,
      configPath,
      entry: pluginEntry.entry,
      isPinned: pinnedVersion !== null && /^\d+\.\d+\.\d+/.test(pinnedVersion ?? ""),
      pinnedVersion,
      isLocalDev: pluginEntry.isLocalDev,
    }
  } catch {
    return {
      registered: false,
      configPath,
      entry: null,
      isPinned: false,
      pinnedVersion: null,
      isLocalDev: false,
    }
  }
}

export { detectConfigPath, findPluginEntry }
