import { CardData } from "./cards";

function handleBoardClick(e: Event): void {
  if (!(e.target instanceof Element)) return;
  const btn = e.target.closest<HTMLButtonElement>(".card__button");
  const cardId = e.target.closest<HTMLLabelElement>('[data-card-id]');
  console.log(cardId?.dataset.cardId);
  
  if (!btn) return;
  btn.classList.toggle("card__flipped");
}

function initCard(): void {
  const board = document.getElementById("memory_board");
  board?.addEventListener("click", handleBoardClick);
}

export function initGameLogic(cards: CardData[]): void {
  initCard();
  console.log(cards);
}
