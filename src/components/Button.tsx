import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  icon?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    let buttonStyle = [styles.base];

    // Add size styles
    if (size === 'small') buttonStyle.push(styles.small);
    else if (size === 'large') buttonStyle.push(styles.large);
    else buttonStyle.push(styles.medium);

    // Add variant styles
    if (variant === 'secondary') buttonStyle.push(styles.secondary);
    else if (variant === 'outline') buttonStyle.push(styles.outline);
    else if (variant === 'ghost') buttonStyle.push(styles.ghost);
    else buttonStyle.push(styles.primary);

    // Add disabled style
    if (disabled || loading) buttonStyle.push(styles.disabled);

    // Add custom style
    if (style) buttonStyle.push(style);

    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleArray = [styles.text];

    // Add size text styles
    if (size === 'small') textStyleArray.push(styles.smallText);
    else if (size === 'large') textStyleArray.push(styles.largeText);
    else textStyleArray.push(styles.mediumText);

    // Add variant text styles
    if (variant === 'secondary') textStyleArray.push(styles.secondaryText);
    else if (variant === 'outline') textStyleArray.push(styles.outlineText);
    else if (variant === 'ghost') textStyleArray.push(styles.ghostText);
    else textStyleArray.push(styles.primaryText);

    // Add custom text style
    if (textStyle) textStyleArray.push(textStyle);

    return textStyleArray;
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#ffffff';
      case 'secondary':
        return '#ffffff';
      case 'outline':
        return '#22c55e';
      case 'ghost':
        return '#22c55e';
      default:
        return '#ffffff';
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  primary: {
    backgroundColor: '#22c55e',
  },
  secondary: {
    backgroundColor: '#64748b',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
    lineHeight: 16,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 20,
  },
  largeText: {
    fontSize: 18,
    lineHeight: 24,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#22c55e',
  },
  ghostText: {
    color: '#22c55e',
  },
});