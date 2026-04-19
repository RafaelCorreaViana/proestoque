import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { theme } from '../../src/constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    // Simulando login
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          
          <View style={styles.header}>
            <LogoProEstoque size="lg" />
            <Text style={styles.subtitle}>Bem-vindo de volta</Text>
          </View>

          <View style={styles.form}>
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

            <Link href="/(auth)/recuperar-senha" style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </Link>

            <Button 
              title="Entrar" 
              onPress={handleLogin} 
              fullWidth 
              style={styles.loginButton} 
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem conta? </Text>
              <Link href="/(auth)/cadastro" asChild>
                <Text style={styles.registerLink}>Cadastrar</Text>
              </Link>
            </View>
          </View>

        </View>
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
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: theme.spacing.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
