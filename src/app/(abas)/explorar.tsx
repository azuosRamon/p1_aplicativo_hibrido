import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BarraPesquisa } from "@/componentes/barra-pesquisa";
import { GradeExplorar } from "@/componentes/grade-explorar";
import { PilulaFiltro } from "@/componentes/pilula-filtro";
import { CartaoPublicacao } from "@/componentes/cartao-publicacao";
import { CoresInstagram } from "@/constantes/sistema-design";
import { PublicacaoExplorar, PublicacaoFeed } from "@/modelos/publicacao";
import { usarBuscaExplorar } from "@/ganchos/usar-busca-explorar";

const SUGESTOES_EXPLORAR = ["casa", "carro", "moto", "praia", "natureza", "arquitetura"];

/**
 * Converte um item da grade do Explorar (vindo da API) para o formato `PublicacaoFeed`
 * para que ao clicar na foto ela abra em formato de Post (reutilizando `CartaoPublicacao`).
 */
function converterItemExplorarParaPostFeed(
  item: PublicacaoExplorar,
  indice: number,
  termoAtual: string
): PublicacaoFeed {
  const nomeAutor = item.nomeFotografo || "explorar.api";
  return {
    id: item.id,
    autor: {
      id: `autor_exp_${indice}`,
      nomeUsuario: nomeAutor,
      nomeCompleto: nomeAutor,
      fotoUrl: item.midiaUrl,
      biografia: "",
      totalPublicacoes: 24,
      totalSeguidores: 1450,
      totalSeguindo: 210,
    },
    midiaUrl: item.midiaUrl,
    legenda: item.rotuloTexto || `Resultado da busca por #${termoAtual} ✨`,
    localizacao: `Explorar • #${termoAtual}`,
    curtidas: 120 + indice * 37,
    comentarios: 0,
    criadoEm: "Sugestão da API",
    ehReel: item.ehVideo,
    estaCurtido: false,
    estaSalvo: false,
    curtidoPorDestaque: "aleisa2015",
    ehDoUsuarioAtual: false,
  };
}

export default function TelaExplorar() {
  "use no memo";
  const navegador = useRouter();
  const [itemSelecionadoPost, setItemSelecionadoPost] = useState<PublicacaoExplorar | null>(null);

  const {
    termoPesquisa,
    setTermoPesquisa,
    itensExplorar,
    estaCarregando,
    estaCarregandoMais,
    executarPesquisa,
    carregarMaisResultados,
  } = usarBuscaExplorar();

  // Permite voltar do Post aberto para a grade do Explorar usando também o botão Voltar físico do Android
  useEffect(() => {
    if (!itemSelecionadoPost) return;

    const inscricao = BackHandler.addEventListener("hardwareBackPress", () => {
      setItemSelecionadoPost(null);
      return true;
    });

    return () => inscricao.remove();
  }, [itemSelecionadoPost]);

  // Monta a lista de Posts em formato de Feed começando pela foto clicada no Explorar
  const listaPostsExplorar = useMemo(() => {
    if (!itemSelecionadoPost) return [];

    const restantes = itensExplorar.filter((i) => i.id !== itemSelecionadoPost.id);
    const ordenados = [itemSelecionadoPost, ...restantes];

    return ordenados.map((item, idx) =>
      converterItemExplorarParaPostFeed(item, idx, termoPesquisa || "explorar")
    );
  }, [itemSelecionadoPost, itensExplorar, termoPesquisa]);

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

  // MODO 1: Quando o usuário clica em uma foto do Explorar, abre em formato de Post (Feed Scroll)
  if (itemSelecionadoPost) {
    return (
      <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
        <View style={estilos.barraTopoPostAberto}>
          <TouchableOpacity
            style={estilos.botaoVoltarCircular}
            onPress={() => setItemSelecionadoPost(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.75}
          >
            <Ionicons name="chevron-back" size={24} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>

          <View style={estilos.titulosTopoPost}>
            <Text style={estilos.tituloPost}>Explorar</Text>
            <Text style={estilos.subtituloPost}>#{termoPesquisa || "destaques"}</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.conteudoScrollPosts}
        >
          {listaPostsExplorar.map((post) => (
            <CartaoPublicacao
              key={post.id}
              publicacao={post}
              aoPressionarCompartilhar={() => navegador.push("/(abas)/mensagens")}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // MODO 2: Grade normal do Explorar com Barra de Pesquisa, Pílulas com altura fixa e Scroll Infinito
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

      {/* Faixa de Pílulas Rápidas com Altura Fixa (nunca estica na tela) */}
      <View style={estilos.faixaFixaSugestoes}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.barraSugestoes}
        >
          {SUGESTOES_EXPLORAR.map((palavra) => (
            <PilulaFiltro
              key={palavra}
              rotulo={palavra}
              estaSelecionado={termoPesquisa.trim().toLowerCase() === palavra.toLowerCase()}
              aoPressionar={() => selecionarSugestaoRapida(palavra)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Grade de 3 Colunas Alimentada pela API com Scroll Infinito */}
      <GradeExplorar
        itens={itensExplorar}
        estaCarregando={estaCarregando}
        estaCarregandoMais={estaCarregandoMais}
        aoAtualizar={() => executarPesquisa(termoPesquisa)}
        aoCarregarMais={carregarMaisResultados}
        aoSelecionarItem={(item) => setItemSelecionadoPost(item)}
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
    paddingVertical: 2,
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
  faixaFixaSugestoes: {
    height: 46,
    justifyContent: "center",
    backgroundColor: CoresInstagram.fundo,
  },
  barraSugestoes: {
    paddingHorizontal: 14,
    alignItems: "center",
  },
  barraTopoPostAberto: {
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
  titulosTopoPost: {
    alignItems: "center",
    justifyContent: "center",
  },
  tituloPost: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    fontWeight: "700",
  },
  subtituloPost: {
    color: CoresInstagram.textoSecundario,
    fontSize: 12,
    marginTop: 1,
  },
  conteudoScrollPosts: {
    paddingBottom: 110,
  },
});
