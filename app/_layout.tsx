import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';
import { SplashScreen } from '../src/components/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const estaNoGrupoAuth = segments[0] === '(auth)';

    if (!isAuthenticated && !estaNoGrupoAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && estaNoGrupoAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <NavigationGuard />
        </ProductsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
