import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BarraPesquisa } from "@/componentes/barra-pesquisa";
import { GradeExplorar } from "@/componentes/grade-explorar";
import { PilulaFiltro } from "@/componentes/pilula-filtro";
import { CoresInstagram } from "@/constantes/sistema-design";
import { usarBuscaExplorar } from "@/ganchos/usar-busca-explorar";

const SUGESTOES_EXPLORAR = ["casa", "carro", "moto", "praia", "natureza", "arquitetura"];

export default function TelaExplorar() {
  const navegador = useRouter();

  /**
   * 🎓 MÃO NA MASSA (ETAPA 14):
   * Consuma o gancho customizado `usarBuscaExplorar()` que criamos na Etapa 12
   * para conectar a tela à API de imagens e ao AsyncStorage.
   */
  const {
    termoPesquisa,
    setTermoPesquisa,
    itensExplorar,
    estaCarregando,
    executarPesquisa,
  } = usarBuscaExplorar();

  function abrirNovoPost() {
    navegador.push("/novo-post" as any);
  }

  function lidarComSubmissaoBusca() {
    executarPesquisa(termoPesquisa);
  }

  function selecionarSugestaoRapida(palavra: string) {
    setTermoPesquisa(palavra);
    executarPesquisa(palavra);
  }

  function renderizarPilulasSugestao() {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.barraSugestoes}
      >
        {SUGESTOES_EXPLORAR.map((palavra) => (
          <PilulaFiltro
            key={palavra}
            rotulo={palavra}
            selecionada={termoPesquisa.toLowerCase() === palavra.toLowerCase()}
            aoPressionar={() => selecionarSugestaoRapida(palavra)}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      {/* Barra de Topo do Explorar com (+) e Barra de Pesquisa */}
      <View style={estilos.barraTopo}>
        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={abrirNovoPost}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>

        <View style={estilos.conteinerPesquisa}>
          <BarraPesquisa
            valor={termoPesquisa}
            aoMudarTexto={setTermoPesquisa}
            aoSubmeterPesquisa={lidarComSubmissaoBusca}
            textoMarcador="Pesquisar (ex: casa, carro, moto...)"
          />
        </View>
      </View>

      {/* Grade de 3 Colunas Alimentada pela API */}
      <GradeExplorar
        itens={itensExplorar}
        estaCarregando={estaCarregando}
        aoAtualizar={() => executarPesquisa(termoPesquisa)}
        cabecalhoLista={renderizarPilulasSugestao()}
      />
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
  barraSugestoes: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    paddingTop: 2,
  },
});
