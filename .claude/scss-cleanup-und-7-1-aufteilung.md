# SCSS-Cleanup & 7-1-Aufteilung von `pages/_board.scss`

Kontext: Nach dem finalen Theme-Abgleich mit Figma (2026-08-05) wurde die Codebase aufgeräumt — zuerst tote Variablen entfernt, danach `pages/_board.scss` ins bestehende 7-1-Pattern (`base/components/layout/pages/themes/utilities/vendor`) einsortiert.

## 1. Entfernte tote Variablen

Analyse per `session-code-reviewer`-Subagent (Haiku), Ergebnis danach manuell per `grep` gegengeprüft — der Subagent hatte bei den CSS-Custom-Properties mehrfach falsch positive Treffer (zu viele fast identische Variablennamen für ein kleines Modell). Nur die grep-verifizierten Funde wurden entfernt.

### Sass-Variablen (`base/_colors.scss`)

| Variable | Grund |
|---|---|
| `$coding-player-blue` | Nirgends referenziert (Theme nutzt stattdessen die universellen `$player-blue`/`$player-orange`) |
| `$coding-player-orange` | s.o. |
| `$projects-btn-exit-bg` | Doppelter Alias auf `$projects-coral`, das Original wird direkt in `_projects.scss` referenziert, der Alias nirgends |
| `$projects-exit-bg-hover` | Doppelter Alias auf `$projects-coral-dark`, gleicher Fall |

### CSS Custom Properties (Theme-Dateien)

| Variable | Theme | Grund |
|---|---|---|
| `--dialog-border-width-hover` | Coding | Kein `var()`-Aufruf mehr dafür — `_board.scss` nutzt inzwischen `--dialog-back-btn-border-width-hover` (umbenannt, alte Property blieb als Leiche zurück) |
| `--dialog-back-btn-txt` (ohne `-color`-Suffix) | Coding, Projects | Altlast einer Umbenennung auf `--dialog-back-btn-txt-color` — nur die `-color`-Variante wird in `_board.scss` konsumiert |
| `--dialog-back-btn-border` (bare, ohne `-hover`) | Gaming, Food | `_board.scss` liest für den Border-Color-State nur `--dialog-back-btn-bg` (Base) bzw. `--dialog-back-btn-border-hover` (Hover) — die bare Variante wird nie gelesen |
| `--dialog-back-btn-border-width` (bare) | Food | Nur die `-hover`-Variante wird in `_board.scss` konsumiert, die bare Variante nirgends |

### Ungenutztes Mixin

- `@mixin button()` in `utilities/_buttons.scss` — nirgends per `@include` verwendet. Datei enthielt nur dieses eine Mixin, daher komplett gelöscht (`utilities/_buttons.scss`) und der `@forward "buttons";` in `utilities/_index.scss` entfernt. **Nicht verwechseln** mit `components/_buttons.scss` (`.btn`-Klasse) — die ist aktiv in Verwendung und blieb unangetastet.

### Bewusst NICHT entfernt (Asymmetrien, aber kein toter Code)

Beim Verifizieren aufgefallen, aber das sind fehlende/asymmetrische Werte, keine toten Variablen — daher nicht angefasst:
- Coding/Gaming haben kein bares `--dialog-exit-btn-border-width` (nur die `-hover`-Variante) → Basiswert fällt auf den Literal-Fallback `2px` zurück.
- Food hat kein `--dialog-exit-btn-border-width-hover` → Hover fällt auf `2px` zurück, obwohl die Basis-Breite dort `3px` ist (könnte beim Hover optisch "schrumpfen").
- Nur Gaming hat `--dialog-back-btn-border-width-hover` gesetzt, die anderen drei Themes fallen auf den Literal-Fallback `1px` zurück.

Das sind Design-Lücken, keine Cleanup-Fälle — würde ich separat mit Max klären (Figma-Check), nicht im Rahmen dieses Aufräumens entschieden.

## 2. 7-1-Aufteilung

### Verschoben: `.exit-dialog` → `components/_dialog.scss` (neu)

**Warum:** Ein `<dialog>`-Bestätigungsdialog (Titel + zwei Buttons: Zurück/Bestätigen) ist ein generisches, wiederverwendbares UI-Muster — kein board-spezifischer Inhalt. Das passt zur bestehenden Konvention im Projekt: `.btn`, `.svg`, `.radio` liegen alle in `components/`, obwohl sie ursprünglich nur auf einer Seite gebraucht wurden (`.radio` wurde in einer früheren Session exakt aus diesem Grund aus `pages/_settings.scss` nach `components/_radio.scss` verschoben). Der Dialog folgt demselben Prinzip.

- Klassenname `.exit-dialog` bewusst **nicht** umbenannt (z. B. zu `.dialog`) — das hätte auch `pages/board.html` betroffen, war nicht Teil des Auftrags.
- `components/_index.scss`: `@forward "dialog";` ergänzt.

### Geblieben in `pages/_board.scss`

- `.board`, `.board-header` (+ alle `__players`/`__player`/`__current-player`/`__exit`-Elemente): echter Seiteninhalt, kommt nur auf `board.html` vor, kein Wiederverwendungspotenzial (kein globaler Site-Header wie in `layout/`).
- `.player-score--blue`/`--orange`: Domänen-Vokabular des Memory-Spiels (Spieler-Score einfärben), nicht als generisches UI-Atom einzustufen wie z. B. ein Button. Aktuell nur an einer Stelle verwendet — laut Projektregel keine Abstraktion für einen hypothetischen Zweitgebrauch bauen.

**Bewusst nicht weiter zerlegt:** Die Grid-Struktur von `.board-header` (Spalten/Padding/Breite) wurde nicht separat nach `layout/` ausgelagert, obwohl das strukturelle CSS ist. Begründung: `layout/` ist in diesem Projekt für seitenübergreifende Strukturelemente gedacht (siehe `layout/_body.scss`: globale Resets, `.grid`, `.wrapper`). `.board-header` kommt nur auf einer einzigen Seite vor — eine Aufteilung in "Struktur nach `layout/`, Farben nach `pages/`" hätte nur unnötige Indirektion für einen nie wiederverwendeten Block erzeugt.

### Nebeneffekt

`pages/_board.scss` brauchte nach dem Verschieben kein `@use "../base" as base;` mehr (der einzige `base.$primary-dark`-Zugriff war Teil des jetzt ausgelagerten Dialog-Textes) und `@use "../themes" as theme;` war schon vorher ungenutzt (Themes werden ausschließlich über CSS Custom Properties konsumiert, nicht per Sass-Modul-Zugriff). Beide Imports entfernt.

## 3. Verifikation

`npx vite build` nach jedem Schritt fehlerfrei durchgelaufen (Dead-Code-Entfernung und 7-1-Split separat geprüft). `dist/index.html` (getrackte Altlast) jeweils per `git checkout -- dist/index.html` zurückgesetzt.
