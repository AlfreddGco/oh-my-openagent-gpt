import { checkForLegacyPluginEntry } from "./legacy-plugin-warning"
import { log } from "./logger"
import { migrateLegacyPluginEntry } from "./migrate-legacy-plugin-entry"
import { toCanonicalEntry } from "./plugin-entry-migrator"
import { PLUGIN_NAME } from "./plugin-identity"

type LogLegacyPluginStartupWarningDeps = {
  checkForLegacyPluginEntry?: typeof checkForLegacyPluginEntry
  log?: typeof log
  migrateLegacyPluginEntry?: typeof migrateLegacyPluginEntry
}

export function logLegacyPluginStartupWarning(deps: LogLegacyPluginStartupWarningDeps = {}): void {
  const checkForLegacyPluginEntryFn = deps.checkForLegacyPluginEntry ?? checkForLegacyPluginEntry
  const logFn = deps.log ?? log
  const migrateLegacyPluginEntryFn = deps.migrateLegacyPluginEntry ?? migrateLegacyPluginEntry

  const result = checkForLegacyPluginEntryFn()
  if (!result.hasLegacyEntry) {
    return
  }

  const configPath = result.configPath
  if (!configPath) {
    return
  }

  const suggestedEntries = result.legacyEntries.map(toCanonicalEntry)

  logFn("[legacy-migration] Legacy plugin entry detected in OpenCode config", {
    legacyEntries: result.legacyEntries,
    suggestedEntries,
    hasCanonicalEntry: result.hasCanonicalEntry,
  })

  console.warn(
    `[${PLUGIN_NAME}] WARNING: Your opencode.json uses a legacy plugin name.`
    + ` The OpenCode plugin entry should be "${PLUGIN_NAME}".`
    + ` Attempting auto-migration...`,
  )

  const migrated = migrateLegacyPluginEntryFn(configPath)
  if (migrated) {
    console.warn(`[${PLUGIN_NAME}] Auto-migrated opencode.json: ${result.legacyEntries.join(", ")} -> ${suggestedEntries.join(", ")}`)
  } else {
    console.warn(
      `[${PLUGIN_NAME}] Could not auto-migrate. Please manually update your opencode.json:`
      + ` ${result.legacyEntries.map((e, i) => `"${e}" -> "${suggestedEntries[i]}"`).join(", ")}`,
    )
  }
}
