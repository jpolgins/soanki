import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveDeck } from '../services/storage';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';
import Button from '../components/Button';
import Header from '../components/Header';

const CreateDeckScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<any>();

  const handleCreateDeck = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Deck name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await saveDeck({
        name: name.trim(),
        description: description.trim()
      });
      
      setIsSubmitting(false);
      navigation.goBack();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error creating deck:', error);
      Alert.alert('Error', 'Failed to create deck. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create New Deck" emoji={EMOJIS.deck} />
      
      <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelEmoji}>{EMOJIS.deck}</Text>
              <Text style={styles.label}>Deck Name</Text>
            </View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter deck name"
              autoCapitalize="sentences"
              maxLength={50}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelEmoji}>{EMOJIS.info}</Text>
              <Text style={styles.label}>Description</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter a description for your deck"
              multiline
              numberOfLines={4}
              maxLength={200}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <Button
            title="Create Deck"
            emoji={EMOJIS.create}
            onPress={handleCreateDeck}
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: SPACING.lg,
  },
});

export default CreateDeckScreen;
