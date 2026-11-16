import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library/legacy";
import { SeletorMidiaGaleria, ItemFotoGaleria } from "@/componentes/seletor-midia-galeria";
import { CoresInstagram } from "@/constantes/sistema-design";
import { publicacoesExplorarMock, publicacoesPerfilMock } from "@/dados/dados-mockados";

const FOTOS_GALERIA_INICIAIS: ItemFotoGaleria[] = [
  ...publicacoesPerfilMock.map((item, idx) => ({
    id: `galeria_perf_${idx}`,
    uri: item.midiaUrl,
  })),
  ...publicacoesExplorarMock.map((item, idx) => ({
    id: `galeria_exp_${idx}`,
    uri: item.midiaUrl,
  })),
];

export default function TelaNovoPostPrimeiraEtapa() {
  const navegador = useRouter();
  const [fotosGaleria, setFotosGaleria] = useState<ItemFotoGaleria[]>(FOTOS_GALERIA_INICIAIS);
  const [uriSelecionada, setUriSelecionada] = useState<string>(FOTOS_GALERIA_INICIAIS[0].uri);
  const [modoAjuste, setModoAjuste] = useState<"cover" | "contain">("cover");

  useEffect(() => {
    async function carregarFotosReaisDoAparelho() {
      if (Platform.OS === "web") {
        return;
      }

      try {
        const permissao = await MediaLibrary.requestPermissionsAsync();
        if (!permissao.granted) {
          return;
        }

        const midiasDispositivo = await MediaLibrary.getAssetsAsync({
          first: 24,
          mediaType: [MediaLibrary.MediaType.photo],
          sortBy: [MediaLibrary.SortBy.creationTime],
        });

        if (midiasDispositivo.assets.length > 0) {
          const fotosLocais: ItemFotoGaleria[] = midiasDispositivo.assets.map((ativo) => ({
            id: ativo.id,
            uri: ativo.uri,
          }));
          setFotosGaleria([...fotosLocais, ...FOTOS_GALERIA_INICIAIS]);
          setUriSelecionada(fotosLocais[0].uri);
        }
      } catch (erro) {
        console.warn("Galeria local indisponível no Expo Go, usando fotos padrão:", erro);
      }
    }

    carregarFotosReaisDoAparelho();
  }, []);

  async function abrirCameraNativa() {
    try {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert("Permissão necessária", "Autorize o uso da câmera para tirar uma foto.");
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!resultado.canceled && resultado.assets[0]) {
        const novaUri = resultado.assets[0].uri;
        const novoItem: ItemFotoGaleria = { id: `cam_${Date.now()}`, uri: novaUri };
        setFotosGaleria((anterior) => [novoItem, ...anterior]);
        setUriSelecionada(novaUri);
      }
    } catch (erro) {
      console.warn("Erro ao abrir câmera:", erro);
    }
  }

  async function abrirSeletorGaleriaSistema() {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert("Permissão necessária", "Autorize o acesso às fotos para escolher da galeria.");
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!resultado.canceled && resultado.assets[0]) {
        const novaUri = resultado.assets[0].uri;
        const novoItem: ItemFotoGaleria = { id: `gal_${Date.now()}`, uri: novaUri };
        setFotosGaleria((anterior) => [novoItem, ...anterior]);
        setUriSelecionada(novaUri);
      }
    } catch (erro) {
      console.warn("Erro ao abrir seletor de imagens:", erro);
    }
  }

  function irParaEtapaLegenda() {
    navegador.push({
      pathname: "/novo-post/legenda" as any,
      params: { uriFoto: uriSelecionada },
    });
  }

  function alternarProporcaoPreview() {
    setModoAjuste((atual) => (atual === "cover" ? "contain" : "cover"));
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      {/* Barra de Topo: (X) | Novo post | Avançar */}
      <View style={estilos.barraTopo}>
        <TouchableOpacity
          style={estilos.botaoFecharCircular}
          onPress={() => navegador.back()}
          activeOpacity={0.75}
        >
          <Ionicons name="close" size={24} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Novo post</Text>

        <TouchableOpacity
          style={estilos.botaoAvancarPilula}
          onPress={irParaEtapaLegenda}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoAvancar}>Avançar</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Principal da Foto Selecionada */}
      <View style={estilos.conteinerPreview}>
        <Image
          source={{ uri: uriSelecionada }}
          style={estilos.imagemPreview}
          resizeMode={modoAjuste}
        />
      </View>

      {/* Faixa do Botão de Expandir/Enquadrar (canto inferior esquerdo abaixo da foto, igual ao print) */}
      <View style={estilos.faixaBotaoEnquadrar}>
        <TouchableOpacity
          style={estilos.botaoEnquadrarCircular}
          onPress={alternarProporcaoPreview}
          activeOpacity={0.75}
        >
          <Ionicons name="scan-outline" size={18} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>
      </View>

      {/* Seletor de Mídia e Grade de Fotos Recentes da Galeria */}
      <SeletorMidiaGaleria
        fotosGaleria={fotosGaleria}
        uriSelecionada={uriSelecionada}
        aoSelecionarFoto={setUriSelecionada}
        aoAbrirCamera={abrirCameraNativa}
        aoAbrirGaleriaSistema={abrirSeletorGaleriaSistema}
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
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: CoresInstagram.fundo,
  },
  botaoFecharCircular: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E232A",
    alignItems: "center",
    justifyContent: "center",
  },
  tituloTopo: {
    color: CoresInstagram.textoPrimario,
    fontSize: 18,
    fontWeight: "700",
  },
  botaoAvancarPilula: {
    backgroundColor: "#1C2633",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textoAvancar: {
    color: "#589BFF",
    fontSize: 15,
    fontWeight: "700",
  },
  conteinerPreview: {
    width: "100%",
    aspectRatio: 1.05,
    backgroundColor: "#12151A",
  },
  imagemPreview: {
    width: "100%",
    height: "100%",
  },
  faixaBotaoEnquadrar: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 2,
    backgroundColor: CoresInstagram.fundo,
  },
  botaoEnquadrarCircular: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1E232A",
    alignItems: "center",
    justifyContent: "center",
  },
});

