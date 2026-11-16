import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BarraPesquisa } from "@/componentes/barra-pesquisa";
import { GradeExplorar } from "@/componentes/grade-explorar";
import { PilulaFiltro } from "@/componentes/pilula-filtro";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";
import { PublicacaoExplorar } from "@/modelos/publicacao";
import { usarBuscaExplorar } from "@/ganchos/usar-busca-explorar";

const SUGESTOES_EXPLORAR = ["casa", "carro", "moto", "praia", "natureza", "arquitetura"];

export default function TelaExplorar() {
  "use no memo";
  const navegador = useRouter();
  const [itemAbertoModal, setItemAbertoModal] = useState<PublicacaoExplorar | null>(null);
  const [curtidoNoModal, setCurtidoNoModal] = useState<boolean>(false);

  const {
    termoPesquisa,
    setTermoPesquisa,
    itensExplorar,
    estaCarregando,
    estaCarregandoMais,
    executarPesquisa,
    carregarMaisResultados,
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

  function abrirImagemEmDestaque(item: PublicacaoExplorar) {
    setCurtidoNoModal(false);
    setItemAbertoModal(item);
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
            estaSelecionado={termoPesquisa.toLowerCase() === palavra.toLowerCase()}
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

      {/* Grade de 3 Colunas Alimentada pela API com Scroll Infinito */}
      <GradeExplorar
        itens={itensExplorar}
        estaCarregando={estaCarregando}
        estaCarregandoMais={estaCarregandoMais}
        aoAtualizar={() => executarPesquisa(termoPesquisa)}
        aoCarregarMais={carregarMaisResultados}
        aoSelecionarItem={abrirImagemEmDestaque}
        cabecalhoLista={renderizarPilulasSugestao()}
      />

      {/* Modal de Visualização Ampliada ao Clicar em uma Imagem do Explorar */}
      <Modal
        visible={itemAbertoModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setItemAbertoModal(null)}
      >
        <View style={estilos.fundoModal}>
          <SafeAreaView style={estilos.conteinerModal}>
            <View style={estilos.cabecalhoModal}>
              <TouchableOpacity
                style={estilos.botaoFecharModal}
                onPress={() => setItemAbertoModal(null)}
                activeOpacity={0.75}
              >
                <Ionicons name="chevron-back" size={24} color={CoresInstagram.textoPrimario} />
              </TouchableOpacity>

              <View style={estilos.titulosModal}>
                <Text style={estilos.tituloModal}>Explorar</Text>
                <Text style={estilos.subtituloModal}>
                  @{itemAbertoModal?.nomeFotografo || "comunidade.api"}
                </Text>
              </View>

              <View style={{ width: 40 }} />
            </View>

            {itemAbertoModal && (
              <View style={estilos.cartaoModal}>
                <Image
                  source={{ uri: itemAbertoModal.midiaUrl }}
                  style={estilos.imagemAmpliada}
                  resizeMode="cover"
                />

                <View style={estilos.rodapeModal}>
                  <View style={estilos.linhaAcoesModal}>
                    <TouchableOpacity
                      onPress={() => setCurtidoNoModal((ant) => !ant)}
                      style={estilos.botaoAcaoModal}
                    >
                      <Ionicons
                        name={curtidoNoModal ? "heart" : "heart-outline"}
                        size={28}
                        color={
                          curtidoNoModal
                            ? CoresInstagram.vermelhoNotificacao
                            : CoresInstagram.textoPrimario
                        }
                      />
                    </TouchableOpacity>

                    <View style={estilos.infoVisualizacoesModal}>
                      <Ionicons name="eye-outline" size={18} color={CoresInstagram.textoSecundario} />
                      <Text style={estilos.textoVisualizacoesModal}>
                        {itemAbertoModal.visualizacoes} visualizações
                      </Text>
                    </View>
                  </View>

                  <Text style={Tipografia.corpo}>
                    <Text style={Tipografia.nomeUsuario}>
                      {itemAbertoModal.nomeFotografo || "fotografo.api"}{" "}
                    </Text>
                    {itemAbertoModal.rotuloTexto || termoPesquisa}
                  </Text>
                </View>
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>
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
  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.94)",
  },
  conteinerModal: {
    flex: 1,
  },
  cabecalhoModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  botaoFecharModal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E232A",
    alignItems: "center",
    justifyContent: "center",
  },
  titulosModal: {
    alignItems: "center",
  },
  tituloModal: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    fontWeight: "700",
  },
  subtituloModal: {
    color: CoresInstagram.textoSecundario,
    fontSize: 12,
  },
  cartaoModal: {
    flex: 1,
    justifyContent: "center",
  },
  imagemAmpliada: {
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  rodapeModal: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linhaAcoesModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  botaoAcaoModal: {
    padding: 2,
  },
  infoVisualizacoesModal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textoVisualizacoesModal: {
    color: CoresInstagram.textoSecundario,
    fontSize: 13,
    fontWeight: "600",
  },
});
