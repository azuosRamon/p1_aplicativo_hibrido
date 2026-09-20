import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BarraPesquisa } from "@/componentes/barra-pesquisa";
import { GradeExplorar } from "@/componentes/grade-explorar";
import { publicacoesExplorarMock } from "@/dados/dados-mockados";
import { CoresInstagram } from "@/constantes/sistema-design";
import { PublicacaoExplorar } from "@/modelos/publicacao";

export default function TelaExplorar() {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [itensExplorar] = useState<PublicacaoExplorar[]>(publicacoesExplorarMock);

  const itensFiltrados = itensExplorar.filter((item) =>
    item.rotuloTexto
      ? item.rotuloTexto.toLowerCase().includes(termoPesquisa.toLowerCase())
      : true
  );

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      {/* Barra de Topo do Explorar com (+) e Barra de Pesquisa */}
      <View style={estilos.barraTopo}>
        <TouchableOpacity style={estilos.botaoAdicionar} activeOpacity={0.7}>
          <Ionicons name="add" size={28} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>

        <View style={estilos.conteinerPesquisa}>
          <BarraPesquisa
            valor={termoPesquisa}
            aoMudarTexto={setTermoPesquisa}
            textoMarcador="Pesquisar"
          />
        </View>
      </View>

      {/* Grade de 3 Colunas com Mídias e Contadores */}
      <GradeExplorar itens={itensFiltrados} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
  },
  barraTopo: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 4,
    backgroundColor: CoresInstagram.fundo,
  },
  botaoAdicionar: {
    paddingRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  conteinerPesquisa: {
    flex: 1,
  },
});
