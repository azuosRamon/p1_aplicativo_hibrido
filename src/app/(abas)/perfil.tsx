import { View, Text, StyleSheet } from "react-native";
import { CoresInstagram } from "@/constantes/sistema-design";

export default function TelaPerfil() {
  return (
    <View style={estilos.conteiner}>
      <Text style={estilos.texto}>Tela Perfil</Text>
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
