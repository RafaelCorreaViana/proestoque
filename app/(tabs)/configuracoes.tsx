import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { Button } from '../../src/components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function Configuracoes() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>
        
        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetra}>
              {user?.nome?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>
          <View>
            <Text style={styles.nome}>{user?.nome}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.menuItemText}>Notificações</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <Button
          title="Sair da conta"
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={styles.logoutButton}
        />
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
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  perfilCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: theme.spacing.md, 
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.md, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  avatar: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: theme.colors.primary, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  avatarLetra: { 
    color: theme.colors.white, 
    fontSize: 22, 
    fontWeight: "bold" 
  },
  nome: { 
    ...theme.typography.subtitle,
    color: theme.colors.text 
  },
  email: { 
    ...theme.typography.body,
    color: theme.colors.textSecondary 
  },
  menuContainer: {
    gap: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  menuItemText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
});
