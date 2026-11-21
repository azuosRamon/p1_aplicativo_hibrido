import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CabecalhoTela } from "@/componentes/cabecalho-tela";
import { BarraPesquisa } from "@/componentes/barra-pesquisa";
import { ItemConfiguracaoLinha } from "@/componentes/item-configuracao";
import { secoesConfiguracaoMock } from "@/dados/dados-mockados";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";
import { ItemConfiguracao } from "@/modelos/configuracao";
import { encerrarSessaoUsuario } from "@/servicos/banco-dados/repositorio-usuarios";

export default function TelaConfiguracoesEAtividade() {
  const navegador = useRouter();
  const [termoPesquisa, setTermoPesquisa] = useState("");

  function lidarComCliqueItem(item: ItemConfiguracao) {
    if (item.rotaDestino) {
      navegador.push(item.rotaDestino as any);
    } else if (item.id === "conf_central_contas") {
      navegador.push("/login" as any);
    }
  }

  async function lidarComSairDaConta() {
    await encerrarSessaoUsuario();
    navegador.push("/login" as any);
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      <CabecalhoTela titulo="Configurações e atividade" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.conteudo}>
        {/* Campo de Busca */}
        <BarraPesquisa
          valor={termoPesquisa}
          aoMudarTexto={setTermoPesquisa}
          textoMarcador="Pesquisar"
        />

        {/* Seções de Configurações */}
        {secoesConfiguracaoMock.map((secao, indiceSecao) => {
          const itensFiltrados = secao.itens.filter((item) =>
            item.titulo.toLowerCase().includes(termoPesquisa.toLowerCase())
          );

          if (itensFiltrados.length === 0) return null;

          return (
            <View key={`secao-${indiceSecao}`} style={estilos.secao}>
              <View style={estilos.cabecalhoSecao}>
                <Text style={estilos.tituloSecao}>{secao.titulo}</Text>
                {secao.titulo === "Sua conta" && (
                  <Text style={estilos.metaBadge}>∞ Meta</Text>
                )}
              </View>

              {itensFiltrados.map((item) => (
                <ItemConfiguracaoLinha
                  key={item.id}
                  item={item}
                  aoPressionar={lidarComCliqueItem}
                />
              ))}
            </View>
          );
        })}

        {/* Seção Login e Encerramento de Sessão */}
        <View style={estilos.secaoLogin}>
          <Text style={estilos.tituloSecaoLogin}>Login</Text>

          <TouchableOpacity
            style={estilos.botaoAcaoLogin}
            onPress={() => navegador.push("/cadastro" as any)}
            activeOpacity={0.7}
          >
            <Text style={estilos.textoAdicionarConta}>Adicionar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoAcaoLogin}
            onPress={lidarComSairDaConta}
            activeOpacity={0.7}
          >
            <Text style={estilos.textoSair}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
  },
  conteudo: {
    paddingBottom: 40,
  },
  secao: {
    marginTop: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
    paddingBottom: 6,
  },
  cabecalhoSecao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  tituloSecao: {
    ...Tipografia.subtitulo,
    fontWeight: "600",
    color: CoresInstagram.textoSecundario,
  },
  metaBadge: {
    color: CoresInstagram.textoSuave,
    fontSize: 13,
    fontWeight: "600",
  },
  secaoLogin: {
    marginTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  tituloSecaoLogin: {
    ...Tipografia.subtitulo,
    fontWeight: "600",
    color: CoresInstagram.textoSecundario,
    marginBottom: 10,
  },
  botaoAcaoLogin: {
    paddingVertical: 12,
  },
  textoAdicionarConta: {
    color: "#3EA6FF",
    fontSize: 15,
    fontWeight: "600",
  },
  textoSair: {
    color: "#FF4D4D",
    fontSize: 15,
    fontWeight: "600",
  },
});
