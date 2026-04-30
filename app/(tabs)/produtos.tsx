import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { PRODUTOS_MOCK, CATEGORIAS_MOCK, getStatusEstoque, Produto } from '../../src/data/mockData';

export default function Produtos() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todos');

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((produto) => {
      const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = categoriaSelecionada === 'Todos' || produto.categoriaId === categoriaSelecionada;
      return matchBusca && matchCategoria;
    });
  }, [busca, categoriaSelecionada]);

  const renderProduto = ({ item }: { item: Produto }) => {
    const status = getStatusEstoque(item);
    
    let badgeColor = theme.colors.secondary;
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
          <Text style={styles.produtoEmoji}>📦</Text>
          <View style={styles.produtoDetails}>
            <Text style={styles.produtoName} numberOfLines={1}>{item.nome}</Text>
            <Text style={styles.produtoQty}>{item.estoque} {item.unidade}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={theme.colors.textLight} />
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
    </View>
  );

  const renderChips = () => {
    const chips = [{ id: 'Todos', nome: 'Todos' }, ...CATEGORIAS_MOCK];
    
    return (
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {chips.map((chip) => {
            const isSelected = categoriaSelecionada === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setCategoriaSelecionada(chip.id)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {chip.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={theme.colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto..."
            placeholderTextColor={theme.colors.textLight}
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {renderChips()}
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    marginBottom: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    height: '100%',
  },
  chipsContent: {
    paddingRight: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.xl,
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
