import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PublicacaoExplorar } from "@/modelos/publicacao";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";

const LARGURA_TELA = Dimensions.get("window").width;
const ESPACO = 1.5;
const LARGURA_ITEM = (LARGURA_TELA - ESPACO * 2) / 3;

export interface PropsGradeExplorar {
  itens: PublicacaoExplorar[];
  estaCarregando?: boolean;
  estaCarregandoMais?: boolean;
  aoAtualizar?: () => void;
  aoCarregarMais?: () => void;
  aoSelecionarItem?: (item: PublicacaoExplorar) => void;
  cabecalhoLista?: React.ReactElement;
}

export function GradeExplorar({
  itens,
  estaCarregando = false,
  estaCarregandoMais = false,
  aoAtualizar,
  aoCarregarMais,
  aoSelecionarItem,
  cabecalhoLista,
}: PropsGradeExplorar) {
  "use no memo";

  function renderizarItem({ item, index }: { item: PublicacaoExplorar; index: number }) {
    const ehTerceiraColuna = (index + 1) % 3 === 0;

    return (
      <TouchableOpacity
        style={[
          estilos.itemConteiner,
          { marginRight: ehTerceiraColuna ? 0 : ESPACO },
        ]}
        onPress={() => aoSelecionarItem?.(item)}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.midiaUrl }} style={estilos.imagem} />

        {/* Rótulo sutil de texto da imagem da API */}
        {item.rotuloTexto && (
          <View style={estilos.tarjaRotulo}>
            <Text style={estilos.textoRotulo} numberOfLines={1}>
              {item.rotuloTexto}
            </Text>
          </View>
        )}

        {/* Contador de Visualizações no Canto Inferior Esquerdo */}
        <View style={estilos.rodapeItem}>
          <Ionicons
            name={item.ehVideo ? "play-outline" : "eye-outline"}
            size={13}
            color="#FFFFFF"
          />
          <Text style={estilos.textoVisualizacoes}>{item.visualizacoes}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (estaCarregando && itens.length === 0) {
    return (
      <View style={estilos.conteinerCentral}>
        {cabecalhoLista}
        <View style={estilos.areaCarregamento}>
          <ActivityIndicator size="large" color={CoresInstagram.textoPrimario} />
          <Text style={estilos.textoStatus}>Buscando fotos na API...</Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={itens}
      keyExtractor={(item) => item.id}
      renderItem={renderizarItem}
      numColumns={3}
      ListHeaderComponent={cabecalhoLista}
      refreshing={estaCarregando}
      onRefresh={aoAtualizar}
      onEndReached={aoCarregarMais}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        estaCarregandoMais ? (
          <View style={estilos.rodapeCarregandoMais}>
            <ActivityIndicator size="small" color={CoresInstagram.textoPrimario} />
            <Text style={estilos.textoCarregandoMais}>Carregando mais fotos...</Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        <View style={estilos.areaCarregamento}>
          <Ionicons name="images-outline" size={42} color={CoresInstagram.textoSuave} />
          <Text style={estilos.textoStatus}>Nenhuma imagem encontrada para esta busca.</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={estilos.listaConteudo}
    />
  );
}

const estilos = StyleSheet.create({
  conteinerCentral: {
    flex: 1,
  },
  areaCarregamento: {
    paddingVertical: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  textoStatus: {
    ...Tipografia.subtitulo,
    color: CoresInstagram.textoSecundario,
    textAlign: "center",
  },
  rodapeCarregandoMais: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  textoCarregandoMais: {
    color: CoresInstagram.textoSecundario,
    fontSize: 13,
  },
  listaConteudo: {
    paddingBottom: 110,
  },
  itemConteiner: {
    width: LARGURA_ITEM,
    height: LARGURA_ITEM * 1.6,
    marginBottom: ESPACO,
    backgroundColor: CoresInstagram.fundoSecundario,
    position: "relative",
  },
  imagem: {
    width: "100%",
    height: "100%",
  },
  tarjaRotulo: {
    position: "absolute",
    top: 8,
    left: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  textoRotulo: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  rodapeItem: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoVisualizacoes: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
