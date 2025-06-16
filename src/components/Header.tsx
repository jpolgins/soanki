import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS, EMOJIS } from '../styles/theme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  emoji?: string;
}

const Header = ({ title, showBackButton = true, rightComponent, emoji }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>{EMOJIS.back} Back</Text>
            </TouchableOpacity>
          ) : <View style={styles.emptySpace} />}
        </View>
        
        <View style={styles.titleContainer}>
          {emoji && <Text style={styles.headerEmoji}>{emoji}</Text>}
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent || <View style={styles.emptySpace} />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: 60,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 70,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  headerEmoji: {
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.sm,
  },
  backButton: {
    padding: SPACING.sm,
  },
  backButtonText: {
    color: COLORS.card,
    fontWeight: 'bold',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.card,
    flexShrink: 1,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
  },
  emptySpace: {
    width: 40,
    height: 24,
  }
});

export default Header;
