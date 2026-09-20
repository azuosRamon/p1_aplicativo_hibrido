import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CabecalhoTela } from "@/componentes/cabecalho-tela";
import { PilulaFiltro } from "@/componentes/pilula-filtro";
import { colecoesSalvasMock, publicacoesSalvasMock } from "@/dados/dados-mockados";
import { CoresInstagram, Tipografia, RaiosBorda } from "@/constantes/sistema-design";
import { PublicacaoExplorar } from "@/modelos/publicacao";

const LARGURA_TELA = Dimensions.get("window").width;
const ESPACO = 1.5;
const LARGURA_ITEM = (LARGURA_TELA - ESPACO * 2) / 3;

export default function TelaSalvos() {
  const [filtroAtivo, setFiltroAtivo] = useState("Tudo");
  const filtros = ["Tudo", "Coleções", "Série", "Reels", "Posts"];

  function renderizarCabecalho() {
    return (
      <View>
        {/* Carrossel de Filtros em Pílulas */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.carrosselFiltros}
        >
          {filtros.map((filtro) => (
            <PilulaFiltro
              key={filtro}
              rotulo={filtro}
              estaSelecionado={filtroAtivo === filtro}
              aoPressionar={() => setFiltroAtivo(filtro)}
            />
          ))}
        </ScrollView>

        {/* Seção Coleções */}
        <View style={estilos.secaoColecoes}>
          <View style={estilos.cabecalhoSecao}>
            <Text style={Tipografia.tituloSecao}>Coleções</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={estilos.linkAzul}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          {/* Cards de Coleção Horizontal */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {colecoesSalvasMock.map((colecao) => (
              <TouchableOpacity
                key={colecao.id}
                style={estilos.cardColecao}
                activeOpacity={0.8}
              >
                <Image source={{ uri: colecao.capaUrl }} style={estilos.capaColecao} />
                <View style={estilos.textosColecao}>
                  <Text style={estilos.tituloColecao} numberOfLines={1}>
                    {colecao.titulo}
                  </Text>
                  <View style={estilos.linhaPrivado}>
                    {colecao.ehPrivada && (
                      <Ionicons name="lock-closed" size={11} color={CoresInstagram.textoSuave} />
                    )}
                    <Text style={estilos.textoPrivado}>
                      {colecao.ehPrivada ? "Privado" : `${colecao.totalItens} itens`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Linha de Cabeçalho da Grade */}
        <View style={estilos.cabecalhoGrade}>
          <Text style={Tipografia.tituloSecao}>Reels e posts</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={estilos.linkAzul}>Gerenciar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderizarItemGrade({ item, index }: { item: PublicacaoExplorar; index: number }) {
    const ehTerceira = (index + 1) % 3 === 0;

    return (
      <TouchableOpacity
        style={[
          estilos.itemGrade,
          { marginRight: ehTerceira ? 0 : ESPACO },
        ]}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.midiaUrl }} style={estilos.imagemGrade} />
        {item.ehVideo && (
          <View style={estilos.badgePlay}>
            <Ionicons name="play" size={14} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      <CabecalhoTela
        titulo="Salvos"
        acaoDireita={
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="add" size={28} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={publicacoesSalvasMock}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItemGrade}
        numColumns={3}
        ListHeaderComponent={renderizarCabecalho}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoLista}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
  },
  conteudoLista: {
    paddingBottom: 40,
  },
  carrosselFiltros: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secaoColecoes: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  cabecalhoSecao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  linkAzul: {
    color: CoresInstagram.azulInstagram,
    fontSize: 14,
    fontWeight: "600",
  },
  cardColecao: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  capaColecao: {
    width: 68,
    height: 68,
    borderRadius: RaiosBorda.padrao,
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  textosColecao: {
    marginLeft: 12,
  },
  tituloColecao: {
    ...Tipografia.nomeUsuario,
    fontSize: 15,
  },
  linhaPrivado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  textoPrivado: {
    ...Tipografia.legenda,
  },
  cabecalhoGrade: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  itemGrade: {
    width: LARGURA_ITEM,
    height: LARGURA_ITEM * 1.5,
    marginBottom: ESPACO,
    backgroundColor: CoresInstagram.fundoSecundario,
    position: "relative",
  },
  imagemGrade: {
    width: "100%",
    height: "100%",
  },
  badgePlay: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
