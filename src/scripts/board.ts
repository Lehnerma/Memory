function getExitDialog(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>(".exit-dialog");
}

function openExitDialog(): void {
  getExitDialog()?.showModal();
}

function closeExitDialog(): void {
  getExitDialog()?.close();
}

function goToStartPage(): void {
  //window.location.href = "../index.html";
  window.location.href = "../pages/settings.html";  // TODO umstellen auf index oder abklären auf settings - figma checken?
}

function bindExitButtonListener(): void {
  const exitButton = document.querySelector(".board-header__exit");
  exitButton?.addEventListener("click", openExitDialog);
}

function bindDialogButtonListeners(): void {
  const backButton = document.querySelector(".exit-dialog__btn--back");
  const exitButton = document.querySelector(".exit-dialog__btn--exit");
  backButton?.addEventListener("click", closeExitDialog);
  exitButton?.addEventListener("click", goToStartPage);
}

function bindBackdropClickListener(): void {
  const dialog = getExitDialog();
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeExitDialog();
  });
}

export function initExitDialog(): void {
  if (!document.querySelector(".board")) return;
  bindExitButtonListener();
  bindDialogButtonListeners();
  bindBackdropClickListener();
}
