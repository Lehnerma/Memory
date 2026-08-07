import "./styles/style.scss";
import { initSummary } from "./scripts/settings";
import { initExitDialog } from "./scripts/board";
import { initBoardTheme } from "./scripts/theme";
import { CardData, initCards } from "./scripts/cards";
import { initGameLogic } from "./scripts/game-logic";

function init() {
  initSummary();
  initExitDialog();
  initBoardTheme();
  initGame();
}

export function initGame() {
  const cards = initCards();
  initGameLogic(cards);
  
}

init();