type GameSettings = {
  theme: string;
  player: string;
  boardsize: string;
};

export function getGameSettings(): GameSettings | null {
  const raw = sessionStorage.getItem("gameSettings");
  if (!raw) return null;
  return JSON.parse(raw) as GameSettings;
}

function applyBoardTheme(theme: string): void {
  document.body.dataset.theme = theme;
}

export function initBoardTheme(): void {
  if (!document.querySelector(".board")) return;
  const settings = getGameSettings();
  if (!settings?.theme) return;
  applyBoardTheme(settings.theme);
}
