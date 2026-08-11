# Memory

## 🎮 Game Modes & Options

    Themes: Choose from 4 different visual themes to customize your gaming experience.
    Board Sizes: Play on 3 different board sizes depending on the desired difficulty:
        16 cards (Easy)
        24 cards (Medium)
        32 cards (Hard)
    Multiplayer: Designed for 2 players taking turns.

## 🕹️ Rules

    The selected player starts the game.
    If a player reveals a matching pair, they score a point, keep their turn, and can continue revealing cards.
    If a player reveals a non-matching pair, their turn ends, and play passes to the other player.
    The game continues until all cards have been successfully matched and turned over.

## 🏆 End Screen

    Once the final pair is revealed, you will be taken to the end screen, which features:
    A complete score summary for both players.
    The final result declaring the winner (or a draw).

## About

A small **learning project** for a memory card game built with **TypeScript** and **SCSS**.  
The main goal is to practice frontend structure, game logic, and styling in a clean setup.

This is a **pure learning project**.  
It is also the first project where I collaborated with **Claude**.

## Tech Stack

- TypeScript
- SCSS
- Vite

## Project Structure

```text
Memory/
├─ index.html
│
├─ board.html
├─ settings.html
├─ endscreen.html
├─ public/
│  └─ assets/
├─ src/
│  ├─ main.ts
│  ├─ assets/
│  ├─ scripts/
│  ├─ styles/
│  └─ vite-env.d.ts
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

## Usage

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Game Flow

1. Choose options in `settings.html`
2. Play the game in `board.html` and match pairs
3. View the final result in `endscreen.html`
