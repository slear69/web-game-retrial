# web-game-retrial
# Time Arcive

A browser-based action game built with plain HTML, CSS, and JavaScript. The player moves through timed levels, collects money, buys upgrades, and uses a clone mechanic to solve puzzles and survive enemy encounters.

## Overview

In this game, you play as a lone runner in a looping test arena. Each level has a timer, walls, doors, buttons, and enemies. Your goal is to reach the exit while staying alive and collecting enough money to buy useful upgrades before the next level.

The project uses a canvas-based scene and a newspaper-inspired UI aesthetic for a retro, paper-and-ink presentation.

## Features

- 5 levels with escalating layout challenges
- Timed rounds with life tracking
- Movement and collision with walls and doors
- Clone mechanic for repeated attempts and strategic movement
- Enemy chasing behavior and combat interactions
- Shop system with power-up purchases
- Optional shooting with a gun item
- Speed, armor, and challenge upgrades

## How to Play

### Controls

- Move: WASD or Arrow Keys
- Clone / save current run: E
- Clear active clones: Q
- Shoot when gun is purchased: F

### Goal

- Reach the exit square to advance to the next level.
- Avoid enemies or use the environment to survive.
- Spend money in the shop to improve your run.
- Manage lives and time carefully.

## Run the Game

Because this is a static web project, you can run it in either of these ways:

### Option 1: Open directly

- Open `index.html` in a browser.

### Option 2: Run a local web server

From the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project Files

- `index.html` — page structure and HUD
- `style.css` — game styling and newspaper theme
- `game.js` — gameplay logic, levels, AI, shop, controls, and rendering

## Notes

This is a lightweight, single-page game with no build step or external dependencies required beyond a browser.
