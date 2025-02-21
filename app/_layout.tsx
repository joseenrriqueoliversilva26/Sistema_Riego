import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, Info, Leaf, Flower, Server } from 'lucide-react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { View } from 'react-native';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const GreenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    background: '#E8F5E9',
    card: '#A5D6A7',
    text: '#1B5E20',
    border: '#81C784',
    notification: '#66BB6A',
  },
};

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (session) {
        router.replace('/(index)');
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.replace('/(index)');
      }
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || isLoading) {
    return <View />;
  }

  if (!session) {
    return (
      <ThemeProvider value={GreenTheme}>
        <Stack>
          <Stack.Screen
            name="(auth)/login"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={GreenTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="(index)"
            options={{
              drawerLabel: 'Inicio',
              title: 'SISTEMA DE RIEGO INTELIGENTE PARA JARDINES',
              drawerIcon: ({ color }) => <Home size={28} color={color} />,
            }}
          />
          <Drawer.Screen
            name="(plants)"
            options={{
              drawerLabel: 'Plantas',
              title: 'Plantas',
              drawerIcon: ({ color }) => <Leaf size={28} color={color} />,
            }}
          />
          <Drawer.Screen
            name="(trefle)"
            options={{
              drawerLabel: 'Plantas',
              title: 'Plantas',
              drawerIcon: ({ color }) => <Flower size={28} color={color} />,
            }}
          />
          <Drawer.Screen
            name="(supabase)"
            options={{
              drawerLabel: 'Database',
              title: 'Database',
              drawerIcon: ({ color }) => <Server size={28} color={color} />,
            }}
          />
          <Drawer.Screen
            name="(acerca)"
            options={{
              drawerLabel: 'Acerca de',
              title: 'Acerca de',
              drawerIcon: ({ color }) => <Info size={28} color={color} />,
            }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Drawer.Screen
            name="index"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Drawer.Screen
            name="(auth)/login"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
        </Drawer>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
