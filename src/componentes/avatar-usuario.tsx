import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CoresInstagram } from "@/constantes/sistema-design";

export interface PropsAvatarUsuario {
  fotoUrl: string;
  tamanho?: number;
  possuiStory?: boolean;
  storyVisto?: boolean;
  ehSeuStory?: boolean;
  aoPressionar?: () => void;
}

export function AvatarUsuario({
  fotoUrl,
  tamanho = 56,
  possuiStory = false,
  storyVisto = false,
  ehSeuStory = false,
  aoPressionar,
}: PropsAvatarUsuario) {
  const espessuraAnel = 2.5;
  const espacoBorda = 2.5;
  const tamanhoGradiente = tamanho + (espessuraAnel + espacoBorda) * 2;

  const elementoFoto = fotoUrl ? (
    <Image
      source={{ uri: fotoUrl }}
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
      }}
    />
  ) : (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: "#262B33",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="person" size={Math.round(tamanho * 0.54)} color="#8E96A3" />
    </View>
  );

  const conteudoImagem = (
    <View
      style={[
        estilos.bordaEspaco,
        {
          width: tamanho + espacoBorda * 2,
          height: tamanho + espacoBorda * 2,
          borderRadius: (tamanho + espacoBorda * 2) / 2,
        },
      ]}
    >
      {elementoFoto}
      {ehSeuStory && (
        <View style={estilos.badgeAdicionar}>
          <Ionicons name="add" size={14} color="#FFFFFF" />
        </View>
      )}
    </View>
  );

  if (possuiStory) {
    const coresGradiente = storyVisto
      ? CoresInstagram.gradienteHistoriasVisto
      : CoresInstagram.gradienteStories;

    return (
      <TouchableOpacity
        onPress={aoPressionar}
        disabled={!aoPressionar}
        activeOpacity={0.8}
        style={estilos.conteiner}
      >
        <LinearGradient
          colors={coresGradiente}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            estilos.anelGradiente,
            {
              width: tamanhoGradiente,
              height: tamanhoGradiente,
              borderRadius: tamanhoGradiente / 2,
            },
          ]}
        >
          {conteudoImagem}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={aoPressionar}
      disabled={!aoPressionar}
      activeOpacity={0.8}
      style={estilos.conteiner}
    >
      <View
        style={{
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          position: "relative",
        }}
      >
        {elementoFoto}
        {ehSeuStory && (
          <View style={estilos.badgeAdicionar}>
            <Ionicons name="add" size={14} color="#FFFFFF" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    alignItems: "center",
    justifyContent: "center",
  },
  anelGradiente: {
    alignItems: "center",
    justifyContent: "center",
  },
  bordaEspaco: {
    backgroundColor: CoresInstagram.fundo,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeAdicionar: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: CoresInstagram.azulInstagram,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: CoresInstagram.fundo,
  },
});
