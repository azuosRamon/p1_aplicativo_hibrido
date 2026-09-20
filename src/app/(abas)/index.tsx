import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CarrosselStories } from "@/componentes/carrossel-stories";
import { CartaoPublicacao } from "@/componentes/cartao-publicacao";
import { storiesMock, publicacoesFeedMock } from "@/dados/dados-mockados";
import { CoresInstagram } from "@/constantes/sistema-design";
import { PublicacaoFeed } from "@/modelos/publicacao";

export default function TelaInicioFeed() {
  const navegador = useRouter();
  const [listaPublicacoes] = useState<PublicacaoFeed[]>(publicacoesFeedMock);

  function irParaDirect() {
    navegador.push("/(abas)/mensagens");
  }

  function irParaPerfil() {
    navegador.push("/(abas)/perfil");
  }

  function renderizarCabecalhoLista() {
    return (
      <View>
        <CarrosselStories stories={storiesMock} />
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      {/* Barra de Topo Oficial do Feed */}
      <View style={estilos.barraTopo}>
        <TouchableOpacity
          style={estilos.botaoIcone}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add" size={28} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Text style={estilos.logoTexto}>Instagram</Text>
        </TouchableOpacity>

        <View style={estilos.acoesDireita}>
          <TouchableOpacity
            style={estilos.botaoIcone}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="heart-outline" size={26} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed com Stories no topo e Publicações */}
      <FlatList
        data={listaPublicacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartaoPublicacao
            publicacao={item}
            aoPressionarAutor={irParaPerfil}
            aoPressionarCompartilhar={irParaDirect}
          />
        )}
        ListHeaderComponent={renderizarCabecalhoLista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoLista}
        initialNumToRender={3}
        maxToRenderPerBatch={4}
        windowSize={5}
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: CoresInstagram.fundo,
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
  },
  botaoIcone: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoTexto: {
    color: CoresInstagram.textoPrimario,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
    fontFamily: Platform.select({ ios: "Snell Roundhand", android: "serif", default: "serif" }),
  },
  acoesDireita: {
    flexDirection: "row",
    alignItems: "center",
  },
  conteudoLista: {
    paddingBottom: 100, // Espaçamento para não ser sobreposto pela barra de navegação flutuante
  },
});
