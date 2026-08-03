type FieldConfig = {
  fieldsetId: string;
  summaryId: string;
  placeholder: string;
};

const FIELD_CONFIGS: FieldConfig[] = [
  { fieldsetId: "field_themes", summaryId: "summary_theme", placeholder: "Game theme" },
  { fieldsetId: "field_player", summaryId: "summary_player", placeholder: "Player" },
  { fieldsetId: "field_boardsize", summaryId: "summary_boardsize", placeholder: "Board size" },
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

function updateSummary(): void {
  const allSelected = FIELD_CONFIGS.map(updateSummaryField).every(Boolean);
  updateThemeImg();
  updateStartButtonState(allSelected);
}

function bindRadioChangeListeners(): void {
  const radioInputs = document.querySelectorAll<HTMLInputElement>(".radio__input");
  radioInputs.forEach((input) => input.addEventListener("change", updateSummary));
}

function getTheme(): string | null {
  const input = getCheckedInput("field_themes");
  const value = input?.value;
  return value ?? null;
}

function updateThemeImg(): void {
  const theme = getTheme();
  if (!theme) return;
  const imgContainer = document.getElementById("theme_preview") as HTMLImageElement | null;
  if (!imgContainer) return;
  imgContainer.src = `../assets/img/themes/${theme}/preview.png`;
}

export function initSummary(): void {
  if (!document.querySelector(".settings")) return;
  bindRadioChangeListeners();
  updateSummary();
}
