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

/**
 * Reads the result the board page stored when the game ended.
 *
 * @returns The stored result, or `null` when the endscreen was opened directly.
 */
function getStoredResult(): StoredResult | null {
  const raw = sessionStorage.getItem("gameResult");
  if (!raw) return null;
  return JSON.parse(raw) as StoredResult;
}

/**
 * Writes both final scores into the score stage.
 *
 * @param scores - The final scores of both players.
 */
function showScores(scores: StoredResult["scores"]): void {
  const blue = document.getElementById("score_blue");
  const orange = document.getElementById("score_orange");
  if (blue) blue.textContent = scores.blue.toString();
  if (orange) orange.textContent = scores.orange.toString();
}

/**
 * Fills the result stage with winner texts and exposes the result as
 * `data-result` on the body, which drives the colour styling.
 *
 * @param winner - The winning player, or `"draw"`.
 */
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
 *
 * @param theme - The active theme name.
 */
function showLinkLabel(theme: string): void {
  const link = document.querySelector(".endscreen__link");
  if (!link) return;
  link.textContent = theme === "coding" ? "Back to start" : "Home";
}

/**
 * Runs the two stage reveal: first the scores, then the winner.
 */
function startStageTimer(): void {
  document.body.dataset.stage = "score";
  window.setTimeout(() => {
    document.body.dataset.stage = "result";
  }, STAGE_DELAY);
}

/**
 * Applies the theme of the finished game and adjusts the link label to it.
 */
function applyStoredTheme(): void {
  const settings = getGameSettings();
  if (!settings?.theme) return;
  applyTheme(settings.theme);
  showLinkLabel(settings.theme);
}

/**
 * Sets up the endscreen. Bails out on other pages and when no result was
 * stored, which leaves the markup defaults visible.
 */
export function initEndscreen(): void {
  if (!document.querySelector(".endscreen")) return;
  applyStoredTheme();
  const result = getStoredResult();
  if (!result) return;
  showScores(result.scores);
  showWinner(result.winner);
  startStageTimer();
}
