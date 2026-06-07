import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/src/services/api";
import { useProducts } from "@/src/contexts/ProductsContext";
import { LoadingView } from "@/src/components/LoadingView";
import { ErrorView } from "@/src/components/ErrorView";
import { formatarData } from "@/src/utils/formatters";
import { theme } from "@/src/constants/theme";

type Movimentacao = {
  id: string;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  observacao: string | null;
  criadoEm: string;
};

export default function MovimentacoesProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { getProdutoById, carregarProdutos } = useProducts();
  const produto = getProdutoById(id);

  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const carregarMovimentacoes = useCallback(async () => {
    setError(null);
    try {
      const { data } = await api.get<Movimentacao[]>(`/produtos/${id}/movimentacoes`);
      setMovimentacoes(data);
    } catch (err: any) {
      setError(err.message ?? "Erro ao carregar movimentações.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarMovimentacoes();
  }, [carregarMovimentacoes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([carregarMovimentacoes(), carregarProdutos()]);
    setRefreshing(false);
  }, [carregarMovimentacoes, carregarProdutos]);

  if (loading && movimentacoes.length === 0) {
    return <LoadingView mensagem="Buscando histórico..." />;
  }

  if (error && movimentacoes.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarMovimentacoes} />;
  }

  const renderMovimentacao = ({ item }: { item: Movimentacao }) => {
    const isEntrada = item.tipo === "ENTRADA";
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: isEntrada ? "#E6FDF4" : "#FEE2E2" },
            ]}
          >
            <Ionicons
              name={isEntrada ? "arrow-down-outline" : "arrow-up-outline"}
              size={20}
              color={isEntrada ? theme.colors.secondary : theme.colors.error}
            />
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>
              {isEntrada ? "Entrada no Estoque" : "Saída do Estoque"}
            </Text>
            {item.observacao && (
              <Text style={styles.cardObs} numberOfLines={2}>
                {item.observacao}
              </Text>
            )}
            <Text style={styles.cardDate}>{formatarData(item.criadoEm)}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text
            style={[
              styles.cardQtd,
              { color: isEntrada ? theme.colors.secondary : theme.colors.error },
            ]}
          >
            {isEntrada ? "+" : "-"}
            {item.quantidade}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Histórico de Estoque</Text>
          <View style={{ width: 40 }} />
        </View>

        {produto && (
          <View style={styles.productSummary}>
            <View>
              <Text style={styles.productName}>{produto.nome}</Text>
              <Text style={styles.productStockLabel}>Estoque atual</Text>
            </View>
            <Text style={styles.productStockValue}>
              {produto.quantidade} {produto.unidade}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderMovimentacao}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="swap-horizontal-outline"
              size={48}
              color={theme.colors.textLight}
            />
            <Text style={styles.emptyText}>Nenhuma movimentação registrada</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/produtos/${id}/nova-movimentacao`)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Registrar Movimentação</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    height: 48,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  productSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    marginHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  productStockLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  productStockValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.xl,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  cardDetails: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardObs: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  cardQtd: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    height: 48,
    borderRadius: theme.borderRadius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
