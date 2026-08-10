import "./styles/style.scss";
import { initSummary } from "./scripts/settings";
import { initExitDialog } from "./scripts/board";
import { initBoardTheme } from "./scripts/theme";
import { initCards } from "./scripts/cards";
import { initGameLogic } from "./scripts/game-logic";
import { initEndscreen } from "./scripts/endscreen";

function init() {
  initSummary();
  initExitDialog();
  initBoardTheme();
  initEndscreen();
  initGame();
}

export function initGame() {
  const cards = initCards();
  initGameLogic(cards);
  
}

init();