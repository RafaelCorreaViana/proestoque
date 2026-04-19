import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/constants/theme';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleRecuperar = () => {
    // Simulando envio de e-mail
    setEnviado(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Button 
            title="Voltar" 
            variant="ghost" 
            onPress={() => router.back()} 
            style={styles.backButton}
          />
        </View>

        <View style={styles.container}>
          {!enviado ? (
            <>
              <View style={styles.titleContainer}>
                <Text style={styles.logoText}>ProEstoque</Text>
                <Text style={styles.title}>Recuperar senha</Text>
                <Text style={styles.description}>
                  Informe seu e-mail e enviaremos um link de recuperação
                </Text>
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
                
                <Button 
                  title="Enviar" 
                  onPress={handleRecuperar} 
                  fullWidth 
                  style={styles.submitButton} 
                />
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle-outline" size={80} color={theme.colors.secondary} />
              <Text style={styles.successTitle}>E-mail enviado!</Text>
              <Text style={styles.successDescription}>
                Verifique sua caixa de entrada
              </Text>
              <Button 
                title="Voltar ao Login" 
                variant="outline" 
                onPress={() => router.back()} 
                fullWidth 
                style={styles.backToLoginButton}
              />
            </View>
          )}
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
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    alignItems: 'flex-start',
  },
  backButton: {
    paddingHorizontal: 0,
  },
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoText: {
    ...theme.typography.subtitle,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  successTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  successDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  backToLoginButton: {
    marginTop: theme.spacing.xl,
  },
});
