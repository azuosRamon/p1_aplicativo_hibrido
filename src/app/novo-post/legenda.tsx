import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CoresInstagram } from "@/constantes/sistema-design";
import { usarPublicacoes } from "@/contextos/contexto-publicacoes";
import { publicacoesPerfilMock } from "@/dados/dados-mockados";

export default function TelaNovoPostLegenda() {
  const navegador = useRouter();
  const parametros = useLocalSearchParams<{ uriFoto?: string }>();
  const { criarPublicacao } = usarPublicacoes();

  const uriFotoFinal = parametros.uriFoto || publicacoesPerfilMock[0].midiaUrl;

  const [legenda, setLegenda] = useState<string>("");
  const [estaSalvando, setEstaSalvando] = useState<boolean>(false);

  /**
   * 🎓 MÃO NA MASSA (ETAPA 17):
   * Quando o usuário clica no botão "Compartilhar":
   * 1. Chama `await criarPublicacao(uriFotoFinal, legenda)` (que copia a foto física no FileSystem
   *    e faz o INSERT na tabela `publicacoes` do SQLite).
   * 2. Redireciona de volta para a tela principal do Feed (`navegador.replace("/(abas)")`).
   */
  async function lidarComCompartilhar() {
    if (estaSalvando) return;
    setEstaSalvando(true);

    try {
      await criarPublicacao(uriFotoFinal, legenda);
      navegador.replace("/(abas)");
    } finally {
      setEstaSalvando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={estilos.flexivel}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Barra de Topo: (<) | Novo post */}
        <View style={estilos.barraTopo}>
          <TouchableOpacity
            style={estilos.botaoVoltarCircular}
            onPress={() => navegador.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="chevron-back" size={24} color={CoresInstagram.textoPrimario} />
          </TouchableOpacity>

          <Text style={estilos.tituloTopo}>Novo post</Text>

          <View style={estilos.espacadorDireito} />
        </View>

        {/* Conteúdo Central: Miniatura da Foto + Campo de Legenda */}
        <ScrollView
          style={estilos.flexivel}
          contentContainerStyle={estilos.conteudoScroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.conteinerMiniatura}>
            <Image source={{ uri: uriFotoFinal }} style={estilos.imagemMiniatura} />
          </View>

          <TextInput
            value={legenda}
            onChangeText={setLegenda}
            placeholder="Adicione uma legenda..."
            placeholderTextColor={CoresInstagram.textoSecundario}
            style={estilos.campoLegenda}
            multiline
            autoFocus={false}
          />
        </ScrollView>

        {/* Botão Inferior Fixo: Compartilhar */}
        <View style={estilos.rodapeFixo}>
          <TouchableOpacity
            style={estilos.botaoCompartilhar}
            onPress={lidarComCompartilhar}
            disabled={estaSalvando}
            activeOpacity={0.85}
          >
            {estaSalvando ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={estilos.textoCompartilhar}>Compartilhar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: CoresInstagram.fundo,
  },
  flexivel: {
    flex: 1,
  },
  barraTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  botaoVoltarCircular: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E232A",
    alignItems: "center",
    justifyContent: "center",
  },
  tituloTopo: {
    color: CoresInstagram.textoPrimario,
    fontSize: 18,
    fontWeight: "700",
  },
  espacadorDireito: {
    width: 42,
  },
  conteudoScroll: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },
  conteinerMiniatura: {
    alignItems: "center",
    marginBottom: 28,
  },
  imagemMiniatura: {
    width: 240,
    height: 220,
    borderRadius: 16,
    backgroundColor: CoresInstagram.fundoSecundario,
  },
  campoLegenda: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  rodapeFixo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: CoresInstagram.bordaSuave,
    backgroundColor: CoresInstagram.fundo,
  },
  botaoCompartilhar: {
    backgroundColor: "#4150F7",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textoCompartilhar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

