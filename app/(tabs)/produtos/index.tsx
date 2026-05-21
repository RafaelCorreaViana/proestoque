import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, ScrollView, SectionList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../../src/constants/theme';
import { CATEGORIAS_MOCK, getStatusEstoque, type Produto } from '../../../src/data/mockData';
import { useProducts } from '../../../src/contexts/ProductsContext';

type ViewMode = 'lista' | 'grade' | 'secao';

export default function Produtos() {
  const { produtos } = useProducts();
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const router = useRouter();

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase().trim());
      const matchCategoria = categoriaSelecionada === 'Todos' || produto.categoriaId === categoriaSelecionada;
      return matchBusca && matchCategoria;
    });
  }, [produtos, busca, categoriaSelecionada]);

  const produtosAgrupados = useMemo(() => {
    const secoes = CATEGORIAS_MOCK.map(cat => ({
      id: cat.id,
      title: cat.nome,
      data: produtosFiltrados.filter(p => p.categoriaId === cat.id)
    })).filter(secao => secao.data.length > 0);
    return secoes;
  }, [produtosFiltrados]);

  const toggleViewMode = () => {
    if (viewMode === 'lista') setViewMode('grade');
    else if (viewMode === 'grade') setViewMode('secao');
    else setViewMode('lista');
  };

  const getIconForViewMode = () => {
    if (viewMode === 'lista') return 'list-outline';
    if (viewMode === 'grade') return 'grid-outline';
    return 'albums-outline';
  };

  const renderBadge = (status: string) => {
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
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>
    );
  };

  const renderProdutoLista = ({ item }: { item: Produto }) => {
    const status = getStatusEstoque(item);
    return (
      <TouchableOpacity 
        style={styles.produtoCard}
        onPress={() => router.push(`/produtos/${item.id}`)}
      >
        <View style={styles.produtoInfo}>
          <Text style={styles.produtoEmoji}>📦</Text>
          <View style={styles.produtoDetails}>
            <Text style={styles.produtoName} numberOfLines={1}>{item.nome}</Text>
            <Text style={styles.produtoQty}>{item.quantidade} {item.unidade}</Text>
          </View>
        </View>
        {renderBadge(status)}
      </TouchableOpacity>
    );
  };

  const renderProdutoGrade = ({ item }: { item: Produto }) => {
    const status = getStatusEstoque(item);
    return (
      <TouchableOpacity 
        style={styles.produtoCardGrade}
        onPress={() => router.push(`/produtos/${item.id}`)}
      >
        <Text style={styles.produtoEmojiGrade}>📦</Text>
        <Text style={styles.produtoNameGrade} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.produtoQty}>{item.quantidade} {item.unidade}</Text>
        <View style={styles.badgeContainerGrade}>
          {renderBadge(status)}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={theme.colors.textLight} />
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
      <TouchableOpacity onPress={() => router.push("/produtos/novo")} style={styles.emptyButton}>
        <Text style={styles.emptyButtonText}>Cadastrar produto</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string, data: Produto[] } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title} ({section.data.length})</Text>
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
        <View style={styles.titleRow}>
          <Text style={styles.title}>Produtos</Text>
          <TouchableOpacity onPress={toggleViewMode} style={styles.toggleButton}>
            <Ionicons name={getIconForViewMode()} size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
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

      {viewMode === 'secao' ? (
        <SectionList
          sections={produtosAgrupados}
          keyExtractor={(item) => item.id}
          renderItem={renderProdutoLista}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={true}
        />
      ) : (
        <FlatList
          key={viewMode}
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={viewMode === 'grade' ? renderProdutoGrade : renderProdutoLista}
          numColumns={viewMode === 'grade' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grade' ? styles.row : undefined}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* FAB — Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/produtos/novo")}>
        <Ionicons name="add" size={28} color={theme.colors.white} />
      </TouchableOpacity>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  toggleButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.sm,
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
    paddingBottom: 80,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
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
  produtoCardGrade: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'center',
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
  produtoEmojiGrade: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
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
  produtoNameGrade: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },
  produtoQty: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  badgeContainerGrade: {
    marginTop: theme.spacing.sm,
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
  emptyButton: {
    marginTop: theme.spacing.md,
  },
  emptyButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  sectionHeader: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  sectionHeaderText: {
    ...theme.typography.subtitle,
    color: theme.colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
