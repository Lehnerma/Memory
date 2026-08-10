import type { GameResult } from "./game-logic";
import { getGameSettings, applyTheme } from "./theme";

const STAGE_DELAY = 2000;

type StoredResult = {
  winner: GameResult;
  scores: {
    blue: number;
    orange: number;
  };
};

const RESULT_TEXT: Record<GameResult, { subtitle: string; name: string }> = {
  blue: { subtitle: "The winner is", name: "Blue Player" },
  orange: { subtitle: "The winner is", name: "Orange Player" },
  draw: { subtitle: "It's a", name: "Draw" },
};

function getStoredResult(): StoredResult | null {
  const raw = sessionStorage.getItem("gameResult");
  if (!raw) return null;
  return JSON.parse(raw) as StoredResult;
}

function showScores(scores: StoredResult["scores"]): void {
  const blue = document.getElementById("score_blue");
  const orange = document.getElementById("score_orange");
  if (blue) blue.textContent = scores.blue.toString();
  if (orange) orange.textContent = scores.orange.toString();
}

function showWinner(winner: GameResult): void {
  document.body.dataset.result = winner;
  const subtitle = document.getElementById("winner_subtitle");
  const name = document.getElementById("winner_name");
  if (!subtitle || !name) return;
  subtitle.textContent = RESULT_TEXT[winner].subtitle;
  name.textContent = RESULT_TEXT[winner].name;
  name.className = `endscreen__winner endscreen__winner-${winner}`;
}

/**
 * The coding theme sends the player back to the settings, the other themes
 * label the same link as the way home.
 */
function showLinkLabel(theme: string): void {
  const link = document.querySelector(".endscreen__link");
  if (!link) return;
  link.textContent = theme === "coding" ? "Back to start" : "Home";
}

function startStageTimer(): void {
  document.body.dataset.stage = "score";
  window.setTimeout(() => {
    document.body.dataset.stage = "result";
  }, STAGE_DELAY);
}

function applyStoredTheme(): void {
  const settings = getGameSettings();
  if (!settings?.theme) return;
  applyTheme(settings.theme);
  showLinkLabel(settings.theme);
}

export function initEndscreen(): void {
  if (!document.querySelector(".endscreen")) return;
  applyStoredTheme();
  const result = getStoredResult();
  if (!result) return;
  showScores(result.scores);
  showWinner(result.winner);
  startStageTimer();
}
