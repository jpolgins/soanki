import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Deck } from '../types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';

interface DeckItemProps {
  deck: Deck;
  onPress?: () => void;
}

const DeckItem = ({ deck, onPress }: DeckItemProps) => {
  return (
    <TouchableOpacity
      style={styles.deckContainer}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.deckHeader}>
        <Text style={styles.deckEmoji}>{EMOJIS.deck}</Text>
        <Text style={styles.deckTitle}>{deck.name}</Text>
      </View>
      
      <View style={styles.deckContent}>
        <Text style={styles.deckDescription} numberOfLines={2}>
          {deck.description}
        </Text>
        
        <View style={styles.deckFooter}>
          <View style={styles.statContainer}>
            <Text style={styles.statEmoji}>{EMOJIS.card}</Text>
            <Text style={styles.deckStat}>
              {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}
            </Text>
          </View>
          
          {deck.lastStudied && (
            <View style={styles.statContainer}>
              <Text style={styles.statEmoji}>{EMOJIS.study}</Text>
              <Text style={styles.deckStat}>
                {new Date(deck.lastStudied).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden'
  },
  deckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md
  },
  deckEmoji: {
    fontSize: FONT_SIZE.xl,
    marginRight: SPACING.sm
  },
  deckTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.card,
    flex: 1
  },
  deckContent: {
    padding: SPACING.md
  },
  deckDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    lineHeight: FONT_SIZE.md * 1.4
  },
  deckFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statEmoji: {
    fontSize: FONT_SIZE.md,
    marginRight: SPACING.xs
  },
  deckStat: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight
  }
});

export default DeckItem;
