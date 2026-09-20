import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ItemConversa } from "@/modelos/conversa";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";

export interface PropsItemConversa {
  conversa: ItemConversa;
  aoPressionar?: (idConversa: string) => void;
  aoPressionarCamera?: (idConversa: string) => void;
}

export function ItemConversaLinha({
  conversa,
  aoPressionar,
  aoPressionarCamera,
}: PropsItemConversa) {
  return (
    <TouchableOpacity
      style={estilos.conteiner}
      onPress={() => aoPressionar?.(conversa.id)}
      activeOpacity={0.7}
    >
      {/* Avatar com indicador de Online */}
      <View style={estilos.conteinerAvatar}>
        <Image source={{ uri: conversa.contato.fotoUrl }} style={estilos.avatar} />
        {conversa.estaOnline && <View style={estilos.pontoOnline} />}
      </View>

      {/* Textos da Conversa */}
      <View style={estilos.textosConteiner}>
        <Text style={Tipografia.nomeUsuario} numberOfLines={1}>
          {conversa.contato.nomeCompleto}
        </Text>
        <Text
          style={[
            estilos.subtitulo,
            conversa.possuiMensagemNaoLida ? estilos.textoNaoLido : estilos.textoLido,
          ]}
          numberOfLines={1}
        >
          {conversa.ultimaMensagem}
        </Text>
      </View>

      {/* Lado Direito: Badge Azul e Ação de Câmera */}
      <View style={estilos.acoesDireita}>
        {conversa.possuiMensagemNaoLida && <View style={estilos.pontoAzulNaoLido} />}
        <TouchableOpacity
          onPress={() => aoPressionarCamera?.(conversa.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="camera-outline"
            size={24}
            color={CoresInstagram.textoSuave}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: CoresInstagram.fundo,
  },
  conteinerAvatar: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  pontoOnline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: CoresInstagram.verdeOnline,
    borderWidth: 2,
    borderColor: CoresInstagram.fundo,
  },
  textosConteiner: {
    flex: 1,
    justifyContent: "center",
  },
  subtitulo: {
    fontSize: 13,
    marginTop: 3,
  },
  textoNaoLido: {
    color: CoresInstagram.textoPrimario,
    fontWeight: "600",
  },
  textoLido: {
    color: CoresInstagram.textoSecundario,
    fontWeight: "400",
  },
  acoesDireita: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginLeft: 8,
  },
  pontoAzulNaoLido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CoresInstagram.azulNaoLido,
  },
});
