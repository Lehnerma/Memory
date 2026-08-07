import "./styles/style.scss";
import { initSummary } from "./scripts/settings";
import { initExitDialog } from "./scripts/board";
import { initBoardTheme } from "./scripts/theme";
import { initCards } from "./scripts/cards";
import { initFlip } from "./scripts/flip";

function init() {
  initSummary();
  initExitDialog();
  initBoardTheme();
  initCards();
  initFlip();
}

init();