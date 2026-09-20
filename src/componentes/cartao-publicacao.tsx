import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PublicacaoFeed } from "@/modelos/publicacao";
import { AvatarUsuario } from "./avatar-usuario";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";

export interface PropsCartaoPublicacao {
  publicacao: PublicacaoFeed;
  aoPressionarAutor?: (idAutor: string) => void;
  aoPressionarComentarios?: (idPublicacao: string) => void;
  aoPressionarCompartilhar?: (publicacao: PublicacaoFeed) => void;
}

export function CartaoPublicacao({
  publicacao,
  aoPressionarAutor,
  aoPressionarComentarios,
  aoPressionarCompartilhar,
}: PropsCartaoPublicacao) {
  const [estaCurtido, setEstaCurtido] = useState<boolean>(publicacao.estaCurtido ?? false);
  const [totalCurtidas, setTotalCurtidas] = useState<number>(publicacao.curtidas);
  const [estaSalvo, setEstaSalvo] = useState<boolean>(publicacao.estaSalvo ?? false);
  const [estaMudo, setEstaMudo] = useState<boolean>(true);
  const [estaSeguindo, setEstaSeguindo] = useState<boolean>(false);

  function alternarCurtida() {
    if (estaCurtido) {
      setEstaCurtido(false);
      setTotalCurtidas((anterior) => anterior - 1);
    } else {
      setEstaCurtido(true);
      setTotalCurtidas((anterior) => anterior + 1);
    }
  }

  function alternarSalvo() {
    setEstaSalvo((anterior) => !anterior);
  }

  return (
    <View style={estilos.cartao}>
      {/* Cabeçalho do Post */}
      <View style={estilos.cabecalho}>
        <View style={estilos.autorInfo}>
          <AvatarUsuario
            fotoUrl={publicacao.autor.fotoUrl}
            tamanho={36}
            aoPressionar={() => aoPressionarAutor?.(publicacao.autor.id)}
          />
          <View style={estilos.textosAutor}>
            <View style={estilos.linhaNome}>
              <TouchableOpacity onPress={() => aoPressionarAutor?.(publicacao.autor.id)}>
                <Text style={Tipografia.nomeUsuario}>{publicacao.autor.nomeUsuario}</Text>
              </TouchableOpacity>
              {publicacao.outrasPessoasMarcadas && (
                <Text style={estilos.marcados} numberOfLines={1}>
                  {" "}• {publicacao.outrasPessoasMarcadas}
                </Text>
              )}
            </View>
            {publicacao.audioNome && (
              <View style={estilos.linhaAudio}>
                <Ionicons name="musical-notes" size={11} color={CoresInstagram.textoSuave} />
                <Text style={estilos.textoAudio} numberOfLines={1}>
                  {publicacao.audioNome}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={estilos.acoesCabecalho}>
          <TouchableOpacity
            style={[estilos.botaoSeguir, estaSeguindo && estilos.botaoSeguindo]}
            onPress={() => setEstaSeguindo((ant) => !ant)}
            activeOpacity={0.7}
          >
            <Text style={estilos.textoSeguir}>
              {estaSeguindo ? "Seguindo" : "Seguir"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="ellipsis-horizontal" size={18} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mídia Principal */}
      <View style={estilos.conteinerMidia}>
        <Image source={{ uri: publicacao.midiaUrl }} style={estilos.imagemMidia} />
        {publicacao.textoSobreposto && (
          <View style={estilos.caixaTextoSobreposto}>
            <Text style={estilos.textoSobreposto}>{publicacao.textoSobreposto}</Text>
          </View>
        )}
        <TouchableOpacity
          style={estilos.botaoMudo}
          onPress={() => setEstaMudo((ant) => !ant)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={estaMudo ? "volume-mute" : "volume-high"}
            size={16}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Barra de Ações (Curtir, Comentar, Enviar, Salvar) */}
      <View style={estilos.barraAcoes}>
        <View style={estilos.acoesEsquerda}>
          <TouchableOpacity onPress={alternarCurtida} style={estilos.botaoIcone}>
            <Ionicons
              name={estaCurtido ? "heart" : "heart-outline"}
              size={26}
              color={estaCurtido ? CoresInstagram.vermelhoNotificacao : CoresInstagram.textoPrimario}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => aoPressionarComentarios?.(publicacao.id)}
            style={estilos.botaoIcone}
          >
            <Ionicons name="chatbubble-outline" size={24} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => aoPressionarCompartilhar?.(publicacao)}
            style={estilos.botaoIcone}
          >
            <Ionicons name="paper-plane-outline" size={24} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={alternarSalvo}>
          <Ionicons
            name={estaSalvo ? "bookmark" : "bookmark-outline"}
            size={24}
            color={CoresInstagram.textoPrimario}
          />
        </TouchableOpacity>
      </View>

      {/* Curtidas e Legenda */}
      <View style={estilos.rodape}>
        <Text style={estilos.textoCurtidas}>
          {totalCurtidas.toLocaleString("pt-BR")} curtidas
        </Text>
        <View style={estilos.caixaLegenda}>
          <Text style={Tipografia.corpo}>
            <Text style={Tipografia.nomeUsuario}>{publicacao.autor.nomeUsuario} </Text>
            {publicacao.legenda}
          </Text>
        </View>
        {publicacao.comentarios > 0 && (
          <TouchableOpacity
            onPress={() => aoPressionarComentarios?.(publicacao.id)}
            style={estilos.botaoVerComentarios}
          >
            <Text style={Tipografia.subtitulo}>
              Ver todos os {publicacao.comentarios} comentários
            </Text>
          </TouchableOpacity>
        )}
        <Text style={estilos.textoTempo}>{publicacao.criadoEm}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: CoresInstagram.fundo,
    marginBottom: 16,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  autorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textosAutor: {
    marginLeft: 10,
    flex: 1,
  },
  linhaNome: {
    flexDirection: "row",
    alignItems: "center",
  },
  marcados: {
    ...Tipografia.legenda,
    flex: 1,
  },
  linhaAudio: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  textoAudio: {
    ...Tipografia.legenda,
    marginLeft: 4,
    fontSize: 11,
  },
  acoesCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  botaoSeguir: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CoresInstagram.bordaDestaque,
  },
  botaoSeguindo: {
    backgroundColor: CoresInstagram.fundoEntrada,
  },
  textoSeguir: {
    color: CoresInstagram.textoPrimario,
    fontSize: 13,
    fontWeight: "600",
  },
  conteinerMidia: {
    position: "relative",
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  imagemMidia: {
    width: "100%",
    height: "100%",
  },
  caixaTextoSobreposto: {
    position: "absolute",
    top: 36,
    left: 18,
    right: 18,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 12,
    borderRadius: 10,
  },
  textoSobreposto: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
  },
  botaoMudo: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  barraAcoes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  acoesEsquerda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  botaoIcone: {
    alignItems: "center",
    justifyContent: "center",
  },
  rodape: {
    paddingHorizontal: 12,
  },
  textoCurtidas: {
    ...Tipografia.nomeUsuario,
    marginBottom: 6,
  },
  caixaLegenda: {
    marginBottom: 6,
  },
  botaoVerComentarios: {
    marginBottom: 4,
  },
  textoTempo: {
    ...Tipografia.legenda,
    fontSize: 11,
    marginTop: 2,
  },
});
