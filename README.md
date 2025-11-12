# Pico Aztec

A browser-based remake of the classic Apple II/C64 platformer game Aztec.

## Game Overview

Descend into an ancient Aztec temple, collect the sacred idol at the bottom, and climb back up to escape! Navigate through procedurally generated multi-screen levels, fight enemies, and collect items to aid your quest.

## Features

- **Procedurally Generated Temple**: Each playthrough offers a unique temple layout
- **Classic Platformer Action**: Jump, climb stairs, and explore multiple levels
- **Combat System**: Use guns (with limited ammo) and machetes to defeat enemies
- **Enemy Types**: Spiders, tigers, and Aztec warriors
- **Treasure Chests**: Find weapons and ammunition scattered throughout
- **Health System**: Survive hits with a health bar (difficulty adjustable)
- **Retro Pixel Art Style**: Authentic vintage gaming aesthetic

## Controls

- **Arrow Keys**: Move left/right, climb stairs up/down
- **Space**: Jump
- **Z**: Load/reload gun
- **X**: Shoot gun
- **C**: Use machete
- **E**: Open treasure chest

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- Phaser 3 - Game framework
- Vite - Build tool and dev server
- Vanilla JavaScript - Game logic

## Game Rules

- **Objective**: Collect the idol at the temple bottom and return to the top
- **One Life**: Make it count!
- **Health System**: Multiple hits before death (difficulty can be adjusted)
- **Inventory**:
  - 1× Gun
  - 1× Machete
  - Up to 10 bullets

## License

MIT
