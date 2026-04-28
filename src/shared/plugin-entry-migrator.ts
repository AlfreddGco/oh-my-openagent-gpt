import { CONFIG_ENTRY_ALIAS_NAMES, matchesPluginName, PLUGIN_NAME } from "./plugin-identity"

export function isLegacyEntry(entry: string): boolean {
  return CONFIG_ENTRY_ALIAS_NAMES.some((pluginName) => matchesPluginName(entry, pluginName))
}

export function isCanonicalEntry(entry: string): boolean {
  return matchesPluginName(entry, PLUGIN_NAME)
}

export function toCanonicalEntry(entry: string): string {
  for (const legacyPluginName of CONFIG_ENTRY_ALIAS_NAMES) {
    if (entry === legacyPluginName) {
      return PLUGIN_NAME
    }

    if (entry.startsWith(`${legacyPluginName}@`)) {
      return `${PLUGIN_NAME}${entry.slice(legacyPluginName.length)}`
    }
  }

  return entry
}
