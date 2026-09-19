import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { ItemStory } from "@/modelos/story";
import { AvatarUsuario } from "./avatar-usuario";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";

export interface PropsCarrosselStories {
  stories: ItemStory[];
  aoSelecionarStory?: (story: ItemStory) => void;
}

export function CarrosselStories({
  stories,
  aoSelecionarStory,
}: PropsCarrosselStories) {
  function renderizarItem({ item }: { item: ItemStory }) {
    return (
      <TouchableOpacity
        onPress={() => aoSelecionarStory?.(item)}
        style={estilos.itemConteiner}
        activeOpacity={0.8}
      >
        <AvatarUsuario
          fotoUrl={item.fotoUsuarioUrl}
          tamanho={68}
          possuiStory={!item.ehSeuStory}
          storyVisto={!item.possuiStoryNaoVisto}
          ehSeuStory={item.ehSeuStory}
        />
        <Text style={estilos.rotuloUsuario} numberOfLines={1}>
          {item.nomeUsuario}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={estilos.conteiner}>
      <FlatList
        data={stories}
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
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
  },
  listaConteudo: {
    paddingHorizontal: 12,
  },
  itemConteiner: {
    alignItems: "center",
    marginHorizontal: 7,
    width: 76,
  },
  rotuloUsuario: {
    ...Tipografia.legenda,
    color: CoresInstagram.textoPrimario,
    marginTop: 5,
    textAlign: "center",
    width: 74,
  },
});
