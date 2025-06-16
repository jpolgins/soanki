import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCardsByDeckId, getDeckById, updateDeck, updateCard } from '../services/storage';
import { Card, Deck } from '../types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';
import Button from '../components/Button';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const StudySessionScreen = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deckId } = route.params;

  useEffect(() => {
    const loadCardsAndDeck = async () => {
      setLoading(true);
      try {
        const fetchedCards = await getCardsByDeckId(deckId);
        const shuffledCards = [...fetchedCards].sort(() => Math.random() - 0.5);
        const fetchedDeck = await getDeckById(deckId);
        
        setCards(shuffledCards);
        setCurrentDeck(fetchedDeck);
      } catch (error) {
        console.error('Error loading study session:', error);
        Alert.alert('Error', 'Failed to load study session.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadCardsAndDeck();
  }, [deckId]);

  const flipCard = () => {
    setShowAnswer(!showAnswer);
    Animated.spring(flipAnimation, {
      toValue: showAnswer ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleRateCard = async (difficulty: number) => {
    // Update the card's difficulty and review count
    if (currentIndex < cards.length) {
      const currentCard = cards[currentIndex];
      try {
        await updateCard({
          ...currentCard,
          difficultyLevel: difficulty,
          reviewCount: currentCard.reviewCount + 1,
          lastReviewed: Date.now()
        });
      } catch (error) {
        console.error('Error updating card:', error);
      }
    }

    // Move to the next card or finish the session
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      flipAnimation.setValue(0);
    } else {
      setIsFinished(true);
      // Update the deck's last studied timestamp
      if (currentDeck) {
        try {
          await updateDeck({
            ...currentDeck,
            lastStudied: Date.now()
          });
        } catch (error) {
          console.error('Error updating deck:', error);
        }
      }
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Study Session" emoji={EMOJIS.study} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading study session...</Text>
        </View>
      </View>
    );
  }

  if (isFinished) {
    return (
      <View style={styles.container}>
        <Header title="Study Complete" emoji={EMOJIS.success} />
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedEmoji}>{EMOJIS.success}</Text>
          <Text style={styles.finishedTitle}>Study Session Complete!</Text>
          <Text style={styles.finishedMessage}>
            You've reviewed all {cards.length} cards in this deck.
          </Text>
          <Button
            title="Return to Deck"
            emoji={EMOJIS.back}
            onPress={() => navigation.goBack()}
            style={styles.finishedButton}
          />
        </View>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Study Session" emoji={EMOJIS.study} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{EMOJIS.info}</Text>
          <Text style={styles.emptyTitle}>No Cards Available</Text>
          <Text style={styles.emptyMessage}>
            This deck doesn't have any cards to study.
          </Text>
          <Button
            title="Return to Deck"
            emoji={EMOJIS.back}
            onPress={() => navigation.goBack()}
            type="secondary"
            style={styles.emptyButton}
          />
        </View>
      </View>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <View style={styles.container}>
      <Header 
        title={currentDeck?.name || 'Study Session'} 
        emoji={EMOJIS.study}
      />
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Card {currentIndex + 1} of {cards.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentIndex + 1) / cards.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
          <Animated.View style={[styles.card, frontAnimatedStyle, { display: showAnswer ? 'none' : 'flex' }]}>
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardEmoji}>{EMOJIS.question}</Text>
              <Text style={styles.cardLabel}>Question</Text>
            </View>
            <Text style={styles.cardContent}>{currentCard.question}</Text>
            <Text style={styles.flipPrompt}>Tap to see answer</Text>
          </Animated.View>

          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { display: showAnswer ? 'flex' : 'none' }]}>
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardEmoji}>{EMOJIS.answer}</Text>
              <Text style={styles.cardLabel}>Answer</Text>
            </View>
            <Text style={styles.cardContent}>{currentCard.answer}</Text>
            <Text style={styles.flipPrompt}>Tap to see question</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {showAnswer && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>How well did you know this?</Text>
          <View style={styles.ratingButtons}>
            <TouchableOpacity 
              style={[styles.ratingButton, styles.hardButton]} 
              onPress={() => handleRateCard(5)}
            >
              <Text style={styles.ratingEmoji}>{EMOJIS.hard}</Text>
              <Text style={styles.ratingButtonText}>Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.ratingButton, styles.mediumButton]} 
              onPress={() => handleRateCard(3)}
            >
              <Text style={styles.ratingEmoji}>{EMOJIS.medium}</Text>
              <Text style={styles.ratingButtonText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.ratingButton, styles.easyButton]} 
              onPress={() => handleRateCard(1)}
            >
              <Text style={styles.ratingEmoji}>{EMOJIS.easy}</Text>
              <Text style={styles.ratingButtonText}>Easy</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  progressContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressText: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    color: COLORS.textLight,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.cardAlt,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  card: {
    width: width - 40,
    height: 400,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardBack: {
    backgroundColor: COLORS.cardAlt,
  },
  cardLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  cardEmoji: {
    fontSize: FONT_SIZE.xl,
    marginRight: SPACING.sm,
  },
  cardLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardContent: {
    fontSize: FONT_SIZE.xl,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.text,
    lineHeight: FONT_SIZE.xl * 1.4,
  },
  flipPrompt: {
    position: 'absolute',
    bottom: SPACING.xl,
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
  },
  ratingContainer: {
    marginTop: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.text,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
  },
  ratingEmoji: {
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.xs,
  },
  hardButton: {
    backgroundColor: COLORS.error,
  },
  mediumButton: {
    backgroundColor: COLORS.warning,
  },
  easyButton: {
    backgroundColor: COLORS.success,
  },
  ratingButtonText: {
    color: COLORS.card,
    fontWeight: 'bold',
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  finishedEmoji: {
    fontSize: FONT_SIZE.xxl * 2,
    marginBottom: SPACING.lg,
  },
  finishedTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.text,
  },
  finishedMessage: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.textLight,
    lineHeight: FONT_SIZE.md * 1.4,
  },
  finishedButton: {
    marginTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: FONT_SIZE.xxl * 2,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.text,
  },
  emptyMessage: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.textLight,
    lineHeight: FONT_SIZE.md * 1.4,
  },
  emptyButton: {
    marginTop: SPACING.md,
  },
});

export default StudySessionScreen;
