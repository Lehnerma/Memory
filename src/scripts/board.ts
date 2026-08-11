/**
 * Looks up the exit confirmation dialog of the board page.
 *
 * @returns The dialog element, or `null` when it is not in the DOM.
 */
function getExitDialog(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>(".exit-dialog");
}

/**
 * Opens the exit dialog as a modal, so the board behind it is inert.
 */
function openExitDialog(): void {
  getExitDialog()?.showModal();
}

/**
 * Closes the exit dialog and returns the player to the running game.
 */
function closeExitDialog(): void {
  getExitDialog()?.close();
}

/**
 * Leaves the game and navigates back to the settings page.
 */
function goToStartPage(): void {
  window.location.href = "./settings.html";
}

/**
 * Wires the "Exit game" button in the board header to the dialog.
 */
function bindExitButtonListener(): void {
  const exitButton = document.querySelector(".board-header__exit");
  exitButton?.addEventListener("click", openExitDialog);
}

/**
 * Wires both dialog buttons: "back to game" closes, "exit" navigates away.
 */
function bindDialogButtonListeners(): void {
  const backButton = document.querySelector(".exit-dialog__btn--back");
  const exitButton = document.querySelector(".exit-dialog__btn--exit");
  backButton?.addEventListener("click", closeExitDialog);
  exitButton?.addEventListener("click", goToStartPage);
}

/**
 * Closes the dialog when the click lands on the backdrop instead of
 * the dialog content. The event target is the dialog itself in that case.
 */
function bindBackdropClickListener(): void {
  const dialog = getExitDialog();
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeExitDialog();
  });
}

/**
 * Sets up the exit dialog. Bails out on every page that is not the board.
 */
export function initExitDialog(): void {
  if (!document.querySelector(".board")) return;
  bindExitButtonListener();
  bindDialogButtonListeners();
  bindBackdropClickListener();
}
