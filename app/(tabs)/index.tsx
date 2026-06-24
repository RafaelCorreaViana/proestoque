import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, Image } from 'react-native';
import { theme } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useProducts, type Produto } from '../../src/contexts/ProductsContext';
import { getStatusEstoque, formatarPreco } from '../../src/utils/formatters';
import { LoadingView } from '../../src/components/LoadingView';
import { ErrorView } from '../../src/components/ErrorView';
import { Skeleton } from '../../src/components/Skeleton';
import { ProdutoListaSkeleton } from '../../src/components/ProdutoSkeleton';

export default function Home() {
  const { user } = useAuth();
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  // Cálculos de resumo baseados no contexto
  const totalProdutos = produtos.length;
  const produtosCriticos = useMemo(() => {
    return produtos.filter(p => getStatusEstoque(p.quantidade, p.quantidadeMinima) !== 'normal');
  }, [produtos]);

  const categoriasUnicas = useMemo(() => {
    return new Set(produtos.map(p => p.categoriaId)).size;
  }, [produtos]);

  const valorTotalEstoque = useMemo(() => {
    return produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  }, [produtos]);

  const dataDeHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = user?.nome?.split(' ')[0] ?? '';

  const cardsResumo = useMemo(() => [
    { id: '1', emoji: '📦', valor: totalProdutos.toString(), label: 'Produtos' },
    { id: '2', emoji: '⚠️', valor: produtosCriticos.length.toString(), label: 'Alertas', isError: produtosCriticos.length > 0 },
    { id: '3', emoji: '🗂️', valor: categoriasUnicas.toString(), label: 'Categorias' },
    { id: '4', emoji: '💰', valor: formatarPreco(valorTotalEstoque), label: 'Em Estoque' },
  ], [totalProdutos, produtosCriticos.length, categoriasUnicas, valorTotalEstoque]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{saudacao}, {primeiroNome} 👋</Text>
            <Text style={styles.date}>{dataDeHoje.charAt(0).toUpperCase() + dataDeHoje.slice(1)}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{primeiroNome.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {cardsResumo.map(card => (
          <View key={card.id} style={styles.card}>
            <Text style={styles.cardEmoji}>{card.emoji}</Text>
            {isLoading && produtos.length === 0 ? (
              <Skeleton width={60} height={28} borderRadius={4} style={{ marginVertical: 6 }} />
            ) : (
              <Text style={[styles.cardValue, card.isError && styles.errorText]} numberOfLines={1} adjustsFontSizeToFit>{card.valor}</Text>
            )}
            <Text style={styles.cardLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      {!isLoading && produtosCriticos.length > 0 && (
        <View style={styles.alertSection}>
          <Text style={styles.alertTitle}>⚠️ Estoque crítico ({produtosCriticos.length})</Text>
          <View style={styles.alertCard}>
            {produtosCriticos.slice(0, 3).map((produto, index) => (
              <View key={produto.id} style={[styles.alertItem, index > 0 && styles.alertDivider]}>
                <Text style={styles.alertItemName} numberOfLines={1}>{produto.nome}</Text>
                <Text style={styles.alertItemValue}>
                  {produto.quantidade}/{produto.quantidadeMinima}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    const status = getStatusEstoque(item.quantidade, item.quantidadeMinima);
    
    let badgeColor = theme.colors.secondary; // Normal
    let badgeText = 'Normal';
    
    if (status === 'baixo') {
      badgeColor = '#F59E0B';
      badgeText = 'Baixo';
    } else if (status === 'sem_estoque') {
      badgeColor = theme.colors.error;
      badgeText = 'Sem estoque';
    }

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoInfo}>
          {item.foto ? (
            <Image source={{ uri: item.foto }} style={styles.produtoImagem} />
          ) : (
            <Text style={styles.produtoEmoji}>📦</Text>
          )}
          <View style={styles.produtoDetails}>
            <Text style={styles.produtoName} numberOfLines={1}>{item.nome}</Text>
            <Text style={styles.produtoQty}>{item.quantidade} {item.unidade}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>
    );
  };

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={isLoading && produtos.length === 0 ? [] : produtos.slice(0, 5)} // Mostra apenas os 5 produtos mais recentes no dashboard
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={isLoading && produtos.length === 0 ? <ProdutoListaSkeleton count={3} /> : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  headerContainer: {
    marginBottom: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  greeting: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '47%',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: theme.spacing.sm,
  },
  cardValue: {
    ...theme.typography.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error,
  },
  cardLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  alertSection: {
    marginBottom: theme.spacing.xl,
  },
  alertTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  alertCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.errorLight,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  alertDivider: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  alertItemName: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  alertItemValue: {
    ...theme.typography.body,
    color: theme.colors.error,
    fontWeight: '600',
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  produtoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  produtoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  produtoEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  produtoImagem: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  produtoDetails: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  produtoName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  produtoQty: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    ...theme.typography.small,
    color: theme.colors.white,
    fontWeight: '600',
  },
});
