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
