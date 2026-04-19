import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface LogoProEstoqueProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 24;
      case 'lg': return 64;
      case 'md':
      default: return 48;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 36;
      case 'md':
      default: return 28;
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons 
        name="cube-outline" 
        size={getIconSize()} 
        color={theme.colors.primary} 
      />
      <Text 
        style={[
          styles.text, 
          { fontSize: getTextSize() }
        ]}
      >
        ProEstoque
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: theme.spacing.xs,
  },
});
