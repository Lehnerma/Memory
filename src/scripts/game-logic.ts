import type { CardData } from "./cards";
import { getStartPlayer } from "./cards";

const MISMATCH_DELAY_MS = 500; //todo set to 1000-1500
const GAME_END_DELAY = 2000;

type Scores = {
  blue: number;
  orange: number;
};

export type Player = "blue" | "orange";
type GameResult = Player | "draw";

const PLAYERS: Player[] = ["blue", "orange"];

const scores: Scores = {
  blue: 0,
  orange: 0,
};

let cards: CardData[] = [];

let flippedCards: CardData[] = [];
let boardElement: HTMLElement | null = null;
let isLocked = false;
let currentPlayer: Player;

function setCurrentPlayer(): void {
  currentPlayer = getStartPlayer();
  updateCurrentPlayerIcon();
}

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

function updateCurrentPlayerIcon(): void {
  const el = document.getElementById("current_player_icon");
  if (!el) return;
  el.classList.remove("current-player-blue", "current-player-orange");
  el.classList.add(`current-player-${currentPlayer}`);
}

function switchPlayer(): void {
  currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
  updateCurrentPlayerIcon();
}

function markAsPair(card: CardData): void {
  card.isMatched = true;
  findCardFront(card.id)?.classList.add("card--pair");
}

function updateScore(player: Player): void {
  const element = document.getElementById(`player_score_${player}`);
  if (!element) return;
  element.textContent = scores[player].toString();
}

function updateAllScores(): void {
  PLAYERS.forEach(updateScore);
}

function resetScores(): void {
  PLAYERS.forEach((player) => (scores[player] = 0));
  updateAllScores();
}

function countScore(): void {
  scores[currentPlayer]++;
  updateScore(currentPlayer);
}

function isGameEnd(): boolean {
  return cards.every((card) => card.isMatched);
}

function getWinner(): GameResult {
  if (scores.blue > scores.orange) {
    return "blue";
  } else if (scores.blue < scores.orange) {
    return "orange";
  } else {
    return "draw";
  }
}

function saveResult(): void {
  const result = { winner: getWinner(), scores: scores };
  sessionStorage.setItem("gameResult", JSON.stringify(result));
}

function checkGameEnd(): void {
  if (isGameEnd()) {
    window.setTimeout(() => {
      saveResult();
    }, GAME_END_DELAY);
  }
}

function resolveMatch(): void {
  flippedCards.forEach(markAsPair);
  countScore();
  checkGameEnd();
  flippedCards = [];
}

function resolveMismatch(): void {
  const mismatched = flippedCards;
  flippedCards = [];
  isLocked = true;

  window.setTimeout(() => {
    mismatched.forEach(hideCard);
    isLocked = false;
    switchPlayer();
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
  setCurrentPlayer();
  resetScores();
  cards = cardData;
  flippedCards = [];
  isLocked = false;
  boardElement.addEventListener("click", handleBoardClick);
}
