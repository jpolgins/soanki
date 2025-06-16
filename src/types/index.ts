// Define types for our anki cards and decks
export interface Card {
  id: string;
  question: string;
  answer: string;
  deckId: string;
  createdAt: number;
  lastReviewed?: number;
  reviewCount: number;
  difficultyLevel: number; // 1-5 where 1 is very easy and 5 is very hard
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  lastStudied?: number;
  cardCount: number;
}

// For navigation parameters
export type RootStackParamList = {
  Home: undefined;
  DeckList: undefined;
  DeckDetail: { deckId: string };
  CardDetail: { cardId: string; deckId: string };
  CreateDeck: undefined;
  CreateCard: { deckId?: string };
  StudySession: { deckId: string };
};
