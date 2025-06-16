import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveCard } from '../services/storage';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';
import Button from '../components/Button';
import Header from '../components/Header';

const CreateCardScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deckId } = route.params;

  const handleCreateCard = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Question is required');
      return;
    }

    if (!answer.trim()) {
      Alert.alert('Error', 'Answer is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const newCard = await saveCard({
        question: question.trim(),
        answer: answer.trim(),
        deckId
      });
      
      setIsSubmitting(false);
      navigation.goBack();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error creating card:', error);
      Alert.alert('Error', 'Failed to create card. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create New Card" emoji={EMOJIS.card} />
      
      <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelEmoji}>{EMOJIS.question}</Text>
              <Text style={styles.label}>Question</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={question}
              onChangeText={setQuestion}
              placeholder="Enter your question"
              multiline
              numberOfLines={4}
              maxLength={500}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelEmoji}>{EMOJIS.answer}</Text>
              <Text style={styles.label}>Answer</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Enter the answer"
              multiline
              numberOfLines={6}
              maxLength={1000}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <Button
            title="Create Card"
            emoji={EMOJIS.create}
            onPress={handleCreateCard}
            disabled={isSubmitting}
            loading={isSubmitting}
            style={styles.button}
          />
        </View>
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
  formContainer: {
    padding: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  labelEmoji: {
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    ...SHADOWS.small
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: SPACING.lg,
  },
});

export default CreateCardScreen;
