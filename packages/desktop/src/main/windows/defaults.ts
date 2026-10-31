import { resolveThemeVariant } from "@opencode/ui/theme/resolve"
import type { DesktopTheme } from "@opencode/ui/theme/types"
import { desktopZoomLevels } from "@opencode/app/desktop-menu"
import { nativeTheme } from "electron"
import { Predicate } from "effect"
import oc2ThemeJson from "../../../../ui/src/theme/themes/oc-2.json"
import { BACKGROUND_COLOR_KEY, ZOOM_LEVEL_KEY } from "../storage/keys"
import { getStore } from "../storage/store"

// SAFETY: oc-2.json is the bundled default theme, which the UI package loads as a DesktopTheme too.
const oc2Theme = oc2ThemeJson as DesktopTheme

export function tone() {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light"
}

// The colour the renderer reported on its last run, or the default theme's for the system tone, so
// a window shown before the renderer paints already has the right background. Resolving a palette
// costs tens of milliseconds before the first window, so it only happens when nothing is stored.
export function storedBackgroundColor() {
  const saved = savedBackgroundColor()

  if (saved !== undefined) return saved
  const dark = tone() === "dark"

  return resolveThemeVariant(dark ? oc2Theme.dark : oc2Theme.light, dark)["background-base"]
}

// The colour the renderer reported on its last run, if it ever did.
export function savedBackgroundColor() {
  const stored = getStore().get(BACKGROUND_COLOR_KEY)

  return Predicate.isString(stored) ? stored : undefined
}

// The zoom level chosen in settings or with Zoom In and Zoom Out, or 100% when none was saved.
export function storedZoomLevel() {
  const stored = getStore().get(ZOOM_LEVEL_KEY)

  return desktopZoomLevels.find((level) => level === stored) ?? 1
}
