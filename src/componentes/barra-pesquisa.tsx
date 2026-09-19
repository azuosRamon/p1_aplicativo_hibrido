import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CoresInstagram, RaiosBorda } from "@/constantes/sistema-design";

export interface PropsBarraPesquisa {
  valor: string;
  aoMudarTexto: (texto: string) => void;
  textoMarcador?: string;
  iconeMetaAi?: boolean;
}

export function BarraPesquisa({
  valor,
  aoMudarTexto,
  textoMarcador = "Pesquisar",
  iconeMetaAi = false,
}: PropsBarraPesquisa) {
  return (
    <View style={estilos.conteiner}>
      <Ionicons
        name={iconeMetaAi ? "sparkles-outline" : "search"}
        size={18}
        color={iconeMetaAi ? CoresInstagram.azulInstagram : CoresInstagram.textoSuave}
        style={estilos.iconeEsquerda}
      />
      <TextInput
        value={valor}
        onChangeText={aoMudarTexto}
        placeholder={textoMarcador}
        placeholderTextColor={CoresInstagram.textoSuave}
        style={estilos.entrada}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {valor.length > 0 && (
        <TouchableOpacity
          onPress={() => aoMudarTexto("")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="close-circle"
            size={16}
            color={CoresInstagram.textoSuave}
            style={estilos.iconeLimpar}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CoresInstagram.fundoEntrada,
    borderRadius: RaiosBorda.medio,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 14,
    marginVertical: 8,
  },
  iconeEsquerda: {
    marginRight: 8,
  },
  entrada: {
    flex: 1,
    color: CoresInstagram.textoPrimario,
    fontSize: 15,
    paddingVertical: 0,
  },
  iconeLimpar: {
    marginLeft: 6,
  },
});
