import "./styles/style.scss";
import { initSummary } from "./scripts/settings";
import { initExitDialog } from "./scripts/board";
import { initBoardTheme } from "./scripts/theme";

function init() {
  initSummary();
  initExitDialog();
  initBoardTheme();
}

init();