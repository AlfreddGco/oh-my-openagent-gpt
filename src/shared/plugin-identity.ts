export const PLUGIN_NAME = "oh-my-openagent-gpt"
export const LEGACY_PLUGIN_NAMES = ["oh-my-openagent", "oh-my-opencode"] as const
export const LEGACY_PLUGIN_NAME = LEGACY_PLUGIN_NAMES[1]

export const PUBLISHED_PACKAGE_NAME = "oh-my-opencode-gpt"
export const ACCEPTED_PACKAGE_NAMES = [
  PUBLISHED_PACKAGE_NAME,
  PLUGIN_NAME,
  ...LEGACY_PLUGIN_NAMES,
] as const
export const CONFIG_ENTRY_ALIAS_NAMES = [PUBLISHED_PACKAGE_NAME, ...LEGACY_PLUGIN_NAMES] as const

export const CONFIG_BASENAME = "oh-my-openagent-gpt"
export const LEGACY_CONFIG_BASENAMES = ["oh-my-openagent", "oh-my-opencode"] as const
export const LEGACY_CONFIG_BASENAME = LEGACY_CONFIG_BASENAMES[1]

export const LOG_FILENAME = "oh-my-openagent-gpt.log"
export const CACHE_DIR_NAME = "oh-my-openagent-gpt"

export function matchesPluginName(entry: string, pluginName: string): boolean {
  return entry === pluginName || entry.startsWith(`${pluginName}@`)
}

export function isAcceptedPluginEntry(entry: string): boolean {
  return [PLUGIN_NAME, PUBLISHED_PACKAGE_NAME, ...LEGACY_PLUGIN_NAMES].some((pluginName) => matchesPluginName(entry, pluginName))
}

export function isLegacyPluginEntryName(entry: string): boolean {
  return LEGACY_PLUGIN_NAMES.some((pluginName) => matchesPluginName(entry, pluginName))
}

export function isPluginEntryAliasName(entry: string): boolean {
  return CONFIG_ENTRY_ALIAS_NAMES.some((pluginName) => matchesPluginName(entry, pluginName))
}
