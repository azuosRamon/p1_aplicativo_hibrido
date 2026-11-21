import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CabecalhoPerfil } from "@/componentes/cabecalho-perfil";
import {
  usuarioAtualMock,
  destaquesPerfilMock,
} from "@/dados/dados-mockados";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";
import { ItemDestaque } from "@/modelos/destaque";
import { PublicacaoFeed } from "@/modelos/publicacao";
import { usarPublicacoes } from "@/contextos/contexto-publicacoes";

const LARGURA_TELA = Dimensions.get("window").width;
const ESPACO = 1.5;
const LARGURA_FOTO = (LARGURA_TELA - ESPACO * 2) / 3;

type TipoAbaPerfil = "grade" | "reels" | "marcados";

export default function TelaPerfil() {
  "use no memo";
  const navegador = useRouter();
  const { usuarioLogado, publicacoesDoUsuario } = usarPublicacoes();
  const [abaAtiva, setAbaAtiva] = useState<TipoAbaPerfil>("grade");

  const ehContaPadraoRamon = usuarioLogado.nomeUsuario.trim().toLowerCase() === "ramon.dev";
  const destaquesExibidos: ItemDestaque[] = ehContaPadraoRamon
    ? destaquesPerfilMock
    : [{ id: "dest_novo", titulo: "Novo", capaUrl: "", ehNovo: true }];

  function abrirPublicacaoEmScroll(idPublicacao: string) {
    navegador.push({
      pathname: "/publicacoes-perfil" as any,
      params: { idPublicacao },
    });
  }

  function renderizarDestaques() {
    return (
      <View style={estilos.secaoDestaques}>
        <FlatList
          data={destaquesExibidos}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.listaDestaquesConteudo}
          renderItem={({ item }) => (
            <TouchableOpacity style={estilos.itemDestaque} activeOpacity={0.8}>
              <View style={estilos.circuloDestaqueBorda}>
                {item.ehNovo ? (
                  <View style={estilos.circuloNovo}>
                    <Ionicons name="add" size={28} color={CoresInstagram.textoPrimario} />
                  </View>
                ) : (
                  <Image source={{ uri: item.capaUrl }} style={estilos.imagemDestaque} />
                )}
              </View>
              <Text style={estilos.tituloDestaque} numberOfLines={1}>
                {item.titulo}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  function renderizarSeletorAbas() {
    return (
      <View style={estilos.barraAbasPerfil}>
        <TouchableOpacity
          onPress={() => setAbaAtiva("grade")}
          style={[estilos.botaoAbaPerfil, abaAtiva === "grade" && estilos.abaPerfilAtiva]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="grid"
            size={22}
            color={abaAtiva === "grade" ? CoresInstagram.textoPrimario : CoresInstagram.textoSuave}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAbaAtiva("reels")}
          style={[estilos.botaoAbaPerfil, abaAtiva === "reels" && estilos.abaPerfilAtiva]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="play-circle-outline"
            size={24}
            color={abaAtiva === "reels" ? CoresInstagram.textoPrimario : CoresInstagram.textoSuave}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAbaAtiva("marcados")}
          style={[estilos.botaoAbaPerfil, abaAtiva === "marcados" && estilos.abaPerfilAtiva]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={abaAtiva === "marcados" ? CoresInstagram.textoPrimario : CoresInstagram.textoSuave}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderizarCabecalhoCompleto() {
    return (
      <View>
        <CabecalhoPerfil
          usuario={usuarioLogado}
          totalPublicacoesReal={publicacoesDoUsuario.length}
        />
        {renderizarDestaques()}
        {renderizarSeletorAbas()}
      </View>
    );
  }

  function renderizarFotoGrade({ item, index }: { item: PublicacaoFeed; index: number }) {
    const ehTerceira = (index + 1) % 3 === 0;

    return (
      <TouchableOpacity
        style={[
          estilos.itemFoto,
          { marginRight: ehTerceira ? 0 : ESPACO },
        ]}
        onPress={() => abrirPublicacaoEmScroll(item.id)}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.midiaUrl }} style={estilos.imagemFoto} />
        {item.ehReel && (
          <View style={estilos.iconeVideoBadge}>
            <Ionicons name="play" size={14} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      <FlatList
        data={publicacoesDoUsuario}
        keyExtractor={(item) => item.id}
        renderItem={renderizarFotoGrade}
        numColumns={3}
        ListHeaderComponent={renderizarCabecalhoCompleto}
        ListEmptyComponent={
          <View style={estilos.estadoVazioPerfil}>
            <Ionicons name="camera-outline" size={44} color={CoresInstagram.textoSuave} />
            <Text style={estilos.tituloVazioPerfil}>Ainda não há publicações</Text>
            <Text style={estilos.subtituloVazioPerfil}>
              Toque no botão + no topo para compartilhar sua primeira foto.
            </Text>
          </View>
        }
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
  secaoDestaques: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
  },
  listaDestaquesConteudo: {
    paddingHorizontal: 12,
  },
  itemDestaque: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 66,
  },
  circuloDestaqueBorda: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: CoresInstagram.bordaDestaque,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  circuloNovo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  imagemDestaque: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  tituloDestaque: {
    ...Tipografia.legenda,
    color: CoresInstagram.textoPrimario,
    marginTop: 4,
    textAlign: "center",
  },
  barraAbasPerfil: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
  },
  botaoAbaPerfil: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "transparent",
  },
  abaPerfilAtiva: {
    borderBottomColor: CoresInstagram.textoPrimario,
  },
  conteudoLista: {
    paddingBottom: 110,
  },
  itemFoto: {
    width: LARGURA_FOTO,
    height: LARGURA_FOTO,
    marginBottom: ESPACO,
    backgroundColor: CoresInstagram.fundoSecundario,
    position: "relative",
  },
  imagemFoto: {
    width: "100%",
    height: "100%",
  },
  iconeVideoBadge: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  estadoVazioPerfil: {
    paddingVertical: 56,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  tituloVazioPerfil: {
    color: CoresInstagram.textoPrimario,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4,
  },
  subtituloVazioPerfil: {
    color: CoresInstagram.textoSecundario,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
