import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchema, type ProdutoFormData } from "../schemas/produtoSchema";
import { useProducts } from "../contexts/ProductsContext";
import { useCategorias } from "../hooks/useCategorias";
import { Input } from "./Input";
import { Button } from "./Button";
import ImagePickerField from "./ImagePickerField";
import { theme } from "../constants/theme";

export default function FormularioProduto() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const modoEdicao = !!id;
  const router = useRouter();

  const { adicionarProduto, editarProduto, deletarProduto, getProdutoById } = useProducts();
  const { categorias } = useCategorias();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: "",
      categoriaId: "",
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      unidade: "un",
      observacao: "",
      foto: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (modoEdicao && id) {
      const produto = getProdutoById(id);
      if (produto) {
        reset({
          nome: produto.nome,
          categoriaId: produto.categoriaId,
          quantidade: produto.quantidade,
          quantidadeMinima: produto.quantidadeMinima,
          preco: produto.preco,
          unidade: produto.unidade as ProdutoFormData["unidade"],
          observacao: produto.observacao ?? "",
          foto: produto.foto ?? "",
        });
      }
    }
  }, [id, modoEdicao, getProdutoById]);

  const onSubmit = async (data: ProdutoFormData) => {
    try {
      if (modoEdicao && id) {
        await editarProduto(id, data);
      } else {
        await adicionarProduto(data);
      }
      router.back();
    } catch (error: any) {
      console.log("❌ [FormularioProduto Error]:", error);
      Alert.alert(
        "Não foi possível salvar",
        error.message ?? "Verifique sua conexão e tente novamente."
      );
    }
  };

  const handleDeletar = () => {
    Alert.alert(
      "Excluir produto",
      "Esta ação não pode ser desfeita. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (id) {
              try {
                await deletarProduto(id);
                router.back();
              } catch (error: any) {
                Alert.alert("Erro ao excluir", error.message);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Campo: Foto */}
      <Controller
        control={control}
        name="foto"
        render={({ field: { value, onChange } }) => (
          <ImagePickerField value={value ?? null} onChange={onChange} />
        )}
      />

      {/* Campo: Nome */}
      <Controller
        control={control}
        name="nome"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <Input
            label="Nome do produto *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
        )}
      />

      {/* Campo: Categoria */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Categoria *</Text>
        <Controller
          control={control}
          name="categoriaId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pickerChips}
              >
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.pickerChip,
                      value === cat.id && styles.pickerChipSelected,
                    ]}
                    onPress={() => onChange(cat.id)}
                  >
                    <Text
                      style={[
                        styles.pickerChipText,
                        value === cat.id && styles.pickerChipTextSelected,
                      ]}
                    >
                      {cat.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />
      </View>

      {/* Campo: Quantidade */}
      <Controller
        control={control}
        name="quantidade"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <Input
            label="Quantidade em estoque *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t))}
            onBlur={onBlur}
            error={error?.message}
            keyboardType="numeric"
            returnKeyType="next"
          />
        )}
      />

      {/* Campo: Quantidade Mínima */}
      <Controller
        control={control}
        name="quantidadeMinima"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <Input
            label="Quantidade mínima (alerta) *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t))}
            onBlur={onBlur}
            error={error?.message}
            keyboardType="numeric"
            returnKeyType="next"
          />
        )}
      />

      {/* Campo: Preço */}
      <Controller
        control={control}
        name="preco"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <Input
            label="Preço (R$) *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t.replace(",", ".")))}
            onBlur={onBlur}
            error={error?.message}
            keyboardType="decimal-pad"
            returnKeyType="next"
          />
        )}
      />

      {/* Campo: Unidade */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Unidade de Medida *</Text>
        <Controller
          control={control}
          name="unidade"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View>
              <View style={styles.unidadeContainer}>
                {["un", "kg", "cx", "L", "m"].map((un) => (
                  <TouchableOpacity
                    key={un}
                    style={[
                      styles.unidadeButton,
                      value === un && styles.unidadeButtonSelected,
                    ]}
                    onPress={() => onChange(un)}
                  >
                    <Text
                      style={[
                        styles.unidadeButtonText,
                        value === un && styles.unidadeButtonTextSelected,
                      ]}
                    >
                      {un}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />
      </View>

      {/* Campo: Observação */}
      <Controller
        control={control}
        name="observacao"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <Input
            label="Observação (opcional)"
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
            returnKeyType="done"
          />
        )}
      />

      {/* Botões */}
      <View style={styles.actions}>
        <Button
          title={modoEdicao ? "Salvar alterações" : "Cadastrar produto"}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
        />

        {modoEdicao && (
          <>
            <Button
              title="Movimentações de Estoque"
              onPress={() => router.push(`/(tabs)/produtos/${id}/movimentacoes` as any)}
              variant="outline"
              fullWidth
            />
            <Button
              title="Excluir produto"
              onPress={handleDeletar}
              variant="ghost"
              fullWidth
              style={styles.deleteButton}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: "500",
  },
  pickerChips: {
    gap: theme.spacing.xs,
    paddingVertical: 4,
  },
  pickerChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pickerChipText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  pickerChipTextSelected: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  unidadeContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  unidadeButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  unidadeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  unidadeButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  unidadeButtonTextSelected: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  errorText: {
    ...theme.typography.small,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  actions: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  deleteButton: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
});
