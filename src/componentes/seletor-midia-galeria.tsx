import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CoresInstagram } from "@/constantes/sistema-design";

const LARGURA_TELA = Dimensions.get("window").width;
const COLUNAS = 4;
const ESPACO = 1.5;
const TAMANHO_MINIATURA = (LARGURA_TELA - ESPACO * (COLUNAS - 1)) / COLUNAS;

export interface ItemFotoGaleria {
  id: string;
  uri: string;
}

export interface PropsSeletorMidiaGaleria {
  fotosGaleria: ItemFotoGaleria[];
  uriSelecionada: string;
  aoSelecionarFoto: (uri: string) => void;
  aoAbrirCamera: () => void;
  aoAbrirGaleriaSistema: () => void;
}

export function SeletorMidiaGaleria({
  fotosGaleria,
  uriSelecionada,
  aoSelecionarFoto,
  aoAbrirCamera,
  aoAbrirGaleriaSistema,
}: PropsSeletorMidiaGaleria) {
  function renderizarMiniatura({ item, index }: { item: ItemFotoGaleria; index: number }) {
    const ehUltimaDaLinha = (index + 1) % COLUNAS === 0;
    const estaSelecionada = item.uri === uriSelecionada;

    return (
      <TouchableOpacity
        style={[
          estilos.itemGrade,
          { marginRight: ehUltimaDaLinha ? 0 : ESPACO },
        ]}
        onPress={() => aoSelecionarFoto(item.uri)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.uri }} style={estilos.imagemMiniatura} />
        {estaSelecionada && <View style={estilos.sobreposicaoSelecionada} />}
      </TouchableOpacity>
    );
  }

  return (
    <View style={estilos.conteiner}>
      {/* Barra Intermediária: Recentes > | Rascunhos | Câmera + Selecionar */}
      <View style={estilos.barraControles}>
        <View style={estilos.abasEsquerda}>
          <TouchableOpacity
            style={estilos.botaoRecentes}
            onPress={aoAbrirGaleriaSistema}
            activeOpacity={0.7}
          >
            <Text style={estilos.textoRecentes}>Recentes</Text>
            <Ionicons name="chevron-forward" size={16} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>

          <Text style={estilos.textoRascunhos}>Rascunhos</Text>
        </View>

        <View style={estilos.acoesDireita}>
          <TouchableOpacity
            style={estilos.pilulaSelecionar}
            onPress={aoAbrirGaleriaSistema}
            activeOpacity={0.75}
          >
            <Ionicons name="copy-outline" size={15} color={CoresInstagram.textoPrimario} />
            <Text style={estilos.textoSelecionar}>Selecionar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoCameraCircular}
            onPress={aoAbrirCamera}
            activeOpacity={0.75}
          >
            <Ionicons name="camera-outline" size={18} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grade de 4 Colunas com Fotos da Galeria */}
      <FlatList
        data={fotosGaleria}
        keyExtractor={(item) => item.id}
        renderItem={renderizarMiniatura}
        numColumns={COLUNAS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoGrade}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
  },
  barraControles: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: CoresInstagram.fundo,
  },
  abasEsquerda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  botaoRecentes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  textoRecentes: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    fontWeight: "700",
  },
  textoRascunhos: {
    color: CoresInstagram.textoSecundario,
    fontSize: 16,
    fontWeight: "700",
  },
  acoesDireita: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pilulaSelecionar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E232A",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  textoSelecionar: {
    color: CoresInstagram.textoPrimario,
    fontSize: 13,
    fontWeight: "600",
  },
  botaoCameraCircular: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1E232A",
    alignItems: "center",
    justifyContent: "center",
  },
  conteudoGrade: {
    paddingBottom: 24,
  },
  itemGrade: {
    width: TAMANHO_MINIATURA,
    height: TAMANHO_MINIATURA,
    marginBottom: ESPACO,
    backgroundColor: CoresInstagram.fundoSecundario,
    position: "relative",
  },
  imagemMiniatura: {
    width: "100%",
    height: "100%",
  },
  sobreposicaoSelecionada: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderWidth: 2,
    borderColor: CoresInstagram.azulInstagram,
  },
});
