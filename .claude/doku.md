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
