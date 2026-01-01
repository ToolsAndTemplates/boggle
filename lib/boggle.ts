// Boggle game logic

// Letter distribution similar to actual Boggle dice
const LETTER_DISTRIBUTION = [
  'AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
  'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
  'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
  'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ'
];

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  letter: string;
  position: Position;
}

export function generateBoard(size: number = 4): string[][] {
  const board: string[][] = [];
  const shuffledDice = [...LETTER_DISTRIBUTION].sort(() => Math.random() - 0.5);

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      const dieIndex = i * size + j;
      const die = shuffledDice[dieIndex % shuffledDice.length];
      const letter = die[Math.floor(Math.random() * die.length)];
      board[i][j] = letter === 'Q' ? 'Qu' : letter;
    }
  }

  return board;
}

export function isAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff) > 0;
}

export function validatePath(path: Position[]): boolean {
  if (path.length < 2) return true;

  // Check if all positions are unique
  const uniquePositions = new Set(path.map(p => `${p.row},${p.col}`));
  if (uniquePositions.size !== path.length) return false;

  // Check if all consecutive positions are adjacent
  for (let i = 1; i < path.length; i++) {
    if (!isAdjacent(path[i - 1], path[i])) {
      return false;
    }
  }

  return true;
}

export function pathToWord(path: Position[], board: string[][]): string {
  return path.map(pos => board[pos.row][pos.col]).join('').toLowerCase();
}

// Basic English dictionary check (in a real app, you'd use a proper dictionary API)
export function isValidWord(word: string): boolean {
  // Minimum word length is 3
  if (word.length < 3) return false;

  // Basic word list for demo - in production, use a proper dictionary
  const validWords = new Set([
    // 3-letter words
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
    'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy',
    'did', 'let', 'put', 'say', 'she', 'too', 'use', 'cat', 'dog', 'run',
    'big', 'hot', 'red', 'top', 'sun', 'car', 'eat', 'fun', 'yes', 'sit',
    'cut', 'far', 'hat', 'pen', 'sea', 'win', 'bad', 'bed', 'fly', 'leg',
    'cup', 'hit', 'wet', 'dry', 'sad', 'lot', 'boy', 'joy', 'toy', 'key',
    'lie', 'tie', 'die', 'pie', 'cry', 'try', 'sky', 'why', 'buy', 'guy',
    'age', 'ice', 'egg', 'oil', 'air', 'war', 'tax', 'fix', 'box', 'fox',

    // 4-letter words
    'that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'been',
    'have', 'were', 'said', 'each', 'them', 'time', 'make', 'like', 'than',
    'look', 'some', 'come', 'word', 'long', 'very', 'when', 'call', 'just',
    'name', 'good', 'made', 'find', 'work', 'back', 'take', 'want', 'give',
    'most', 'home', 'hand', 'part', 'turn', 'over', 'read', 'high', 'year',
    'went', 'boys', 'game', 'tree', 'play', 'rain', 'bird', 'fish', 'girl',
    'book', 'food', 'hope', 'help', 'love', 'mind', 'life', 'keep', 'city',
    'best', 'last', 'next', 'fast', 'slow', 'cold', 'warm', 'cool', 'dark',
    'fire', 'star', 'moon', 'king', 'song', 'stay', 'stop', 'shop', 'ship',
    'tell', 'talk', 'walk', 'wish', 'wait', 'feel', 'hear', 'show', 'grow',

    // 5-letter words
    'about', 'after', 'again', 'could', 'every', 'first', 'found', 'great',
    'house', 'large', 'learn', 'never', 'other', 'place', 'plant', 'point',
    'right', 'small', 'sound', 'spell', 'still', 'study', 'their', 'there',
    'these', 'thing', 'think', 'three', 'water', 'where', 'which', 'world',
    'would', 'write', 'years', 'brain', 'green', 'horse', 'light', 'night',
    'proud', 'quick', 'quiet', 'share', 'sleep', 'smart', 'smile', 'table',
    'under', 'white', 'woman', 'young', 'happy', 'money', 'music', 'party',

    // 6+ letter words
    'should', 'people', 'before', 'mother', 'father', 'answer', 'change',
    'differ', 'follow', 'letter', 'little', 'number', 'school', 'second',
    'sentence', 'another', 'between', 'country', 'different', 'important',
    'thought', 'through', 'together', 'beautiful', 'something', 'question'
  ]);

  return validWords.has(word.toLowerCase());
}

export function calculateScore(word: string): number {
  const length = word.length;
  if (length < 3) return 0;
  if (length === 3) return 1;
  if (length === 4) return 1;
  if (length === 5) return 2;
  if (length === 6) return 3;
  if (length === 7) return 5;
  return 11; // 8+ letters
}
