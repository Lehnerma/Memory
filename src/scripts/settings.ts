type FieldConfig = {
  fieldsetId: string;
  summaryId: string;
  placeholder: string;
  settingsKey: "theme" | "player" | "boardsize";
};

type Settings = {
  theme: string;
  player: string;
  boardsize: string;
};

const FIELD_CONFIGS: FieldConfig[] = [
  { fieldsetId: "field_themes", summaryId: "summary_theme", placeholder: "Game theme", settingsKey: "theme" },
  { fieldsetId: "field_player", summaryId: "summary_player", placeholder: "Player", settingsKey: "player" },
  { fieldsetId: "field_boardsize", summaryId: "summary_boardsize", placeholder: "Board size", settingsKey: "boardsize" },
];

function getCheckedInput(fieldsetId: string): HTMLInputElement | null {
  const fieldset = document.getElementById(fieldsetId);
  const checkedInput = fieldset?.querySelector<HTMLInputElement>('input[type="radio"]:checked');
  return checkedInput ?? null;
}

function getCheckedLabelText(fieldId: string): string | null {
  const checkedInput = getCheckedInput(fieldId);
  const label = checkedInput?.dataset.label;
  return label ?? null;
}

function updateSummaryField(config: FieldConfig): boolean {
  const summaryElement = document.getElementById(config.summaryId);
  const selectedText = getCheckedLabelText(config.fieldsetId);
  if (summaryElement) {
    summaryElement.textContent = selectedText ?? config.placeholder;
  }
  return selectedText !== null;
}

function updateStartButtonState(allSelected: boolean): void {
  const startButton = document.getElementById("btn_start") as HTMLButtonElement | null;
  if (startButton) startButton.disabled = !allSelected;
}

function getSettingsKey(fieldId: string): string | null {
  const checkedInput = getCheckedInput(fieldId);
  const key = checkedInput?.value;
  return key ?? null;
}

function saveSettings(allSelected: boolean): void {
  if (!allSelected) return;

  const settings = FIELD_CONFIGS.reduce((acc, config) => {
    acc[config.settingsKey] = getSettingsKey(config.fieldsetId) ?? "";
    return acc;
  }, {} as Settings);

  sessionStorage.setItem("gameSettings", JSON.stringify(settings));
}

function updateSummary(): void {
  const allSelected = FIELD_CONFIGS.map(updateSummaryField).every(Boolean);
  updateThemeImg();
  updateStartButtonState(allSelected);
  saveSettings(allSelected);
}

function bindRadioChangeListeners(): void {
  const radioInputs = document.querySelectorAll<HTMLInputElement>(".radio__input");
  radioInputs.forEach((input) => input.addEventListener("change", updateSummary));
}

function goToBoard(): void {
  window.location.href = "board.html";
}

function bindStartButtonListener(): void {
  const startButton = document.getElementById("btn_start");
  startButton?.addEventListener("click", goToBoard);
}

function getTheme(): string | null {
  const input = getCheckedInput("field_themes");
  const value = input?.value;
  return value ?? null;
}

function applyThemeImg(theme: string): void {
  const imgContainer = document.getElementById("theme_preview") as HTMLImageElement | null;
  if (!imgContainer) return;
  imgContainer.src = `../assets/img/themes/${theme}/preview.png`;
}

function updateThemeImg(): void {
  const theme = getTheme();
  if (!theme) return;
  applyThemeImg(theme);
}

function bindThemeHoverListeners(): void {
  const themeLabels = document.querySelectorAll<HTMLLabelElement>("#field_themes .radio");
  themeLabels.forEach((label) => {
    const input = label.querySelector<HTMLInputElement>(".radio__input");
    if (!input) return;
    label.addEventListener("mouseenter", () => applyThemeImg(input.value));
    label.addEventListener("mouseleave", updateThemeImg);
  });
}

export function initSummary(): void {
  if (!document.querySelector(".settings")) return;
  bindRadioChangeListeners();
  bindStartButtonListener();
  bindThemeHoverListeners();
  updateSummary();
}
