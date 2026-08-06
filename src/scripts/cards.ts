import { getGameSettings } from "./theme";

function imgPathTemplate(theme: string, index: number): string {
  return `../assets/img/themes/${theme}/cards/${theme}-card${index}.png`;
}

function getTheme(): string {
  const settings = getGameSettings();
  return settings?.theme ?? "coding";
}

function getBoardSize(): number {
  const settings = getGameSettings();
  const size = parseInt(settings?.boardsize ?? "16");
  return size;
}

function getCardImgPaths(): string[] {
  const size = getBoardSize();
  const theme = getTheme();
  const paths: string[] = [];

  for (let i = 1; i <= size / 2; i++) {
    const newPath = imgPathTemplate(theme, i);
    paths.push(newPath);
  }
  console.log(paths);
  return paths;
}

export function initCards() {
  getCardImgPaths();
}
