import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ItemConfiguracao } from "@/modelos/configuracao";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";

export interface PropsItemConfiguracao {
  item: ItemConfiguracao;
  aoPressionar?: (item: ItemConfiguracao) => void;
}

export function ItemConfiguracaoLinha({ item, aoPressionar }: PropsItemConfiguracao) {
  return (
    <TouchableOpacity
      style={estilos.conteiner}
      onPress={() => aoPressionar?.(item)}
      activeOpacity={0.7}
    >
      <View style={estilos.areaIcone}>
        <Ionicons
          name={item.iconeNome as any}
          size={22}
          color={CoresInstagram.textoPrimario}
        />
      </View>

      <View style={estilos.areaTextos}>
        <Text style={Tipografia.corpo}>{item.titulo}</Text>
        {item.subtitulo && (
          <Text style={estilos.subtitulo} numberOfLines={2}>
            {item.subtitulo}
          </Text>
        )}
      </View>

      <View style={estilos.areaDireita}>
        {item.valorDireita && (
          <Text style={estilos.textoValorDireita}>{item.valorDireita}</Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={CoresInstagram.textoSuave} />
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: CoresInstagram.fundo,
  },
  areaIcone: {
    width: 32,
    marginRight: 12,
    alignItems: "center",
  },
  areaTextos: {
    flex: 1,
    paddingRight: 8,
  },
  subtitulo: {
    ...Tipografia.legenda,
    marginTop: 3,
    lineHeight: 16,
  },
  areaDireita: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textoValorDireita: {
    ...Tipografia.subtitulo,
    color: CoresInstagram.textoSecundario,
  },
});
