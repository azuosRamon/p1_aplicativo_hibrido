import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { CoresInstagram } from "@/constantes/sistema-design";
import { ProvedorPublicacoes } from "@/contextos/contexto-publicacoes";

export default function LayoutRaiz() {
  return (
    <ProvedorPublicacoes>
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
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="cadastro" options={{ headerShown: false }} />
          <Stack.Screen name="configuracoes" options={{ headerShown: false }} />
          <Stack.Screen name="salvos" options={{ headerShown: false }} />
          <Stack.Screen name="publicacoes-perfil" options={{ headerShown: false }} />
          <Stack.Screen
            name="comentarios"
            options={{
              headerShown: false,
              presentation: "transparentModal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="novo-post/index"
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="novo-post/legenda"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </Stack>
      </View>
    </ProvedorPublicacoes>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
  },
});
