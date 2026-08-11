type GameSettings = {
  theme: string;
  player: string;
  boardsize: string;
};

/**
 * Reads the settings the player picked on the settings page.
 *
 * @returns The stored settings, or `null` when nothing was saved yet.
 */
export function getGameSettings(): GameSettings | null {
  const raw = sessionStorage.getItem("gameSettings");
  if (!raw) return null;
  return JSON.parse(raw) as GameSettings;
}

/**
 * Activates a theme by writing it to `data-theme` on the body,
 * which is the hook the SCSS theme files listen on.
 *
 * @param theme - Theme name, e.g. `"coding"` or `"gaming"`.
 */
export function applyTheme(theme: string): void {
  document.body.dataset.theme = theme;
}

/**
 * Applies the stored theme to the board page. Bails out on other pages
 * and when no theme was saved.
 */
export function initBoardTheme(): void {
  if (!document.querySelector(".board")) return;
  const settings = getGameSettings();
  if (!settings?.theme) return;
  applyTheme(settings.theme);
}
