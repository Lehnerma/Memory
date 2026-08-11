import type { CardData } from "./cards";
import { getStartPlayer } from "./cards";

const MISMATCH_DELAY_MS = 1000;
const GAME_END_DELAY = 2000;

type Scores = {
  blue: number;
  orange: number;
};

export type Player = "blue" | "orange";
export type GameResult = Player | "draw";

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

/**
 * Sets the opening player from the settings and shows the matching icon.
 */
function setCurrentPlayer(): void {
  currentPlayer = getStartPlayer();
  updateCurrentPlayerIcon();
}

/**
 * Finds a card element on the board by its card ID.
 *
 * @param id - The card ID.
 * @returns The card element, or `null` when it does not exist.
 */
function findCardElement(id: number): HTMLElement | null {
  return boardElement?.querySelector<HTMLElement>(`[data-card-id="${id}"]`) ?? null;
}

/**
 * Finds the clickable button of a card.
 *
 * @param id - The card ID.
 * @returns The button element, or `null` when it does not exist.
 */
function findCardButton(id: number): HTMLButtonElement | null {
  const cardEl = findCardElement(id);
  return cardEl?.querySelector<HTMLButtonElement>(".card__button") ?? null;
}

/**
 * Finds the front face of a card, the element that carries the match styling.
 *
 * @param id - The card ID.
 * @returns The front face element, or `null` when it does not exist.
 */
function findCardFront(id: number): HTMLElement | null {
  const cardEl = findCardElement(id);
  return cardEl?.querySelector<HTMLElement>(".card__face--front") ?? null;
}

/**
 * Flips a card face up, in the data and visually.
 *
 * @param card - The card to reveal.
 */
function revealCard(card: CardData): void {
  card.isFlipped = true;
  findCardButton(card.id)?.classList.add("card__flipped");
}

/**
 * Flips a card back face down, in the data and visually.
 *
 * @param card - The card to hide.
 */
function hideCard(card: CardData): void {
  card.isFlipped = false;
  findCardButton(card.id)?.classList.remove("card__flipped");
}

/**
 * Moves the "current player" marker in the header to the active player.
 */
function updateCurrentPlayerIcon(): void {
  const el = document.getElementById("current_player_icon");
  if (!el) return;
  el.classList.remove("current-player-blue", "current-player-orange");
  el.classList.add(`current-player-${currentPlayer}`);
}

/**
 * Hands the turn over to the other player.
 */
function switchPlayer(): void {
  currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
  updateCurrentPlayerIcon();
}

/**
 * Marks a card as permanently found and styles it as part of a pair.
 *
 * @param card - The matched card.
 */
function markAsPair(card: CardData): void {
  card.isMatched = true;
  findCardFront(card.id)?.classList.add("card--pair");
}

/**
 * Writes one player's score into the header.
 *
 * @param player - The player whose display should be refreshed.
 */
function updateScore(player: Player): void {
  const element = document.getElementById(`player_score_${player}`);
  if (!element) return;
  element.textContent = scores[player].toString();
}

/**
 * Refreshes the score display of both players.
 */
function updateAllScores(): void {
  PLAYERS.forEach(updateScore);
}

/**
 * Resets both scores to zero, in the data and on screen. Needed because the
 * scores live in module state that survives a restart within the same page.
 */
function resetScores(): void {
  PLAYERS.forEach((player) => (scores[player] = 0));
  updateAllScores();
}

/**
 * Credits the found pair to the active player.
 */
function countScore(): void {
  scores[currentPlayer]++;
  updateScore(currentPlayer);
}

/**
 * Checks whether every card has been matched.
 *
 * @returns `true` when the board is cleared.
 */
function isGameEnd(): boolean {
  return cards.every((card) => card.isMatched);
}

/**
 * Compares both scores.
 *
 * @returns The winning player, or `"draw"` when the scores are equal.
 */
function getWinner(): GameResult {
  if (scores.blue > scores.orange) {
    return "blue";
  } else if (scores.blue < scores.orange) {
    return "orange";
  } else {
    return "draw";
  }
}

/**
 * Stores winner and scores in the session storage for the endscreen.
 */
function saveResult(): void {
  const result = { winner: getWinner(), scores: scores };
  sessionStorage.setItem("gameResult", JSON.stringify(result));
}

/**
 * Ends the game once the board is cleared. The delay lets the player see the
 * last pair before the endscreen takes over.
 */
function checkGameEnd(): void {
  if (isGameEnd()) {
    window.setTimeout(() => {
      saveResult();
      window.location.href = "./endscreen.html";
    }, GAME_END_DELAY);
  }
}

/**
 * Handles a successful match: both cards stay open, the active player scores
 * and keeps the turn.
 */
function resolveMatch(): void {
  flippedCards.forEach(markAsPair);
  countScore();
  checkGameEnd();
  flippedCards = [];
}

/**
 * Handles a failed match: the board is locked for a moment so both cards stay
 * readable, then they flip back and the turn changes.
 */
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

/**
 * Compares the two open cards and routes to match or mismatch handling.
 */
function evaluateFlippedCards(): void {
  const [first, second] = flippedCards;
  if (first.pairId === second.pairId) resolveMatch();
  else resolveMismatch();
}

/**
 * Resolves the card data behind a clicked card button.
 *
 * @param button - The clicked card button.
 * @returns The matching card, or `undefined` when the ID is unknown.
 */
function getCardFromButton(button: HTMLButtonElement): CardData | undefined {
  const cardEl = button.closest<HTMLElement>(".card");
  const cardId = Number(cardEl?.dataset.cardId);
  return cards.find((card) => card.id === cardId);
}

/**
 * Single click handler for the whole board (event delegation). Ignores clicks
 * while the board is locked, outside a card, or on an already open card.
 *
 * @param e - The click event from the board element.
 */
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

/**
 * Starts a round: resets the module state, sets the opening player and
 * attaches the board click handler. Bails out when there is no board.
 *
 * @param cardData - The rendered deck to play with.
 */
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
