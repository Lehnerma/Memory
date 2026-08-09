import type { CardData } from "./cards";

const MISMATCH_DELAY_MS = 2000;

let cards: CardData[] = [];
let flippedCards: CardData[] = [];
let boardElement: HTMLElement | null = null;
let isLocked = false;

function findCardElement(id: number): HTMLElement | null {
  return boardElement?.querySelector<HTMLElement>(`[data-card-id="${id}"]`) ?? null;
}

function findCardButton(id: number): HTMLButtonElement | null {
  const cardEl = findCardElement(id);
  return cardEl?.querySelector<HTMLButtonElement>(".card__button") ?? null;
}

function findCardFront(id: number): HTMLElement | null {
  const cardEl = findCardElement(id);
  return cardEl?.querySelector<HTMLElement>(".card__face--front") ?? null;
}

function revealCard(card: CardData): void {
  card.isFlipped = true;
  findCardButton(card.id)?.classList.add("card__flipped");
}

function hideCard(card: CardData): void {
  card.isFlipped = false;
  findCardButton(card.id)?.classList.remove("card__flipped");
}

function markAsPair(card: CardData): void {
  card.isMatched = true;
  findCardFront(card.id)?.classList.add("card--pair");
}

function resolveMatch(): void {
  flippedCards.forEach(markAsPair);
  flippedCards = [];
}

function resolveMismatch(): void {
  const mismatched = flippedCards;
  flippedCards = [];
  isLocked = true;

  window.setTimeout(() => {
    mismatched.forEach(hideCard);
    isLocked = false;
  }, MISMATCH_DELAY_MS);
}

function evaluateFlippedCards(): void {
  const [first, second] = flippedCards;
  if (first.pairId === second.pairId) resolveMatch();
  else resolveMismatch();
}

function getCardFromButton(button: HTMLButtonElement): CardData | undefined {
  const cardEl = button.closest<HTMLElement>(".card");
  const cardId = Number(cardEl?.dataset.cardId);
  return cards.find((card) => card.id === cardId);
}

function handleBoardClick(e: Event): void {
  if (isLocked) return;
  if (!(e.target instanceof Element)) return;

  const button = e.target.closest<HTMLButtonElement>(".card__button");
  if (!button) return;

  const card = getCardFromButton(button);
  if (!card || card.isMatched || card.isFlipped) return;

  revealCard(card);
  flippedCards.push(card);
  if (flippedCards.length === 2) evaluateFlippedCards();
}

export function initGameLogic(cardData: CardData[]): void {
  boardElement = document.getElementById("memory_board");
  if (!boardElement) return;

  cards = cardData;
  flippedCards = [];
  isLocked = false;
  boardElement.addEventListener("click", handleBoardClick);
}
