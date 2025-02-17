import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';

import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, Users, Tv, Map, Info, Leaf, Flower, Server } from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index"
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
            name="(aplicacion)"
            options={{
              drawerLabel: 'aplicacion',
              title: 'aplicacion',
              drawerIcon: ({ color }) => <Map size={28} color={color} />,
            }}
          />
          <Drawer.Screen
            name="(supabase)"
            options={{
              drawerLabel: 'database',
              title: 'database',
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
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
      </GestureHandlerRootView>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
