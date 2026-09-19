import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";

export interface PropsCabecalhoTela {
  titulo: string;
  aoVoltar?: () => void;
  acaoDireita?: React.ReactNode;
  exibirBotaoVoltar?: boolean;
}

export function CabecalhoTela({
  titulo,
  aoVoltar,
  acaoDireita,
  exibirBotaoVoltar = true,
}: PropsCabecalhoTela) {
  const navegador = useRouter();

  function lidarComVoltar() {
    if (aoVoltar) {
      aoVoltar();
    } else {
      navegador.back();
    }
  }

  return (
    <View style={estilos.conteiner}>
      <View style={estilos.ladoEsquerdo}>
        {exibirBotaoVoltar ? (
          <TouchableOpacity
            onPress={lidarComVoltar}
            style={estilos.botaoVoltarCircular}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={CoresInstagram.textoPrimario}
            />
          </TouchableOpacity>
        ) : (
          <View style={estilos.espacador} />
        )}
      </View>

      <View style={estilos.centro}>
        <Text style={[Tipografia.tituloMedio, estilos.titulo]} numberOfLines={1}>
          {titulo}
        </Text>
      </View>

      <View style={estilos.ladoDireito}>
        {acaoDireita ? acaoDireita : <View style={estilos.espacador} />}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: CoresInstagram.fundo,
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
  },
  ladoEsquerdo: {
    width: 44,
    alignItems: "flex-start",
  },
  botaoVoltarCircular: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CoresInstagram.fundoSecundario,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: CoresInstagram.bordaSuave,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    textAlign: "center",
  },
  ladoDireito: {
    width: 44,
    alignItems: "flex-end",
  },
  espacador: {
    width: 38,
  },
});
