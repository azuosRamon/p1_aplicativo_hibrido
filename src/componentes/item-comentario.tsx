import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComentarioPublicacao } from "@/modelos/comentario";
import { AvatarUsuario } from "./avatar-usuario";
import { CoresInstagram } from "@/constantes/sistema-design";

export interface PropsItemComentario {
  comentario: ComentarioPublicacao;
  aoAlternarCurtida: (comentario: ComentarioPublicacao) => void;
  aoPressionarResponder?: (nomeUsuario: string) => void;
}

export function ItemComentario({
  comentario,
  aoAlternarCurtida,
  aoPressionarResponder,
}: PropsItemComentario) {
  return (
    <View style={estilos.conteiner}>
      <AvatarUsuario
        fotoUrl={comentario.fotoUsuarioUrl}
        tamanho={38}
        possuiStory={true}
      />

      <View style={estilos.colunaCentral}>
        <View style={estilos.linhaCabecalho}>
          <Text style={estilos.nomeUsuario}>{comentario.nomeUsuario}</Text>
          <Text style={estilos.tempoDecorrido}>{comentario.tempoDecorrido}</Text>
          {comentario.curtidoPeloAutor && (
            <View style={estilos.seloAutor}>
              <Text style={estilos.pontoSeparador}>•</Text>
              <Ionicons name="heart" size={11} color={CoresInstagram.vermelhoNotificacao} />
              <Text style={estilos.textoPeloAutor}>pelo autor</Text>
            </View>
          )}
        </View>

        <Text style={estilos.textoComentario}>{comentario.texto}</Text>

        <View style={estilos.linhaAcoes}>
          <TouchableOpacity
            onPress={() => aoPressionarResponder?.(comentario.nomeUsuario)}
            activeOpacity={0.7}
          >
            <Text style={estilos.textoAcao}>Responder</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={estilos.textoAcao}>Responder com um reel</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={estilos.textoAcao}>Ocultar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={estilos.colunaCurtida}>
        <TouchableOpacity
          onPress={() => aoAlternarCurtida(comentario)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={comentario.estaCurtido ? "heart" : "heart-outline"}
            size={18}
            color={
              comentario.estaCurtido
                ? CoresInstagram.vermelhoNotificacao
                : CoresInstagram.textoSecundario
            }
          />
        </TouchableOpacity>
        {comentario.curtidas > 0 && (
          <Text style={estilos.contadorCurtidas}>{comentario.curtidas}</Text>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  colunaCentral: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  linhaCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  nomeUsuario: {
    color: CoresInstagram.textoPrimario,
    fontSize: 13,
    fontWeight: "700",
  },
  tempoDecorrido: {
    color: CoresInstagram.textoSecundario,
    fontSize: 13,
  },
  seloAutor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pontoSeparador: {
    color: CoresInstagram.textoSecundario,
    fontSize: 12,
  },
  textoPeloAutor: {
    color: CoresInstagram.textoSecundario,
    fontSize: 12,
  },
  textoComentario: {
    color: CoresInstagram.textoPrimario,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 6,
  },
  linhaAcoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  textoAcao: {
    color: CoresInstagram.textoSecundario,
    fontSize: 12,
    fontWeight: "600",
  },
  colunaCurtida: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    minWidth: 24,
  },
  contadorCurtidas: {
    color: CoresInstagram.textoSecundario,
    fontSize: 11,
    marginTop: 3,
    fontWeight: "600",
  },
});
