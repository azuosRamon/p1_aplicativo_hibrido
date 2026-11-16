import React, { useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CartaoPublicacao } from "@/componentes/cartao-publicacao";
import { usarPublicacoes } from "@/contextos/contexto-publicacoes";
import { usuarioAtualMock } from "@/dados/dados-mockados";
import { CoresInstagram } from "@/constantes/sistema-design";

export default function TelaPublicacoesPerfil() {
  const navegador = useRouter();
  const parametros = useLocalSearchParams<{ idPublicacao?: string }>();
  const { publicacoesDoUsuario } = usarPublicacoes();

  // Posiciona a foto clicada na grade do perfil como primeiro item visível do scroll
  const listaOrdenadaParaScroll = useMemo(() => {
    if (!parametros.idPublicacao) {
      return publicacoesDoUsuario;
    }
    const indiceClicado = publicacoesDoUsuario.findIndex(
      (item) => item.id === parametros.idPublicacao
    );
    if (indiceClicado <= 0) {
      return publicacoesDoUsuario;
    }
    const selecionada = publicacoesDoUsuario[indiceClicado];
    const restantes = publicacoesDoUsuario.filter(
      (item) => item.id !== parametros.idPublicacao
    );
    return [selecionada, ...restantes];
  }, [publicacoesDoUsuario, parametros.idPublicacao]);

  function abrirComentarios(idPublicacao: string) {
    navegador.push({
      pathname: "/comentarios" as any,
      params: { idPublicacao },
    });
  }

  function irParaDirect() {
    navegador.push("/(abas)/mensagens");
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      {/* Cabeçalho Fiel ao Print post_perfil_aberto.jpeg: (<) | Posts / usuario */}
      <View style={estilos.barraTopo}>
        <TouchableOpacity
          style={estilos.botaoVoltarCircular}
          onPress={() => navegador.back()}
          activeOpacity={0.75}
        >
          <Ionicons name="chevron-back" size={24} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>

        <View style={estilos.blocoTitulos}>
          <Text style={estilos.tituloPrincipal}>Posts</Text>
          <Text style={estilos.subtituloUsuario}>{usuarioAtualMock.nomeUsuario}</Text>
        </View>

        <View style={estilos.espacadorDireito} />
      </View>

      {/* Lista Vertical em Formato de Feed Reutilizando CartaoPublicacao */}
      <FlatList
        data={listaOrdenadaParaScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartaoPublicacao
            publicacao={item}
            aoPressionarComentarios={abrirComentarios}
            aoPressionarCompartilhar={irParaDirect}
          />
        )}
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
  barraTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
  },
  botaoVoltarCircular: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E232A",
    alignItems: "center",
    justifyContent: "center",
  },
  blocoTitulos: {
    alignItems: "center",
    justifyContent: "center",
  },
  tituloPrincipal: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    fontWeight: "700",
  },
  subtituloUsuario: {
    color: CoresInstagram.textoSecundario,
    fontSize: 12,
    marginTop: 1,
  },
  espacadorDireito: {
    width: 40,
  },
  conteudoLista: {
    paddingBottom: 48,
  },
});

