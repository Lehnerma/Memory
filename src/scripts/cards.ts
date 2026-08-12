import { getGameSettings } from "./theme";
import type { Player } from "./game-logic";

type CardIcon = {
  name: string;
  url: string;
};

export type CardData = {
  id: number;
  pairId: number;
  isMatched: boolean;
  imgPath: string;
  label: string;
  isFlipped: boolean;
};

const ICON_URLS = import.meta.glob("../assets/themes/*/cards-icons/*.*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/**
 * Extracts the theme name from an icon path, i.e. the folder right after
 * `/themes/`.
 *
 * @param path - Import path of an icon.
 * @returns The theme name, or an empty string when the path does not match.
 */
function getThemeFromPath(path: string): string {
  return path.split("/themes/")[1]?.split("/")[0] ?? "";
}

/**
 * Turns an icon path into a display name by taking the file name without
 * its `.png` extension.
 *
 * @param path - Import path of an icon.
 * @returns The icon name used as image `alt` text.
 */
function getIconName(path: string): string {
  const fileName = path.split("/").pop() ?? "";
  return fileName.replace(/\.png$/i, "");
}

/**
 * Sorts all bundled icons into buckets per theme. Paths are sorted first so
 * that the icon order stays stable between reloads.
 *
 * @returns Icons keyed by theme name.
 */
function groupIconsByTheme(): Record<string, CardIcon[]> {
  const grouped: Record<string, CardIcon[]> = {};

  for (const path of Object.keys(ICON_URLS).sort()) {
    const theme = getThemeFromPath(path);
    const icon = { name: getIconName(path), url: ICON_URLS[path] };
    (grouped[theme] ??= []).push(icon);
  }
  return grouped;
}

const THEME_ICONS = groupIconsByTheme();

/**
 * Returns all icons belonging to a theme.
 *
 * @param theme - Theme name.
 * @returns The icon list, empty when the theme is unknown.
 */
function getThemeIcons(theme: string): CardIcon[] {
  return THEME_ICONS[theme] ?? [];
}

/**
 * Reads the selected theme from the stored settings.
 *
 * @returns The theme name, defaulting to `"coding"`.
 */
function getTheme(): string {
  const settings = getGameSettings();
  return settings?.theme ?? "coding";
}

/**
 * Reads the selected board size from the stored settings.
 *
 * @returns The number of cards, defaulting to 16.
 */
function getBoardSize(): number {
  const settings = getGameSettings();
  const size = parseInt(settings?.boardsize ?? "16");
  return size;
}

/**
 * Reads which player opens the game.
 *
 * @returns The starting player, defaulting to `"blue"`.
 */
export function getStartPlayer(): Player {
  const settings = getGameSettings();
  const player = settings?.player;
  return player === "orange" ? "orange" : "blue";
}

/**
 * Builds a single card in its initial state: face down and unmatched.
 *
 * @param id - Unique card ID within the deck.
 * @param pairId - Shared ID of the two cards forming a pair.
 * @param icon - Icon shown on the front face.
 * @returns The card data object.
 */
function createCardObject(id: number, pairId: number, icon: CardIcon): CardData {
  return {
    id,
    pairId,
    isMatched: false,
    isFlipped: false,
    imgPath: icon.url,
    label: icon.name,
  };
}

/**
 * Builds the deck for the current theme, two cards per icon. The deck shrinks
 * when the theme provides fewer icons than the selected board size needs.
 *
 * @returns The unshuffled deck.
 */
function createCardsArray(): CardData[] {
  const icons = getThemeIcons(getTheme());
  const pairCount = Math.min(getBoardSize() / 2, icons.length);
  const cards: CardData[] = [];
  let idIndex = 0;

  for (let i = 0; i < pairCount; i++) {
    cards.push(createCardObject(idIndex++, i, icons[i]));
    cards.push(createCardObject(idIndex++, i, icons[i]));
  }
  return cards;
}

/**
 * Shuffles the deck in place using Fisher-Yates.
 *
 * @param cards - The deck to shuffle.
 * @returns The same array, now in random order.
 */
function shuffleCards(cards: CardData[]): CardData[] {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/**
 * Creates the clickable button that carries both card faces.
 *
 * @returns The button element.
 */
function createBtnCard(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn card__button";
  return button;
}

/**
 * Creates the list item wrapping a card and stores card and pair ID as data
 * attributes, so click handling can find the card again.
 *
 * @param card - The card to wrap.
 * @returns The list item element.
 */
function createWrapperCard(card: CardData): HTMLElement {
  const cardEl = document.createElement("li");
  cardEl.className = "card";
  cardEl.dataset.cardId = String(card.id);
  cardEl.dataset.pairId = String(card.pairId);
  return cardEl;
}

/**
 * Creates the front face holding the theme icon.
 *
 * @param card - The card providing image path and label.
 * @returns The front face element.
 */
function createFrontFace(card: CardData): HTMLElement {
  const front = document.createElement("div");
  front.className = "card__face card__face--front";
  const img = document.createElement("img");
  img.src = card.imgPath;
  img.alt = card.label;
  img.className = "card__face-img";
  front.appendChild(img);
  return front;
}

/**
 * Creates the back face, which is identical for every card.
 *
 * @param card - The card this face belongs to.
 * @returns The back face element.
 */
function createBackFace(card: CardData): HTMLElement {
  const back = document.createElement("div");
  back.className = "card__face card__face--back";
  const img = document.createElement("img");
  img.src = "assets/img/themes/pc-backface.svg";
  img.alt = "backface";
  back.appendChild(img);
  return back;
}

/**
 * Assembles one complete card: wrapper, button and both faces.
 *
 * @param card - The card data to render.
 * @returns The ready to insert card element.
 */
function createCardElement(card: CardData): HTMLElement {
  const cardEl = createWrapperCard(card);
  const button = createBtnCard();
  const frontFace = createFrontFace(card);
  const backFace = createBackFace(card);
  button.append(frontFace, backFace);
  cardEl.appendChild(button);
  return cardEl;
}

/**
 * Renders the whole deck into the board and exposes the board size as a data
 * attribute, which the SCSS grid uses to pick its layout.
 *
 * @param board - The board container element.
 * @param cards - The deck to render.
 */
function renderBoard(board: HTMLElement, cards: CardData[]): void {
  board.dataset.boardsize = String(getBoardSize());
  board.replaceChildren(...cards.map(createCardElement));
}

/**
 * Builds and renders a shuffled deck for the current settings.
 *
 * @returns The rendered deck, empty when the page has no board.
 */
export function initCards(): CardData[] {
  const board = document.querySelector<HTMLElement>("#memory_board");
  if (!board) return [];
  const cards = shuffleCards(createCardsArray());

  renderBoard(board, cards);
  return cards;
}
