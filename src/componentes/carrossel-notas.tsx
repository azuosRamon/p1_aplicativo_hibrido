import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CoresInstagram, Tipografia, RaiosBorda } from "@/constantes/sistema-design";
import { Usuario, NotaUsuario } from "@/modelos/usuario";

export interface ItemNotaComUsuario {
  id: string;
  contato: Usuario;
  nota: NotaUsuario;
}

export interface PropsCarrosselNotas {
  notas: ItemNotaComUsuario[];
  aoPressionarNota?: (item: ItemNotaComUsuario) => void;
}

export function CarrosselNotas({ notas, aoPressionarNota }: PropsCarrosselNotas) {
  function renderizarItem({ item, index }: { item: ItemNotaComUsuario; index: number }) {
    const ehProprio = index === 0;

    return (
      <TouchableOpacity
        onPress={() => aoPressionarNota?.(item)}
        style={estilos.itemConteiner}
        activeOpacity={0.8}
      >
        {/* Balão Flutuante de Pensamento / Música */}
        <View style={estilos.balaoPensamento}>
          {item.nota.musica ? (
            <View style={estilos.linhaMusica}>
              <Ionicons name="headset-outline" size={12} color={CoresInstagram.textoPrimario} />
              <Text style={estilos.textoMusica} numberOfLines={1}>
                {item.nota.musica.artista}
              </Text>
            </View>
          ) : null}
          <Text style={estilos.textoBalao} numberOfLines={2}>
            {item.nota.musica ? item.nota.musica.titulo : item.nota.texto}
          </Text>
        </View>

        {/* Avatar do Contato */}
        <View style={estilos.conteinerAvatar}>
          <Image source={{ uri: item.contato.fotoUrl }} style={estilos.avatar} />
          {ehProprio && (
            <View style={estilos.pontoProprio}>
              <Ionicons name="add" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Nome do Contato */}
        <Text style={estilos.rotuloNome} numberOfLines={1}>
          {ehProprio ? "Sua nota" : item.contato.nomeCompleto}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={estilos.conteiner}>
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.listaConteudo}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    paddingVertical: 12,
  },
  listaConteudo: {
    paddingHorizontal: 12,
  },
  itemConteiner: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 82,
  },
  balaoPensamento: {
    backgroundColor: CoresInstagram.fundoEntrada,
    borderRadius: RaiosBorda.padrao,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 80,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: CoresInstagram.bordaSuave,
  },
  linhaMusica: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 2,
  },
  textoMusica: {
    fontSize: 10,
    color: CoresInstagram.textoPrimario,
    fontWeight: "600",
  },
  textoBalao: {
    color: CoresInstagram.textoSecundario,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  conteinerAvatar: {
    position: "relative",
    marginBottom: 4,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  pontoProprio: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: CoresInstagram.fundoElevado,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: CoresInstagram.fundo,
  },
  rotuloNome: {
    ...Tipografia.legenda,
    color: CoresInstagram.textoSecundario,
    textAlign: "center",
    width: 78,
  },
});
