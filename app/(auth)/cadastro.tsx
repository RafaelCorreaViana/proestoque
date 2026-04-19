import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/constants/theme';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [senhaError, setSenhaError] = useState<string | undefined>(undefined);

  const handleCadastro = () => {
    setSenhaError(undefined);
    
    if (senha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/login');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>
            <Text style={styles.logoText}>ProEstoque</Text>
            <Text style={styles.subtitle}>Criar conta</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nome completo"
              icon="person-outline"
              placeholder="João Silva"
              value={nome}
              onChangeText={setNome}
            />

            <Input
              label="E-mail"
              icon="mail-outline"
              placeholder="joao@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            
            <Input
              label="Senha"
              icon="lock-closed-outline"
              placeholder="••••••••"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <Input
              label="Confirmar senha"
              icon="lock-closed-outline"
              placeholder="••••••••"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              error={senhaError}
            />

            <Button 
              title="Criar Conta" 
              onPress={handleCadastro} 
              fullWidth 
              loading={loading}
              style={styles.registerButton} 
            />

            <View style={styles.loginContainer}>
              <Link href="/(auth)/login" asChild>
                <Text style={styles.loginLink}>Já tenho conta</Text>
              </Link>
            </View>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoText: {
    ...theme.typography.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
