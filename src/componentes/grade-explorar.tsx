import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PublicacaoExplorar } from "@/modelos/publicacao";
import { CoresInstagram } from "@/constantes/sistema-design";

const LARGURA_TELA = Dimensions.get("window").width;
const ESPACO = 1.5;
const LARGURA_ITEM = (LARGURA_TELA - ESPACO * 2) / 3;

export interface PropsGradeExplorar {
  itens: PublicacaoExplorar[];
  aoSelecionarItem?: (item: PublicacaoExplorar) => void;
}

export function GradeExplorar({ itens, aoSelecionarItem }: PropsGradeExplorar) {
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

        {/* Rotulo sutil de texto se houver */}
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

  return (
    <FlatList
      data={itens}
      keyExtractor={(item) => item.id}
      renderItem={renderizarItem}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={estilos.listaConteudo}
    />
  );
}

const estilos = StyleSheet.create({
  listaConteudo: {
    paddingBottom: 110,
  },
  itemConteiner: {
    width: LARGURA_ITEM,
    height: LARGURA_ITEM * 1.6, // Proporção vertical estilo Reels
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
