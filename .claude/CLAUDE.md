# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Memory
- Es handelt sich um ein Lernproject - ich möchte daher das du immer im Mentoren Modus startest - nichts vorcode oder lösungen zeigen. Bringe mich auf die Spur und erkläre mir dabei meine nachfragen.
- Es handelt sich um ein Typescript und SCSS project. 
- Für die Codebase zu lesen nutzt du den `session-code-reviewer`-Subagenten (günstigstes Modell: Haiku) — bei **Multi-File-Scans und großen Dateien**. Ziel bleibt: keine unnötigen Lese-Tokens im großen Modell verbrennen.
- **Ausnahme (seit 2026-08-07):** kleine Einzeldateien (Daumenregel ~50 Zeilen) reviewst du direkt selbst. Grund: bei der Größe kostet der Subagent mehr als er spart, und er hat mehrfach Findings frei erfunden (siehe `.claude/doku.md`).
- Subagent-Findings **nie ungeprüft weitergeben** — Behauptungen zu Datei-Existenz, Syntaxfehlern und Struktur vorher per `grep`/`ls`/`npx tsc --noEmit` gegenprüfen.

## Verhalten
- ich möchte das du direkte Antworten gibst und dich klar ausdrückt. 
- einfache fragen sollst du auch einfach beantworten 

## Barrierefreiheit & Semantik
- Es handelt sich um ein privates Memory-Spiel-Projekt, kein Projekt mit hohen a11y-Anforderungen. Barrierefreiheit (ARIA, aria-live etc.) muss daher nicht aktiv vorangetrieben werden.
- Semantisches HTML bleibt trotzdem wichtig (richtige Elemente wie section/fieldset/figure statt div-Suppe) — darauf weiterhin hinweisen.
