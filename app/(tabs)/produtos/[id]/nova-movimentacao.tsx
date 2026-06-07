import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/src/services/api";
import { useProducts } from "@/src/contexts/ProductsContext";
import { Input } from "@/src/components/Input";
import { Button } from "@/src/components/Button";
import { theme } from "@/src/constants/theme";

export default function NovaMovimentacao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { getProdutoById, carregarProdutos } = useProducts();
  const produto = getProdutoById(id);

  const [tipo, setTipo] = useState<"ENTRADA" | "SAIDA">("ENTRADA");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    const qtdNum = Number(quantidade);
    if (!quantidade || isNaN(qtdNum) || qtdNum <= 0 || !Number.isInteger(qtdNum)) {
      Alert.alert("Erro", "A quantidade deve ser um número inteiro maior que 0.");
      return;
    }

    if (tipo === "SAIDA" && produto && produto.quantidade < qtdNum) {
      Alert.alert(
        "Estoque insuficiente",
        `Quantidade disponível em estoque: ${produto.quantidade} ${produto.unidade}`
      );
      return;
    }

    setLoading(true);
    try {
      await api.post(`/produtos/${id}/movimentacao`, {
        tipo,
        quantidade: qtdNum,
        observacao: observacao.trim() || null,
      });

      // Recarrega os dados locais dos produtos para atualizar o estoque na UI
      await carregarProdutos();

      Alert.alert("Sucesso", "Movimentação registrada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Erro", err.message ?? "Não foi possível registrar a movimentação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registrar Movimentação</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {produto && (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{produto.nome}</Text>
              <Text style={styles.productStock}>
                Estoque atual: {produto.quantidade} {produto.unidade}
              </Text>
            </View>
          )}

          {/* Campo: Tipo de Movimentação */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tipo de Movimentação *</Text>
            <View style={styles.tipoContainer}>
              <TouchableOpacity
                style={[
                  styles.tipoButton,
                  tipo === "ENTRADA" && styles.tipoButtonEntradaSelected,
                ]}
                onPress={() => setTipo("ENTRADA")}
              >
                <Ionicons
                  name="arrow-down-outline"
                  size={18}
                  color={tipo === "ENTRADA" ? "#fff" : theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tipoButtonText,
                    tipo === "ENTRADA" && styles.tipoButtonTextSelected,
                  ]}
                >
                  Entrada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tipoButton,
                  tipo === "SAIDA" && styles.tipoButtonSaidaSelected,
                ]}
                onPress={() => setTipo("SAIDA")}
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={18}
                  color={tipo === "SAIDA" ? "#fff" : theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tipoButtonText,
                    tipo === "SAIDA" && styles.tipoButtonTextSelected,
                  ]}
                >
                  Saída
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo: Quantidade */}
          <Input
            label="Quantidade *"
            placeholder="Ex: 10"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />

          {/* Campo: Observação */}
          <Input
            label="Observação (opcional)"
            placeholder="Ex: Compra de lote novo ou Venda realizada"
            value={observacao}
            onChangeText={setObservacao}
            returnKeyType="done"
          />

          <View style={styles.actions}>
            <Button
              title="Registrar Movimentação"
              onPress={handleSalvar}
              loading={loading}
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scroll: {
    flex: 1,
  },
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  productCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  productStock: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  fieldGroup: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: "500",
  },
  tipoContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  tipoButton: {
    flex: 1,
    height: 44,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  tipoButtonEntradaSelected: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  tipoButtonSaidaSelected: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  tipoButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  tipoButtonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
});
