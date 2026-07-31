import "./styles/style.scss";
import { returnThemeValue } from "./scripts/buttons";

function init() {
  initBtn();
}

function initBtn() {
  const BTN = document.getElementById("test");
  if (!BTN) return;
  BTN.addEventListener("click", () => {
    returnThemeValue();
  });
}

// function returnTheme() {
//   const themes = document.querySelector('input[name="theme"]');
//   const player = document.querySelector('input[name="player"]');
//   const size = document.querySelector('input[name="boardsize"]');

//   console.log(themes, player, size);
// }

init();
