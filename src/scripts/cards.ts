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

function getThemeFromPath(path: string): string {
  return path.split("/themes/")[1]?.split("/")[0] ?? "";
}

function getIconName(path: string): string {
  const fileName = path.split("/").pop() ?? "";
  return fileName.replace(/\.png$/i, "");
}

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

function getThemeIcons(theme: string): CardIcon[] {
  return THEME_ICONS[theme] ?? [];
}

function getTheme(): string {
  const settings = getGameSettings();
  return settings?.theme ?? "coding";
}

function getBoardSize(): number {
  const settings = getGameSettings();
  const size = parseInt(settings?.boardsize ?? "16");
  return size;
}

export function getStartPlayer(): Player {
  const settings = getGameSettings();
  const player = settings?.player;
  return player === "orange" ? "orange" : "blue";
}

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

function shuffleCards(cards: CardData[]): CardData[] {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function createBtnCard(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn card__button";
  return button;
}

function createWrapperCard(card: CardData): HTMLElement {
  const cardEl = document.createElement("li");
  cardEl.className = "card";
  cardEl.dataset.cardId = String(card.id);
  cardEl.dataset.pairId = String(card.pairId);
  return cardEl;
}

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

function createBackFace(card: CardData): HTMLElement {
  const back = document.createElement("div");
  back.className = "card__face card__face--back";
  const img = document.createElement("img");
  img.src = "../assets/img/themes/pc-backface.svg";
  img.alt = "backface";
  back.appendChild(img);
  return back;
}

function createCardElement(card: CardData): HTMLElement {
  const cardEl = createWrapperCard(card);
  const button = createBtnCard();
  const frontFace = createFrontFace(card);
  const backFace = createBackFace(card);
  button.append(frontFace, backFace);
  cardEl.appendChild(button);
  return cardEl;
}

function renderBoard(board: HTMLElement, cards: CardData[]): void {
  board.dataset.boardsize = String(getBoardSize());
  board.replaceChildren(...cards.map(createCardElement));
}

export function initCards(): CardData[] {
  const board = document.querySelector<HTMLElement>("#memory_board");
  if (!board) return [];
  const cards = shuffleCards(createCardsArray());
  renderBoard(board, cards);
  return cards;
}
