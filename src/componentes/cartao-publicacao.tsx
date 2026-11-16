import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PublicacaoFeed } from "@/modelos/publicacao";
import { AvatarUsuario } from "./avatar-usuario";
import { CoresInstagram, Tipografia } from "@/constantes/sistema-design";
import { usarPublicacoes } from "@/contextos/contexto-publicacoes";

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
  const { alternarCurtida, alternarSalvo } = usarPublicacoes();
  const [estaMudo, setEstaMudo] = useState<boolean>(true);
  const [estaSeguindo, setEstaSeguindo] = useState<boolean>(false);

  const estaCurtido = publicacao.estaCurtido ?? false;
  const totalCurtidas = publicacao.curtidas;
  const estaSalvo = publicacao.estaSalvo ?? false;

  function lidarComCurtir() {
    alternarCurtida(publicacao.id);
  }

  function lidarComSalvar() {
    alternarSalvo(publicacao.id);
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
            {publicacao.audioNome ? (
              <View style={estilos.linhaAudio}>
                <Ionicons name="musical-notes" size={11} color={CoresInstagram.textoSuave} />
                <Text style={estilos.textoAudio} numberOfLines={1}>
                  {publicacao.audioNome}
                </Text>
              </View>
            ) : publicacao.localizacao ? (
              <Text style={estilos.textoLocalizacao}>{publicacao.localizacao}</Text>
            ) : null}
          </View>
        </View>

        <View style={estilos.acoesCabecalho}>
          {!publicacao.ehDoUsuarioAtual && (
            <TouchableOpacity
              style={[estilos.botaoSeguir, estaSeguindo && estilos.botaoSeguindo]}
              onPress={() => setEstaSeguindo((ant) => !ant)}
              activeOpacity={0.7}
            >
              <Text style={estilos.textoSeguir}>
                {estaSeguindo ? "Seguindo" : "Seguir"}
              </Text>
            </TouchableOpacity>
          )}
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

      {/* Faixa "Ver insights" nos posts do próprio usuário (fiel ao print post_perfil_aberto.jpeg) */}
      {publicacao.ehDoUsuarioAtual && (
        <TouchableOpacity style={estilos.faixaInsights} activeOpacity={0.7}>
          <Text style={estilos.textoInsights}>Ver insights</Text>
        </TouchableOpacity>
      )}

      {/* Barra de Ações (Curtir, Comentar, Repostar, Enviar, Salvar) */}
      <View style={estilos.barraAcoes}>
        <View style={estilos.acoesEsquerda}>
          <TouchableOpacity onPress={lidarComCurtir} style={estilos.botaoIconeComContador}>
            <Ionicons
              name={estaCurtido ? "heart" : "heart-outline"}
              size={26}
              color={estaCurtido ? CoresInstagram.vermelhoNotificacao : CoresInstagram.textoPrimario}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => aoPressionarComentarios?.(publicacao.id)}
            style={estilos.botaoIconeComContador}
          >
            <Ionicons name="chatbubble-outline" size={24} color={CoresInstagram.textoPrimario} />
            {publicacao.comentarios > 0 && (
              <Text style={estilos.contadorAcao}>{publicacao.comentarios}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botaoIconeComContador}>
            <Ionicons name="repeat-outline" size={25} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => aoPressionarCompartilhar?.(publicacao)}
            style={estilos.botaoIconeComContador}
          >
            <Ionicons name="paper-plane-outline" size={24} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={lidarComSalvar}>
          <Ionicons
            name={estaSalvo ? "bookmark" : "bookmark-outline"}
            size={24}
            color={CoresInstagram.textoPrimario}
          />
        </TouchableOpacity>
      </View>

      {/* Curtidas, Legenda e Link para Comentários */}
      <View style={estilos.rodape}>
        <Text style={estilos.textoCurtidas}>
          Curtido por <Text style={Tipografia.nomeUsuario}>{publicacao.curtidoPorDestaque || "aleisa2015"}</Text> e{" "}
          <Text style={Tipografia.nomeUsuario}>outras {totalCurtidas.toLocaleString("pt-BR")} pessoas</Text>
        </Text>

        {publicacao.legenda.length > 0 && (
          <View style={estilos.caixaLegenda}>
            <Text style={Tipografia.corpo}>
              <Text style={Tipografia.nomeUsuario}>{publicacao.autor.nomeUsuario} </Text>
              {publicacao.legenda}
            </Text>
          </View>
        )}

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
  textoLocalizacao: {
    color: CoresInstagram.textoPrimario,
    fontSize: 12,
    marginTop: 1,
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
  faixaInsights: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: CoresInstagram.bordaSuave,
  },
  textoInsights: {
    color: "#589BFF",
    fontSize: 14,
    fontWeight: "600",
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
  botaoIconeComContador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  contadorAcao: {
    color: CoresInstagram.textoPrimario,
    fontSize: 14,
    fontWeight: "700",
  },
  rodape: {
    paddingHorizontal: 12,
  },
  textoCurtidas: {
    ...Tipografia.corpo,
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
