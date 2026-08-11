import "./styles/style.scss";
import { initSummary } from "./scripts/settings";
import { initExitDialog } from "./scripts/board";
import { initBoardTheme } from "./scripts/theme";
import { initCards } from "./scripts/cards";
import { initGameLogic } from "./scripts/game-logic";
import { initEndscreen } from "./scripts/endscreen";

/**
 * Entry point for every page. Each init function checks for its own page
 * marker, so only the parts belonging to the current page actually run.
 */
function init() {
  initSummary();
  initExitDialog();
  initBoardTheme();
  initEndscreen();
  initGame();
}

/**
 * Builds the card deck and hands it over to the game logic.
 * Does nothing outside the board page, because `initCards` returns
 * an empty deck when the board element is missing.
 */
export function initGame() {
  const cards = initCards();
  initGameLogic(cards);
}

init();
