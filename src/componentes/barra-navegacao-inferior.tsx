import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CoresInstagram, RaiosBorda } from "@/constantes/sistema-design";
import { usuarioAtualMock } from "@/dados/dados-mockados";

export interface PropsBarraNavegacaoInferior {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  navigation: {
    navigate: (nomeRota: string) => void;
  };
}

export function BarraNavegacaoInferior({ state, navigation }: PropsBarraNavegacaoInferior) {
  // Mapeamento das abas
  const abas = [
    { nome: "index", iconeAtivo: "home", iconeInativo: "home-outline" },
    { nome: "reels", iconeAtivo: "play-circle", iconeInativo: "play-circle-outline" },
    { nome: "mensagens", iconeAtivo: "paper-plane", iconeInativo: "paper-plane-outline", possuiBadge: true },
    { nome: "explorar", iconeAtivo: "search", iconeInativo: "search-outline" },
    { nome: "perfil", ehAvatar: true },
  ];

  const rotaAtual = state.routes[state.index]?.name;

  function navegarParaAba(nomeAba: string) {
    if (nomeAba === "reels") {
      navigation.navigate("explorar");
      return;
    }
    navigation.navigate(nomeAba);
  }

  return (
    <View style={estilos.conteinerExterno} pointerEvents="box-none">
      <View style={estilos.capsula}>
        {abas.map((aba, indice) => {
          const estaAtiva =
            rotaAtual === aba.nome || (aba.nome === "index" && rotaAtual === "index");

          return (
            <TouchableOpacity
              key={`aba-${indice}`}
              style={[estilos.botaoAba, estaAtiva && estilos.abaAtivaPill]}
              onPress={() => navegarParaAba(aba.nome)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: estaAtiva }}
            >
              {aba.ehAvatar ? (
                <View style={[estilos.conteinerAvatar, estaAtiva && estilos.avatarAtivoBorda]}>
                  <Image source={{ uri: usuarioAtualMock.fotoUrl }} style={estilos.avatar} />
                  <View style={estilos.pontoNotificacaoAvatar} />
                </View>
              ) : (
                <View style={estilos.iconeComBadge}>
                  <Ionicons
                    name={(estaAtiva ? aba.iconeAtivo : aba.iconeInativo) as any}
                    size={24}
                    color={CoresInstagram.textoPrimario}
                  />
                  {aba.possuiBadge && <View style={estilos.pontoVermelho} />}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteinerExterno: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  capsula: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CoresInstagram.fundoBarraFlutuante,
    borderRadius: RaiosBorda.pilula,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: CoresInstagram.bordaSuave,
    width: "88%",
    maxWidth: 380,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  botaoAba: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  abaAtivaPill: {
    backgroundColor: CoresInstagram.fundoAbaSelecionada,
  },
  iconeComBadge: {
    position: "relative",
  },
  pontoVermelho: {
    position: "absolute",
    top: -1,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CoresInstagram.vermelhoNotificacao,
  },
  conteinerAvatar: {
    position: "relative",
    borderRadius: 14,
    padding: 1,
  },
  avatarAtivoBorda: {
    borderWidth: 1.5,
    borderColor: CoresInstagram.textoPrimario,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  pontoNotificacaoAvatar: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CoresInstagram.vermelhoNotificacao,
    borderWidth: 1.5,
    borderColor: CoresInstagram.fundo,
  },
});
