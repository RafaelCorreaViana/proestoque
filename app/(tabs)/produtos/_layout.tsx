import { Stack } from "expo-router";
import { theme } from "../../../src/constants/theme";

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Produtos" }} />
      <Stack.Screen name="novo" options={{ title: "Novo Produto" }} />
      <Stack.Screen name="[id]" options={{ title: "Editar Produto" }} />
    </Stack>
  );
}
