# Projekt-Doku

Chronologisches Arbeitstagebuch. Menschlich lesbar, keine Memory-DB.

## 2026-07-30

**Settings-Seite: Preview-Bild, Multi-Page-Build, Semantik**

- Ziel: In der Settings-Seite Platz für ein dynamisch austauschbares Theme-Preview-Bild schaffen (Platzhalter `code-vibes/default.png`).
- Dabei aufgefallen: `pages/settings.html` war versehentlich nach `public/pages/settings.html` verschoben worden. Problem: Dateien in `public/` werden von Vite unverändert kopiert, nicht als Build-Entry verarbeitet — der `<script src="../src/main.ts">` wäre dadurch nie zu echtem JS gebündelt worden. HTML-Entry-Punkte gehören ins Projekt-Root (`pages/`), nicht nach `public/`.
- Datei zurück nach `pages/settings.html` verschoben. `vite.config.ts` um `build.rollupOptions.input` erweitert (zwei Entries: `index.html` und `pages/settings.html`), damit Vite beide Seiten korrekt baut. `__dirname` funktioniert im ESM-Config-Kontext nicht — stattdessen `dirname(fileURLToPath(import.meta.url))` verwendet.
- Bildpfad-Frage geklärt (empirisch getestet, nicht geraten): `%BASE_URL%` funktioniert bei `base: ""` **nicht** zuverlässig für verschachtelte HTML-Entries (löst zu `"./"` auf, nicht tiefen-bewusst — führt bei `pages/settings.html` auf einen falschen, nicht existierenden Pfad). Korrekt und getestet (Build + Dev-Server, beide HTTP 200): relativer Pfad `../assets/img/themes/code-vibes/default.png` aus `pages/settings.html` heraus. Faustregel: Inhalte aus `public/` werden immer **ohne** das Präfix `public/` an der Root ausgeliefert.
- HTML-Struktur für Settings-Main jetzt geplant als 2-Spalten-Layout: linke Spalte = ein `<section>` mit den drei Options-Gruppen (Game Themes, Choose Player, Board Size), rechte Spalte = `<section>` mit `<figure>` (Preview-Bild + spätere Zusammenfassung als `<figcaption>`). Semantik-Review ergab: `<article>` war falsch gewählt (kein syndizierbarer Inhalt) → `<section>`; Options-Gruppen sollten `<fieldset>`/`<legend>` statt `<h2>`+`<div>` sein, damit Screenreader Gruppe+Label korrekt announced.
- Theme-Wechsel wird **live per JS** ausgelesen (`change`-Event auf den Radios/Checkboxes), kein `<form>`-Submit nötig.
- Entscheidung Max: Barrierefreiheit hat in diesem Projekt (privates Memory-Spiel) keine hohe Priorität — sauberes semantisches HTML bleibt aber wichtig. In `.claude/CLAUDE.md` hinterlegt.
- Nebenbei entdeckt und behoben: Projekt-`CLAUDE.md` lag unter `claude/CLAUDE.md` (Ordner ohne führenden Punkt) und wurde dadurch von Claude Code nie automatisch geladen. Nach `.claude/CLAUDE.md` verschoben (dort lag bereits `settings.local.json`).

## 2026-08-01

**Issue #16: Radio-Button-Styling in den Settings**

- Branch `radio-button` (bereits vorher angelegt). Issue: [#16](https://github.com/Lehnerma/Memory/issues/16) "Settings - Radio Button Styling", Parent-Issue #8. Anforderung laut Figma: Kreis-Radio mit Punkt in der Mitte bei `:checked`; Label-Text `Almarai` 20px, `font-weight: 400` normal / `700` wenn ausgewählt. Nur CSS, kein JS.
- Für den Codebase-Überblick den `session-code-reviewer`-Subagenten (Haiku) genutzt, um `settings.html`, `_settings.scss`, `_buttons.scss`, `_fonts.scss`, `buttons.ts` etc. zu lesen. Ergebnis: Radios sind native `<input type="radio">` ohne Custom-Styling, Label ist `.settings__field--text` mit `@include u.f-almarai(20)` (nur Größe, kein weight-Wechsel). Das existierende SVG-Line-Toggle über `:not(:checked) + .svg__line { display: none; }` war schon vorhanden und blieb unverändert.
- Figma-Referenzbild aus dem Issue lokal heruntergeladen und angesehen (GitHub user-attachments Link), um das Design zu verifizieren statt zu raten.
- Umsetzung in `src/styles/pages/_settings.scss`:
  - `--text`: `line-height: 100%` ergänzt; neuer Selektor `&:has(.settings__field--radio-btn:checked) { font-weight: 700; }` — Label wird automatisch bold sobald sein Radio-Input checked ist, ganz ohne JS. Voraussetzung: moderner Browser-Support für `:has()` (2026 breit verfügbar).
  - `--radio-btn`: `appearance: none` + `border: 2px solid base.$primary-dark` + `border-radius: 50%` als Ring; `::before`-Pseudo-Element (12px Kreis, `base.$primary-dark`) das bei `:checked` per `transform: scale(0) → scale(1)` eingeblendet wird (nutzt vorhandenes `u.transition`-Mixin).
  - Nicht umgesetzt: `leading-trim: none` aus dem Figma-Spec — kein stabiler CSS-Standard, nur experimentell hinter Chrome-Flags, bewusst weggelassen.
- Verhalten heute: Max wollte für diese Session **keinen Mentor-Modus**, sondern direkte Senior-Dev-Hilfe (Code selbst schreiben, nicht sokratisch fragen). Sichtprüfung im Dev-Server macht Max selbst — nicht proaktiv `npm run dev` starten (siehe Memory `feedback_no_proactive_devserver`).

**7-1-Pattern: Radio-Styles zur eigenen Komponente extrahiert**

- Max wollte die neuen Radio-Styles nicht settings-spezifisch lassen, sondern sauber ins 7-1-Pattern einsortieren (Ordner `base/components/layout/pages/themes/utilities/vendor` + `style.scss` sind bereits als 7-1 angelegt).
- Entscheidung (Rückfrage via AskUserQuestion): neuer generischer BEM-Block `.radio` statt settings-gebundenem `settings__field--text`/`settings__field--radio-btn` — analog zu `.btn` und `.svg`, die schon in `components/` liegen.
- Neue Datei `src/styles/components/_radio.scss`: enthält `.radio` (Label-Wrapper mit Almarai 20px, `:has(.radio__input:checked)` → `font-weight: 700`) und `.radio__input` (Ring + `::before`-Punkt-Kreis, `:checked`-Transition). Die SVG-Line-Toggle-Regel (`:not(:checked) + .svg__line { display: none; }`) ist mit umgezogen, da sie Teil des wiederverwendbaren Radio-Verhaltens ist, nicht settings-spezifisch.
- `components/_index.scss`: `@forward "radio";` ergänzt.
- `pages/_settings.scss`: die alten `&--text`/`&--radio-btn`-Regeln entfernt — `&__field` enthält jetzt nur noch page-spezifisches Layout (Icon-Größe, Title, Options-Gap/Margin).
- `pages/settings.html`: alle 9 Radio-Labels/Inputs von `settings__field--text`/`settings__field--radio-btn` auf `radio`/`radio__input` umbenannt.
- Verifiziert mit `npx vite build` (nur Compile-Check, kein Dev-Server) — SCSS kompiliert fehlerfrei. Dabei aus Versehen `dist/index.html` neu gebaut (dist ist zwar in `.gitignore`, aber aus einem alten Commit noch getrackt) — wieder auf den committeten Stand zurückgesetzt (`git checkout -- dist/index.html`), damit kein unrelated Diff reinrutscht.

## 2026-08-02

**Issue #14: Dynamic Summary — Radio-Auswahl live in der Summary anzeigen + Start-Button-Gate**

- Branch `dynamic_summary` (bereits vorher angelegt). Issue: [#14](https://github.com/Lehnerma/Memory/issues/14) "Dynamic Summary", Parent #8. Verhalten heute: Max hat für diese Session explizit **Senior-Dev-Modus statt Mentor-Modus** angefragt (Code direkt schreiben, für Rückfragen bereitstehen) — abweichend vom sonst geltenden Mentor-Default aus `.claude/CLAUDE.md`.
- Fehlende HTML-IDs ergänzt (`pages/settings.html`): `id="field_player"` / `id="field_boardsize"` auf den bisher unlabelten Fieldsets, `id="summary_theme"` / `id="summary_player"` / `id="summary_boardsize"` auf den drei Summary-`<p>`-Elementen (vorher `id=""`), `id="btn_start"` auf dem Start-Button. Alles snake_case, konsistent zu bestehenden IDs (`btn_play`, `theme_preview`, `field_themes`).
- Neue Datei `src/scripts/summary.ts`: liest pro Fieldset den gecheckten Radio-Button aus (`getCheckedLabelText`), nutzt dafür den sichtbaren Label-Text statt eines `value`-Attributs (Player/Board-Size-Inputs hatten gar keine `value`s) — spart zusätzliche HTML-Änderungen und die Summary zeigt automatisch lesbaren Text ("Blue", "16 Cards" etc.). Kleine Funktionen nach Single-Responsibility: `getCheckedLabelText`, `updateSummaryField`, `updateStartButtonState`, `updateSummary`, `bindRadioChangeListeners`, exportiertes `initSummary()`.
- `initSummary()` guardet auf `document.querySelector(".settings")`, da `index.html` und `pages/settings.html` beide dasselbe `src/main.ts` als Script-Entry einbinden (siehe `vite.config.ts` Multi-Page-Build) — ohne Guard würde die Logik auch auf der Landingpage laufen und dort ins Leere greifen.
- `src/main.ts`: `initSummary()` in `init()` eingehängt, Platzhalter-`console.log('Hello World')` entfernt.
- `src/scripts/buttons.ts`: alten auskommentierten `returnTheme()`-Referenzcode aus dem Issue entfernt, da jetzt durch `summary.ts` ersetzt/abgedeckt.
- Kollision entdeckt: Max hatte parallel schon `src/scripts/input.ts` mit einer Kommentar-Skizze (`inputs abfragen`, `dynamisch einfügen in summary`, `btn active`) angelegt — inhaltlich identisch zu dem, was gerade in `summary.ts` gebaut wurde. Nach Rückfrage: `summary.ts` behalten, `input.ts` gelöscht.
- Verifiziert mit `npx tsc --noEmit` (sauber) und `npx vite build` (kompiliert fehlerfrei); `dist/` danach wieder zurückgesetzt (siehe oben, gleiche Altlast wie bei Issue #16).

**Issue #14 Fortsetzung: zurück in den Mentor-Modus, value/data-label-Refactor, Theme-Bild-Update**

- Max wollte den restlichen Teil von Issue #14 **selbst schreiben**, ich sollte nur bei Fragen helfen — also zurück in den Mentor-Modus laut `.claude/CLAUDE.md` (Ausnahme vom Vortag war nur für Issue #16 gedacht, nicht dauerhaft). Beide CLAUDE.md (global + Projekt) auf Wunsch nochmal explizit gegengecheckt.
- Diskussion Label-Text vs. `value`-Attribut fürs Auslesen der Summary-Anzeige: Label-Text-Parsing (`closest("label")` + Regex) ist implizit an die HTML-Textstruktur gekoppelt und bricht leicht bei Markup-Änderungen; `value`-Attribut ist explizit, aber Theme-Radios nutzten `value` schon als Slug (`coding`, `gaming`, ...) für spätere Bildpfade, nicht als Anzeigetext. Entscheidung Max: **Variante mit zusätzlichem `data-label`-Attribut** — `value` bleibt überall Slug, `data-label` trägt den Anzeigetext. Alle 9 Radio-Inputs in `pages/settings.html` entsprechend ergänzt (Player/Board-Size hatten anfangs noch kein `data-label` bei den 4 Theme-Inputs — per `session-code-reviewer`-Review gefunden und nachgezogen).
- `summary.ts` refactored: neue Hilfsfunktion `getCheckedInput(fieldsetId): HTMLInputElement | null` extrahiert (Fieldset-Suche + `querySelector(':checked')`), damit `getCheckedLabelText` diese Logik nicht mehr dupliziert und jetzt nur noch `checkedInput?.dataset.label` ausliest statt der alten Label-Text/Regex-Variante.
- Dabei ein Typ-Mismatch-Bug entstanden (Parameterübergabe zwischen `getCheckedInput`, `getCheckedLabelText`, `updateSummaryField` nicht konsistent — mal Objekt statt String übergeben, mal umgekehrt) — von Max selbst gefunden und gefixt, per `session-code-reviewer` gegengeprüft.
- Neue Funktionen `getTheme()` und `updateThemeImg()`: lesen den Slug des gecheckten Theme-Radios aus und setzen `src` von `#theme_preview` dynamisch auf `../assets/img/themes/<slug>/default.png`. Mehrere Anläufe nötig (von Max selbst geschrieben, iterativ per Review korrigiert): falscher Pfad-Präfix (`public/` fälschlich mit reingenommen, `../`-Präfix anfangs vergessen), und ein Guard `if (!newImgPath) return` der nie greifen konnte, weil ein Template-String mit `${null}` zu `"null"` gecastet wird und dadurch nie leer/falsy ist — Lerneffekt: Null-Checks müssen auf der Rohquelle (`theme`) passieren, bevor der String gebaut wird, nicht hinterher auf das fertige Ergebnis. Finale Version der Funktion habe ich auf Max' expliziten Wunsch ("stelle du die eine function richtig") direkt geschrieben.
- Für alle Code-Reviews in dieser Session durchgehend den `session-code-reviewer`-Subagenten (Haiku) genutzt, wie in `.claude/CLAUDE.md` vorgeschrieben.
- Offen: Max hatte angekündigt, `summary.ts` perspektivisch auf `settings.ts` umzubenennen (Datei übernimmt jetzt mehr als nur Summary-Logik) — noch nicht umgesetzt.
