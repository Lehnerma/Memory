import { getGameSettings } from "./theme";

type CardData = {
  id: number;
  pairId: number;
  isMatched: boolean;
  imgPath: string;
  isFlipped: boolean;
};

function imgPathTemplate(theme: string, index: number): string {
  return `../assets/img/themes/${theme}/cards/${theme}-card${index}.png`;
}

function getCardBackImgPath(theme: string): string {
  return `../assets/img/themes/${theme}/cards/${theme}-card-bg.png`;
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

function createCardObject(id: number, pairId: number, imgPath: string): CardData {
  return { id, pairId, isMatched: false, isFlipped: false, imgPath };
}

function createCardsArray(): CardData[] {
  const size = getBoardSize();
  const theme = getTheme();
  let idIndex = 0;

  const cards: CardData[] = [];

  for (let i = 1; i <= size / 2; i++) {
    const newPath = imgPathTemplate(theme, i);
    cards.push(createCardObject(idIndex++, i, newPath));
    cards.push(createCardObject(idIndex++, i, newPath));
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
  img.alt = "card-face-front";
  img.className = "card__face-img";
  front.appendChild(img);
  return front;
}

function createBackFace(card: CardData): HTMLElement {
  const back = document.createElement("div");
  back.className = "card__face card__face--back";
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
  board.style.setProperty("--card-back-img", `url(${getCardBackImgPath(getTheme())})`);
  board.replaceChildren(...cards.map(createCardElement));
}

export function initCards() {
  const board = document.querySelector<HTMLElement>("#memory_board");
  if (!board) return;

  const cards = shuffleCards(createCardsArray());
  renderBoard(board, cards);
}
