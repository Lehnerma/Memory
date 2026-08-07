function handleBoardClick(e: Event): void {
  if (!(e.target instanceof Element)) return;
  const btn = e.target.closest<HTMLButtonElement>(".card__button");
  if (!btn) return;
  btn.classList.toggle("card__flipped");
}

export function initFlip(): void {
  const board = document.getElementById("memory_board");
  board?.addEventListener("click", handleBoardClick);
}
