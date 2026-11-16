import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CartaoPublicacao } from "@/componentes/cartao-publicacao";
import { usarPublicacoes } from "@/contextos/contexto-publicacoes";
import { usuarioAtualMock } from "@/dados/dados-mockados";
import { CoresInstagram } from "@/constantes/sistema-design";

export default function TelaPublicacoesPerfil() {
  "use no memo";
  const navegador = useRouter();
  const parametros = useLocalSearchParams<{ idPublicacao?: string }>();
  const { publicacoesDoUsuario } = usarPublicacoes();

  const referenciaScroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const posicoesYPorId = useRef<Record<string, number>>({});
  const jaPosicionouScroll = useRef<boolean>(false);

  useEffect(() => {
    jaPosicionouScroll.current = false;
  }, [parametros.idPublicacao]);

  function registrarPosicaoItem(idPost: string, evento: LayoutChangeEvent) {
    const posicaoY = evento.nativeEvent.layout.y;
    posicoesYPorId.current[idPost] = posicaoY;

    if (
      !jaPosicionouScroll.current &&
      parametros.idPublicacao &&
      idPost === parametros.idPublicacao
    ) {
      jaPosicionouScroll.current = true;
      setTimeout(() => {
        referenciaScroll.current?.scrollTo({ y: posicaoY, animated: false });
      }, 30);
    }
  }

  function abrirComentarios(idPublicacao: string) {
    navegador.push({
      pathname: "/comentarios" as any,
      params: { idPublicacao },
    });
  }

  function irParaDirect() {
    navegador.push("/(abas)/mensagens");
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top"]}>
      {/* Cabeçalho Fiel ao Print post_perfil_aberto.jpeg: (<) | Posts / usuario */}
      <View style={estilos.barraTopo}>
        <TouchableOpacity
          style={estilos.botaoVoltarCircular}
          onPress={() => navegador.back()}
          activeOpacity={0.75}
        >
          <Ionicons name="chevron-back" size={24} color={CoresInstagram.textoPrimario} />
        </TouchableOpacity>

        <View style={estilos.blocoTitulos}>
          <Text style={estilos.tituloPrincipal}>Posts</Text>
          <Text style={estilos.subtituloUsuario}>{usuarioAtualMock.nomeUsuario}</Text>
        </View>

        <View style={estilos.espacadorDireito} />
      </View>

      {/* Scroll Mantendo a Ordem Original das Publicações do Perfil */}
      <ScrollView
        ref={referenciaScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoLista}
      >
        {publicacoesDoUsuario.map((item) => (
          <View
            key={item.id}
            onLayout={(evento) => registrarPosicaoItem(item.id, evento)}
          >
            <CartaoPublicacao
              publicacao={item}
              aoPressionarComentarios={abrirComentarios}
              aoPressionarCompartilhar={irParaDirect}
            />
          </View>
        ))}
      </ScrollView>
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
  blocoTitulos: {
    alignItems: "center",
    justifyContent: "center",
  },
  tituloPrincipal: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    fontWeight: "700",
  },
  subtituloUsuario: {
    color: CoresInstagram.textoSecundario,
    fontSize: 12,
    marginTop: 1,
  },
  espacadorDireito: {
    width: 40,
  },
  conteudoLista: {
    paddingBottom: 48,
  },
});
