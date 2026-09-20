import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BarraPesquisa } from "@/componentes/barra-pesquisa";
import { CarrosselNotas } from "@/componentes/carrossel-notas";
import { ItemConversaLinha } from "@/componentes/item-conversa";
import { usuarioAtualMock, notasDirectMock, conversasMock } from "@/dados/dados-mockados";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";
import { ItemConversa } from "@/modelos/conversa";

export default function TelaDirectMensagens() {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [listaConversas] = useState<ItemConversa[]>(conversasMock);

  const conversasFiltradas = listaConversas.filter((c) =>
    c.contato.nomeCompleto.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    c.contato.nomeUsuario.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  function renderizarCabecalho() {
    return (
      <View>
        <CarrosselNotas notas={notasDirectMock} />
        <View style={estilos.linhaSecao}>
          <Text style={Tipografia.tituloSecao}>Mensagens</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={estilos.textoPedidos}>Pedidos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      {/* Barra de Topo do Direct */}
      <View style={estilos.barraTopo}>
        <TouchableOpacity style={estilos.usuarioSelector} activeOpacity={0.8}>
          <Text style={estilos.textoUsuario}>{usuarioAtualMock.nomeUsuario}</Text>
          <Ionicons name="chevron-down" size={14} color={CoresInstagram.textoPrimario} />
          <View style={estilos.pontoNotificacaoTopo} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botaoNovaMensagem} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={24} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>
      </View>

      {/* Barra de Pesquisa Meta AI */}
      <BarraPesquisa
        valor={termoPesquisa}
        aoMudarTexto={setTermoPesquisa}
        textoMarcador="Pesquise ou pergunte à Meta AI"
        iconeMetaAi={true}
      />

      {/* Lista de Conversas com Carrossel de Notas no cabeçalho */}
      <FlatList
        data={conversasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemConversaLinha conversa={item} />}
        ListHeaderComponent={renderizarCabecalho}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoLista}
      />

      {/* Botão Flutuante de Nova Conversa (+) */}
      <TouchableOpacity style={estilos.botaoFlutuanteMais} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingVertical: 12,
  },
  usuarioSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textoUsuario: {
    ...Tipografia.tituloMedio,
    fontSize: 20,
  },
  pontoNotificacaoTopo: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CoresInstagram.vermelhoNotificacao,
  },
  botaoNovaMensagem: {
    padding: 4,
  },
  linhaSecao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  textoPedidos: {
    color: CoresInstagram.textoSecundario,
    fontSize: 14,
    fontWeight: "600",
  },
  conteudoLista: {
    paddingBottom: 110,
  },
  botaoFlutuanteMais: {
    position: "absolute",
    bottom: 96,
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: CoresInstagram.fundoElevado,
    borderWidth: 1,
    borderColor: CoresInstagram.bordaDestaque,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
