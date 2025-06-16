import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getDecks } from '../services/storage';
import { Deck } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import DeckItem from '../components/DeckItem';
import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';

const DeckListScreen = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadDecks = async () => {
      setLoading(true);
      const fetchedDecks = await getDecks();
      setDecks(fetchedDecks);
      setLoading(false);
    };

    if (isFocused) {
      loadDecks();
    }
  }, [isFocused]);

  const renderDeckItem = ({ item }: { item: Deck }) => (
    <DeckItem 
      deck={item}
      onPress={() => navigation.navigate('DeckDetail', { deckId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Header 
        title="" 
        showBackButton={false} 
        emoji={EMOJIS.deck}
        rightComponent={
          <Button
            title="New"
            emoji={EMOJIS.create}
            onPress={() => navigation.navigate('CreateDeck')}
            size="small"
            type="secondary"
          />
        }
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading decks...</Text>
        </View>
      ) : decks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>{EMOJIS.info}</Text>
          <Text style={styles.emptyStateText}>You haven't created any decks yet.</Text>
          <Text style={styles.emptyStateSubtext}>Tap 'New Deck' to get started!</Text>
          <Button
            title="Create First Deck"
            emoji={EMOJIS.create}
            onPress={() => navigation.navigate('CreateDeck')}
            style={styles.emptyStateButton}
          />
        </View>
      ) : (
        <FlatList
          data={decks}
          renderItem={renderDeckItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  listContent: {
    padding: SPACING.md,
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
  }
});

export default DeckListScreen;
