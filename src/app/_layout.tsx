import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { CoresInstagram } from "@/constantes/sistema-design";

export default function LayoutRaiz() {
  return (
    <View style={estilos.conteiner}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: CoresInstagram.fundo },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(abas)" options={{ headerShown: false }} />
        <Stack.Screen name="configuracoes" options={{ headerShown: false }} />
        <Stack.Screen name="salvos" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
  },
});
