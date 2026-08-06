import "./styles/style.scss";
import { initSummary } from "./scripts/settings";
import { initExitDialog } from "./scripts/board";
import { initBoardTheme } from "./scripts/theme";
import { initCards } from "./scripts/cards";

function init() {
  initSummary();
  initExitDialog();
  initBoardTheme();
  initCards();
}

init();