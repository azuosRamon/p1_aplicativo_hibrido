import { Tabs } from "expo-router";
import { CoresInstagram } from "@/constantes/sistema-design";
import { BarraNavegacaoInferior } from "@/componentes/barra-navegacao-inferior";

export default function LayoutAbas() {
  return (
    <Tabs
      tabBar={(props) => <BarraNavegacaoInferior {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: CoresInstagram.fundo,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Início" }} />
      <Tabs.Screen name="explorar" options={{ title: "Explorar" }} />
      <Tabs.Screen name="mensagens" options={{ title: "Mensagens" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  );
}