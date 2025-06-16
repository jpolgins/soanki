import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCardById, updateCard, deleteCard } from '../services/storage';
import { Card } from '../types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';
import Button from '../components/Button';
import Header from '../components/Header';

const CardDetailScreen = () => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { cardId, deckId } = route.params;

  useEffect(() => {
    const loadCard = async () => {
      setLoading(true);
      const fetchedCard = await getCardById(cardId);
      setCard(fetchedCard);
      setLoading(false);
    };

    loadCard();
  }, [cardId]);

  const handleDeleteCard = () => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCard(cardId);
              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete card:", error);
              Alert.alert("Error", "Failed to delete card. Please try again.");
            }
          }
        }
      ]
    );
  };

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  if (loading || !card) {
    return (
      <View style={styles.container}>
        <Header title="Card Details" emoji={EMOJIS.card} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading card details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Card Details" 
        emoji={EMOJIS.card}
        rightComponent={
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteCard}
          >
            <Text style={styles.deleteButtonText}>{EMOJIS.delete}</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cardSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>{EMOJIS.question}</Text>
            <Text style={styles.sectionLabel}>Question</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{card.question}</Text>
          </View>
        </View>

        <Button 
          title={showAnswer ? "Hide Answer" : "Show Answer"}
          emoji={showAnswer ? EMOJIS.info : EMOJIS.answer}
          onPress={toggleShowAnswer}
          type="secondary"
          style={styles.toggleButton}
        />

        {showAnswer && (
          <View style={styles.cardSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>{EMOJIS.answer}</Text>
              <Text style={styles.sectionLabel}>Answer</Text>
            </View>
            <View style={[styles.contentBox, styles.answerBox]}>
              <Text style={styles.contentText}>{card.answer}</Text>
            </View>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>{EMOJIS.stats}</Text>
            <Text style={styles.sectionLabel}>Card Statistics</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>{EMOJIS.card}</Text>
              <Text style={styles.statValue}>{card.reviewCount}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>
                {card.difficultyLevel <= 2 ? EMOJIS.easy : 
                 card.difficultyLevel <= 4 ? EMOJIS.medium : EMOJIS.hard}
              </Text>
              <Text style={styles.statValue}>
                {card.difficultyLevel === 1 ? "Easy" : 
                 card.difficultyLevel === 2 ? "Medium-Easy" : 
                 card.difficultyLevel === 3 ? "Medium" : 
                 card.difficultyLevel === 4 ? "Medium-Hard" : "Hard"}
              </Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>{EMOJIS.study}</Text>
              <Text style={styles.statValue}>
                {card.lastReviewed ? new Date(card.lastReviewed).toLocaleDateString() : "Never"}
              </Text>
              <Text style={styles.statLabel}>Last Reviewed</Text>
            </View>
          </View>
        </View>

        <Button 
          title="Edit Card"
          emoji={EMOJIS.edit}
          onPress={() => {
            // Here you would navigate to an edit card screen
            // This functionality can be added in a future enhancement
            Alert.alert("Coming Soon", "Card editing will be available in a future update.");
          }}
          style={styles.editButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
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
  cardSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionEmoji: {
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.xs,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  contentBox: {
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  answerBox: {
    backgroundColor: COLORS.cardAlt,
  },
  contentText: {
    fontSize: FONT_SIZE.md,
    lineHeight: FONT_SIZE.md * 1.5,
    color: COLORS.text,
  },
  toggleButton: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  statsContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    padding: SPACING.sm,
  },
  statEmoji: {
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    color: COLORS.text,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  editButton: {
    margin: SPACING.md,
  },
});

export default CardDetailScreen;
