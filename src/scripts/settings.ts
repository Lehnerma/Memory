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

/**
 * Finds the currently selected radio input inside a fieldset.
 *
 * @param fieldsetId - ID of the fieldset to search in.
 * @returns The checked input, or `null` when nothing is selected.
 */
function getCheckedInput(fieldsetId: string): HTMLInputElement | null {
  const fieldset = document.getElementById(fieldsetId);
  const checkedInput = fieldset?.querySelector<HTMLInputElement>('input[type="radio"]:checked');
  return checkedInput ?? null;
}

/**
 * Reads the human readable label of the selected option from `data-label`.
 *
 * @param fieldId - ID of the fieldset to read from.
 * @returns The label text, or `null` when nothing is selected.
 */
function getCheckedLabelText(fieldId: string): string | null {
  const checkedInput = getCheckedInput(fieldId);
  const label = checkedInput?.dataset.label;
  return label ?? null;
}

/**
 * Writes the selected option into its summary line, falling back to the
 * placeholder while the field is still untouched.
 *
 * @param config - Field configuration linking fieldset and summary element.
 * @returns `true` when the field has a selection.
 */
function updateSummaryField(config: FieldConfig): boolean {
  const summaryElement = document.getElementById(config.summaryId);
  const selectedText = getCheckedLabelText(config.fieldsetId);
  if (summaryElement) {
    summaryElement.textContent = selectedText ?? config.placeholder;
  }
  return selectedText !== null;
}

/**
 * Enables the start button only once every field has a selection.
 *
 * @param allSelected - Whether all fields are filled in.
 */
function updateStartButtonState(allSelected: boolean): void {
  const startButton = document.getElementById("btn_start") as HTMLButtonElement | null;
  if (startButton) startButton.disabled = !allSelected;
}

/**
 * Reads the machine readable value of the selected option.
 *
 * @param fieldId - ID of the fieldset to read from.
 * @returns The input value, or `null` when nothing is selected.
 */
function getSettingsKey(fieldId: string): string | null {
  const checkedInput = getCheckedInput(fieldId);
  const key = checkedInput?.value;
  return key ?? null;
}

/**
 * Persists the chosen settings to the session storage so that board and
 * endscreen can pick them up. Skips saving while the form is incomplete.
 *
 * @param allSelected - Whether all fields are filled in.
 */
function saveSettings(allSelected: boolean): void {
  if (!allSelected) return;

  const settings = FIELD_CONFIGS.reduce((acc, config) => {
    acc[config.settingsKey] = getSettingsKey(config.fieldsetId) ?? "";
    return acc;
  }, {} as Settings);

  sessionStorage.setItem("gameSettings", JSON.stringify(settings));
}

/**
 * Refreshes the whole settings panel: summary lines, preview image,
 * start button state and the stored settings.
 */
function updateSummary(): void {
  const allSelected = FIELD_CONFIGS.map(updateSummaryField).every(Boolean);
  updateThemeImg();
  updateStartButtonState(allSelected);
  saveSettings(allSelected);
}

/**
 * Makes every radio input refresh the panel when its selection changes.
 */
function bindRadioChangeListeners(): void {
  const radioInputs = document.querySelectorAll<HTMLInputElement>(".radio__input");
  radioInputs.forEach((input) => input.addEventListener("change", updateSummary));
}

/**
 * Starts the game by navigating to the board page.
 */
function goToBoard(): void {
  window.location.href = "board.html";
}

/**
 * Wires the start button to the board navigation.
 */
function bindStartButtonListener(): void {
  const startButton = document.getElementById("btn_start");
  startButton?.addEventListener("click", goToBoard);
}

/**
 * Reads the value of the currently selected theme.
 *
 * @returns The theme name, or `null` when no theme is selected.
 */
function getTheme(): string | null {
  const input = getCheckedInput("field_themes");
  const value = input?.value;
  return value ?? null;
}

/**
 * Swaps the preview image to the given theme.
 *
 * @param theme - Theme name used as folder name of the preview image.
 */
function applyThemeImg(theme: string): void {
  const imgContainer = document.getElementById("theme_preview") as HTMLImageElement | null;
  if (!imgContainer) return;
  imgContainer.src = `assets/img/themes/${theme}/preview.png`;
}

/**
 * Resets the preview image back to the selected theme.
 */
function updateThemeImg(): void {
  const theme = getTheme();
  if (!theme) return;
  applyThemeImg(theme);
}

/**
 * Lets the preview image follow the mouse: hovering a theme label shows a
 * sneak peek, leaving it restores the selected theme.
 */
function bindThemeHoverListeners(): void {
  const themeLabels = document.querySelectorAll<HTMLLabelElement>("#field_themes .radio");
  themeLabels.forEach((label) => {
    const input = label.querySelector<HTMLInputElement>(".radio__input");
    if (!input) return;
    label.addEventListener("mouseenter", () => applyThemeImg(input.value));
    label.addEventListener("mouseleave", updateThemeImg);
  });
}

/**
 * Loads the game settings from session storage.
 *
 * @returns The stored settings object, or `null` if no settings are found.
 */
function loadSettings(): Settings | null {
  try {
    const value = sessionStorage.getItem("gameSettings");
    return value ? JSON.parse(value) : null;
  } catch{
    return null;
  }
}

/**
 * Applies a stored setting value to its corresponding radio input.
 *
 * @param config - Field configuration linking fieldset and setting key.
 * @param settings - The settings object containing the value to apply.
 */
function applyStoredValue(config: FieldConfig, settings: Settings): void {
  const fieldset = document.getElementById(config.fieldsetId);
  if (!fieldset) return;
  const radioInputs = Array.from(fieldset.querySelectorAll<HTMLInputElement>(".radio__input"));
  const input = radioInputs.find((el) => el.value === settings[config.settingsKey]);
  if (input) input.checked = true;
}

/**
 * Restores all saved settings to their corresponding form fields.
 */
function restoreSettings(): void {
  const settings = loadSettings();
  if (!settings) return;
  FIELD_CONFIGS.forEach((field) => {
    applyStoredValue(field, settings);
  });
}

/**
 * Sets up the settings page. Bails out on every other page.
 */
export function initSummary(): void {
  if (!document.querySelector(".settings")) return;
  bindRadioChangeListeners();
  bindStartButtonListener();
  bindThemeHoverListeners();
  restoreSettings();
  updateSummary();
}
