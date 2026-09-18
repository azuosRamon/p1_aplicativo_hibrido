import { View, Text, StyleSheet } from "react-native";
import { CoresInstagram } from "@/constantes/sistema-design";

export default function TelaSalvos() {
  return (
    <View style={estilos.conteiner}>
      <Text style={estilos.texto}>Tela Salvos</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    color: CoresInstagram.textoPrimario,
    fontSize: 18,
  },
});
