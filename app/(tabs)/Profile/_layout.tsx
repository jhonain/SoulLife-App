// (tabs)/Profile/_layout.tsx
// [MODIFICADO] - Agregada ruta admin para el panel de administración

import { Stack } from "expo-router";
import React from "react";
import { useAppTheme } from "../../../context/ThemeContext";

export default function ProfileLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Mi Perfil' }} />
      <Stack.Screen name="Admin" options={{ headerShown: false }} />
    </Stack>
  );
}
