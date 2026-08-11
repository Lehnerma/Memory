# Memory

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
├─ pages/
│  ├─ board.html
│  ├─ settings.html
│  └─ endscreen.html
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
