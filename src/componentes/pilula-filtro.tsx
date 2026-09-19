import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { CoresInstagram, RaiosBorda } from "@/constantes/sistema-design";

export interface PropsPilulaFiltro {
  rotulo: string;
  estaSelecionado: boolean;
  aoPressionar: () => void;
}

export function PilulaFiltro({
  rotulo,
  estaSelecionado,
  aoPressionar,
}: PropsPilulaFiltro) {
  return (
    <TouchableOpacity
      onPress={aoPressionar}
      style={[
        estilos.pilula,
        estaSelecionado ? estilos.pilulaAtiva : estilos.pilulaInativa,
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: estaSelecionado }}
    >
      <Text
        style={[
          estilos.texto,
          estaSelecionado ? estilos.textoAtivo : estilos.textoInativo,
        ]}
      >
        {rotulo}
      </Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  pilula: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RaiosBorda.padrao,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pilulaAtiva: {
    backgroundColor: CoresInstagram.fundoPill,
    borderWidth: 1,
    borderColor: CoresInstagram.bordaDestaque,
  },
  pilulaInativa: {
    backgroundColor: CoresInstagram.fundoSecundario,
    borderWidth: 1,
    borderColor: CoresInstagram.bordaSuave,
  },
  texto: {
    fontSize: 14,
    fontWeight: "600",
  },
  textoAtivo: {
    color: CoresInstagram.textoPrimario,
  },
  textoInativo: {
    color: CoresInstagram.textoSecundario,
  },
});
