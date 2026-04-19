import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../../src/constants/theme';

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, João 👋</Text>
          <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total em produtos</Text>
            <Text style={styles.cardValue}>247</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Categorias</Text>
            <Text style={styles.cardValue}>12</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Alertas</Text>
            <Text style={[styles.cardValue, styles.errorText]}>5</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>← preenchido na próxima aula →</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  cardsContainer: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  cardValue: {
    ...theme.typography.title,
    color: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.error,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
});
