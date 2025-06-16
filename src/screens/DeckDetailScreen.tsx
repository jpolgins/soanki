import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { getDeckById, getCardsByDeckId, deleteDeck } from '../services/storage';
import { Deck, Card } from '../types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';
import Button from '../components/Button';
import Header from '../components/Header';
import CardItem from '../components/CardItem';

const DeckDetailScreen = () => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deckId } = route.params;
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadDeckAndCards = async () => {
      setLoading(true);
      const fetchedDeck = await getDeckById(deckId);
      const fetchedCards = await getCardsByDeckId(deckId);
      setDeck(fetchedDeck);
      setCards(fetchedCards);
      setLoading(false);
    };

    if (isFocused) {
      loadDeckAndCards();
    }
  }, [deckId, isFocused]);

  const handleStartStudy = () => {
    if (cards.length === 0) {
      Alert.alert(
        "No Cards",
        "You need to add cards to this deck before you can study.",
        [{ text: "OK" }]
      );
      return;
    }
    navigation.navigate('StudySession', { deckId });
  };

  const handleDeleteDeck = () => {
    Alert.alert(
      "Delete Deck",
      "Are you sure you want to delete this deck? This action cannot be undone and all cards in this deck will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDeck(deckId);
              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete deck:", error);
              Alert.alert("Error", "Failed to delete deck. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (loading || !deck) {
    return (
      <View style={styles.container}>
        <Header title="Deck Details" emoji={EMOJIS.deck} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading deck details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={deck.name} 
        emoji={EMOJIS.deck}
        rightComponent={
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteDeck}
          >
            <Text style={styles.deleteButtonText}>{EMOJIS.delete}</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.deckInfo}>
        <Text style={styles.deckDescription}>{deck.description}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>{EMOJIS.card}</Text>
            <Text style={styles.statText}>
              {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}
            </Text>
          </View>
          
          {deck.lastStudied && (
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>{EMOJIS.study}</Text>
              <Text style={styles.statText}>
                {new Date(deck.lastStudied).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button 
          title="Study Now"
          emoji={EMOJIS.study}
          onPress={handleStartStudy}
          type="primary"
          style={styles.actionButton}
        />
        
        <Button 
          title="Add Card"
          emoji={EMOJIS.create}
          onPress={() => navigation.navigate('CreateCard', { deckId })}
          type="secondary"
          style={styles.actionButton}
        />
      </View>

      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>Cards in this Deck</Text>
        
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>{EMOJIS.info}</Text>
            <Text style={styles.emptyStateText}>No cards in this deck yet.</Text>
            <Text style={styles.emptyStateSubtext}>Tap 'Add Card' to create your first card!</Text>
            <Button
              title="Add First Card"
              emoji={EMOJIS.create}
              onPress={() => navigation.navigate('CreateCard', { deckId })}
              size="small"
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          <ScrollView style={styles.cardsList} contentContainerStyle={styles.cardsListContent}>
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                showPreviewAnswer={true}
                onPress={() => navigation.navigate('CardDetail', { cardId: card.id, deckId })}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.error,
  },
  deckInfo: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  deckDescription: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
    color: COLORS.text,
    lineHeight: FONT_SIZE.md * 1.4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: FONT_SIZE.md,
    marginRight: SPACING.xs,
  },
  statText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  cardsSection: {
    flex: 1,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  cardsList: {
    flex: 1,
  },
  cardsListContent: {
    paddingBottom: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateEmoji: {
    fontSize: FONT_SIZE.xxl * 2,
    marginBottom: SPACING.lg,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyStateButton: {
    marginTop: SPACING.md,
  },
});

export default DeckDetailScreen;
