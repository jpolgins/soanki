import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Deck } from '../types';

// Custom UUID generator compatible with React Native
// LOL
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Storage keys
const DECKS_STORAGE_KEY = 'soanki_decks';
const CARDS_STORAGE_KEY = 'soanki_cards';

// Deck operations
export const getDecks = async (): Promise<Deck[]> => {
  try {
    const decksJson = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
    return decksJson ? JSON.parse(decksJson) : [];
  } catch (error) {
    console.error('Error getting decks:', error);
    return [];
  }
};

export const getDeckById = async (id: string): Promise<Deck | null> => {
  try {
    const decks = await getDecks();
    return decks.find(deck => deck.id === id) || null;
  } catch (error) {
    console.error('Error getting deck by id:', error);
    return null;
  }
};

export const saveDeck = async (deck: Omit<Deck, 'id' | 'createdAt' | 'cardCount'>): Promise<Deck> => {
  try {
    const decks = await getDecks();
    const newDeck: Deck = {
      ...deck,
      id: generateUUID(),
      createdAt: Date.now(),
      cardCount: 0
    };
    
    await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify([...decks, newDeck]));
    return newDeck;
  } catch (error) {
    console.error('Error saving deck:', error);
    throw error;
  }
};

export const updateDeck = async (updatedDeck: Deck): Promise<void> => {
  try {
    const decks = await getDecks();
    
    const updatedDecks = decks.map(deck => 
      deck.id === updatedDeck.id ? updatedDeck : deck
    );
    
    await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(updatedDecks));
  } catch (error) {
    console.error('Error updating deck:', error);
    throw error;
  }
};

export const deleteDeck = async (deckId: string): Promise<void> => {
  try {
    // Delete the deck
    const decks = await getDecks();
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(updatedDecks));
    
    // Delete all cards in the deck
    const cards = await getCards();
    const updatedCards = cards.filter(card => card.deckId !== deckId);
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
};

// Card operations
export const getCards = async (): Promise<Card[]> => {
  try {
    const cardsJson = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
    return cardsJson ? JSON.parse(cardsJson) : [];
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
};

export const getCardsByDeckId = async (deckId: string): Promise<Card[]> => {
  try {
    const cards = await getCards();
    return cards.filter(card => card.deckId === deckId);
  } catch (error) {
    console.error('Error getting cards by deck id:', error);
    return [];
  }
};

export const getCardById = async (id: string): Promise<Card | null> => {
  try {
    const cards = await getCards();
    return cards.find(card => card.id === id) || null;
  } catch (error) {
    console.error('Error getting card by id:', error);
    return null;
  }
};

export const saveCard = async (card: Omit<Card, 'id' | 'createdAt' | 'reviewCount' | 'difficultyLevel'>): Promise<Card> => {
  try {
    const cards = await getCards();
    const newCard: Card = {
      ...card,
      id: generateUUID(),
      createdAt: Date.now(),
      reviewCount: 0,
      difficultyLevel: 3 // Default medium difficulty
    };
    
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify([...cards, newCard]));
    
    // Update the card count in the deck
    const deck = await getDeckById(card.deckId);
    
    if (deck) {
      const updatedDeck = {
        ...deck,
        cardCount: deck.cardCount + 1
      };
      await updateDeck(updatedDeck);
    } else {
      console.error('Deck not found for deckId:', card.deckId);
    }
    
    return newCard;
  } catch (error) {
    console.error('Error saving card:', error);
    throw error;
  }
};

export const updateCard = async (updatedCard: Card): Promise<void> => {
  try {
    const cards = await getCards();
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const deleteCard = async (cardId: string): Promise<void> => {
  try {
    const cards = await getCards();
    const cardToDelete = cards.find(card => card.id === cardId);
    
    if (cardToDelete) {
      const updatedCards = cards.filter(card => card.id !== cardId);
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
      
      // Update the card count in the deck
      const deck = await getDeckById(cardToDelete.deckId);
      if (deck && deck.cardCount > 0) {
        await updateDeck({
          ...deck,
          cardCount: deck.cardCount - 1
        });
      }
    }
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};
