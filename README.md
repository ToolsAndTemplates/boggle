# Boggle - Word Grid Game

An attractive and modern Boggle clone built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Interactive Game Board**: 4x4 grid of letter tiles with smooth animations
- **Timer**: 3-minute countdown with visual progress indicator
- **Word Validation**: Real-time word checking against a built-in dictionary
- **Score Tracking**: Points based on word length (longer words = more points)
- **Beautiful UI**: Modern gradient design with animations and hover effects
- **Responsive Controls**: Click, drag, or use keyboard shortcuts
- **Custom Favicon**: Branded icon for browser tabs

## How to Play

1. Click and drag across adjacent letters to form words
2. Release the mouse to submit your word
3. Words must be at least 3 letters long
4. Find as many valid words as possible before time runs out!

## Keyboard Shortcuts

- **Enter**: Submit the current word
- **Escape**: Clear the current selection

## Scoring

- 3-4 letters: 1 point
- 5 letters: 2 points
- 6 letters: 3 points
- 7 letters: 5 points
- 8+ letters: 11 points

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play!

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first styling
- **React Hooks**: State management and side effects

## Game Logic

The game includes:
- Letter distribution similar to official Boggle dice
- Path validation ensuring letters are adjacent
- Word validation with minimum length requirements
- Prevention of duplicate words
- Score calculation based on word length

## Development

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

Lint code:

```bash
npm run lint
```

## Future Enhancements

Potential improvements:
- Larger dictionary using an external API
- Difficulty levels (larger/smaller boards, longer/shorter timers)
- Multiplayer mode
- High score leaderboard
- Sound effects and music
- Mobile touch support optimization
- Word definitions on hover

Enjoy playing Boggle!
