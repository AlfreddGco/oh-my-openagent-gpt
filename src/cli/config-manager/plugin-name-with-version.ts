import { PLUGIN_NAME, PUBLISHED_PACKAGE_NAME } from "../../shared"
import { fetchNpmDistTags } from "./npm-dist-tags"

const DEFAULT_PACKAGE_NAME = PUBLISHED_PACKAGE_NAME
const DEFAULT_PLUGIN_ENTRY_NAME = PLUGIN_NAME
const PRIORITIZED_TAGS = ["latest", "beta", "next"] as const

function getFallbackEntry(version: string, pluginEntryName: string): string {
  const prereleaseMatch = version.match(/-([a-zA-Z][a-zA-Z0-9-]*)(?:\.|$)/)
  if (prereleaseMatch) {
    return `${pluginEntryName}@${prereleaseMatch[1]}`
  }

  return pluginEntryName
}

export async function getPluginNameWithVersion(
  currentVersion: string,
  packageName: string = DEFAULT_PACKAGE_NAME,
  pluginEntryName: string = DEFAULT_PLUGIN_ENTRY_NAME,
): Promise<string> {
  const distTags = await fetchNpmDistTags(packageName)

  if (distTags) {
    const allTags = new Set([...PRIORITIZED_TAGS, ...Object.keys(distTags)])
    for (const tag of allTags) {
      if (distTags[tag] === currentVersion) {
        return `${pluginEntryName}@${tag}`
      }
    }
  }

  return getFallbackEntry(currentVersion, pluginEntryName)
}
