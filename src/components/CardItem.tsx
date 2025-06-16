import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';

interface CardItemProps {
  card: Card;
  onPress?: () => void;
  showPreviewAnswer?: boolean;
}

const CardItem = ({ card, onPress, showPreviewAnswer = false }: CardItemProps) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{EMOJIS.card}</Text>
        <Text style={styles.cardLabel}>Card</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.questionText} numberOfLines={2}>
          <Text style={styles.questionPrefix}>{EMOJIS.question} </Text>
          {card.question}
        </Text>
        
        {showPreviewAnswer && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerPreview} numberOfLines={1}>
              <Text style={styles.answerPrefix}>{EMOJIS.answer} </Text>
              {card.answer}
            </Text>
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.statContainer}>
            <Text style={styles.statEmoji}>{EMOJIS.stats}</Text>
            <Text style={styles.cardStat}>
              {card.reviewCount} {card.reviewCount === 1 ? 'review' : 'reviews'}
            </Text>
          </View>
          
          {card.lastReviewed && (
            <View style={styles.statContainer}>
              <Text style={styles.statEmoji}>{EMOJIS.study}</Text>
              <Text style={styles.cardStat}>
                {new Date(card.lastReviewed).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md
  },
  cardEmoji: {
    fontSize: FONT_SIZE.xl,
    marginRight: SPACING.sm
  },
  cardLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.card
  },
  cardContent: {
    padding: SPACING.md
  },
  questionText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: FONT_SIZE.md * 1.4
  },
  questionPrefix: {
    fontSize: FONT_SIZE.md,
    marginRight: SPACING.xs
  },
  answerContainer: {
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md
  },
  answerPreview: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontStyle: 'italic'
  },
  answerPrefix: {
    fontSize: FONT_SIZE.md,
    marginRight: SPACING.xs
  },
  cardFooter: {
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
  cardStat: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight
  }
});

export default CardItem;
