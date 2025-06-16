import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  emoji?: string;
}

const Button = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  emoji
}: ButtonProps) => {
  
  const getButtonStyle = () => {
    let buttonStyle: any = [styles.button];
    
    // Type styles
    if (type === 'primary') {
      buttonStyle.push(styles.primaryButton);
    } else if (type === 'secondary') {
      buttonStyle.push(styles.secondaryButton);
    } else if (type === 'danger') {
      buttonStyle.push(styles.dangerButton);
    }
    
    // Size styles
    if (size === 'small') {
      buttonStyle.push(styles.smallButton);
    } else if (size === 'large') {
      buttonStyle.push(styles.largeButton);
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle.push(styles.disabledButton);
    }
    
    // Custom style
    if (style) {
      buttonStyle.push(style);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let buttonTextStyle: any = [styles.buttonText];
    
    // Type text styles
    if (type === 'primary') {
      buttonTextStyle.push(styles.primaryButtonText);
    } else if (type === 'secondary') {
      buttonTextStyle.push(styles.secondaryButtonText);
    } else if (type === 'danger') {
      buttonTextStyle.push(styles.dangerButtonText);
    }
    
    // Size text styles
    if (size === 'small') {
      buttonTextStyle.push(styles.smallButtonText);
    } else if (size === 'large') {
      buttonTextStyle.push(styles.largeButtonText);
    }
    
    // Disabled text style
    if (disabled || loading) {
      buttonTextStyle.push(styles.disabledButtonText);
    }
    
    // Custom text style
    if (textStyle) {
      buttonTextStyle.push(textStyle);
    }
    
    return buttonTextStyle;
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        {loading ? (
          <ActivityIndicator size="small" color={type === 'secondary' ? COLORS.primary : COLORS.card} />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: {
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.sm
  },
  primaryButton: {
    backgroundColor: COLORS.primary
  },
  secondaryButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  dangerButton: {
    backgroundColor: COLORS.error
  },
  smallButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm
  },
  largeButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg
  },
  disabledButton: {
    opacity: 0.6
  },
  buttonText: {
    fontWeight: '600',
    fontSize: FONT_SIZE.md,
    textAlign: 'center'
  },
  primaryButtonText: {
    color: COLORS.card
  },
  secondaryButtonText: {
    color: COLORS.primary
  },
  dangerButtonText: {
    color: COLORS.card
  },
  smallButtonText: {
    fontSize: FONT_SIZE.sm
  },
  largeButtonText: {
    fontSize: FONT_SIZE.lg
  },
  disabledButtonText: {
    opacity: 0.8
  }
});

export default Button;
