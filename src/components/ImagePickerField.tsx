import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

interface ImagePickerProps {
  value: string | null;
  onChange: (uri: string | null) => void;
}

export default function ImagePickerField({ value, onChange }: ImagePickerProps) {
  const [loading, setLoading] = useState(false);

  const solicitarPermissao = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Permita o acesso à galeria nas configurações.");
      return false;
    }
    return true;
  };

  const abrirGaleria = async () => {
    if (!(await solicitarPermissao())) return;
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    setLoading(false);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const abrirCamera = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== "granted") {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera nas configurações.");
      return;
    }
    setLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    setLoading(false);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const opcoes = () => Alert.alert("Adicionar foto", "", [
    { text: "Câmera", onPress: abrirCamera },
    { text: "Galeria", onPress: abrirGaleria },
    value ? { text: "Remover foto", style: "destructive", onPress: () => onChange(null) } : null,
    { text: "Cancelar", style: "cancel" },
  ].filter(Boolean) as any);

  return (
    <TouchableOpacity style={styles.container} onPress={opcoes} disabled={loading}>
      {value ? (
        <Image source={{ uri: value }} style={styles.imagem} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera-outline" size={32} color={theme.colors.textLight} />
          <Text style={styles.placeholderText}>Adicionar foto</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    alignSelf: "center",
    marginBottom: theme.spacing.sm,
  },
  imagem: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: theme.colors.background,
  },
  placeholderText: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
});
