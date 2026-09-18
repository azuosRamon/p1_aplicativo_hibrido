import { CoresInstagram } from "@/constantes/sistema-design";
import { Tabs } from "expo-router";

export default function LayoutAbas() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    display: "flex"
                },
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