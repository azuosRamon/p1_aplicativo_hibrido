import { ItemComentario } from "@/componentes/item-comentario";
import { CoresInstagram } from "@/constantes/sistema-design";
import { usarPublicacoes } from "@/contextos/contexto-publicacoes";
import { usuarioAtualMock } from "@/dados/dados-mockados";
import { ComentarioPublicacao } from "@/modelos/comentario";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EMOJIS_RAPIDOS = ["❤️", "🙌", "🔥", "👏", "😢", "😍", "😮", "😂"];

export default function TelaComentarios() {
  "use no memo";
  const navegador = useRouter();
  const parametros = useLocalSearchParams<{ idPublicacao?: string }>();
  const idPublicacao = parametros.idPublicacao || "perf_1";

  const {
    buscarComentarios,
    adicionarComentario,
    alternarCurtidaComentario,
  } = usarPublicacoes();

  const [listaComentarios, setListaComentarios] = useState<ComentarioPublicacao[]>([]);
  const [textoDigitado, setTextoDigitado] = useState<string>("");

  /**
   * 🎓 MÃO NA MASSA (ETAPA 20 - PARTE 1):
   * Quando a tela de comentários abre, busca todos os comentários desta publicação no SQLite.
   */
  useEffect(() => {
    async function carregarComentarios() {
      const lista = await buscarComentarios(idPublicacao);
      setListaComentarios(lista);
    }

    carregarComentarios();
  }, [idPublicacao, buscarComentarios]);

  /**
   * 🎓 MÃO NA MASSA (ETAPA 20 - PARTE 2):
   * Quando o usuário envia um novo comentário:
   * 1. Grava no banco SQLite chamando `await adicionarComentario(idPublicacao, textoDigitado)`.
   * 2. Atualiza a lista na tela e limpa o campo de texto.
   */
  async function lidarComEnviarComentario() {
    if (!textoDigitado.trim()) return;

    const novoComentario = await adicionarComentario(idPublicacao, textoDigitado);
    setListaComentarios((anterior) => [...anterior, novoComentario]);
    setTextoDigitado("");
  }

  async function lidarComCurtirComentario(comentario: ComentarioPublicacao) {
    const novoEstado = !comentario.estaCurtido;
    const novoTotal = novoEstado ? comentario.curtidas + 1 : Math.max(0, comentario.curtidas - 1);

    setListaComentarios((anterior) =>
      anterior.map((item) =>
        item.id === comentario.id
          ? { ...item, estaCurtido: novoEstado, curtidas: novoTotal }
          : item
      )
    );

    await alternarCurtidaComentario(comentario.id, novoEstado, novoTotal);
  }

  function adicionarEmojiAoTexto(emoji: string) {
    setTextoDigitado((atual) => `${atual}${emoji}`);
  }

  function preencherRespostaParaUsuario(nomeUsuario: string) {
    setTextoDigitado(`@${nomeUsuario} `);
  }

  return (
    <View style={estilos.fundoModal}>
      {/* Área superior escura que fecha o modal ao tocar */}
      <TouchableOpacity
        style={estilos.areaFecharSuperior}
        activeOpacity={1}
        onPress={() => navegador.back()}
      />

      <KeyboardAvoidingView
        style={estilos.folhaComentarios}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Puxador Superior e Cabeçalho */}
        <View style={estilos.cabecalhoFolha}>
          <View style={estilos.barraPuxador} />

          <View style={estilos.linhaTitulo}>
            <View style={estilos.espacadorCabecalho} />
            <Text style={estilos.tituloComentarios}>Comentários</Text>
            <TouchableOpacity style={estilos.botaoOpcoesCircular} activeOpacity={0.7}>
              <Ionicons name="ellipsis-horizontal" size={18} color={CoresInstagram.textoPrimario} />
            </TouchableOpacity>
          </View>

          <View style={estilos.linhaFiltro}>
            <Text style={estilos.textoFiltro}>Para você</Text>
            <Ionicons name="chevron-down" size={14} color={CoresInstagram.textoPrimario} />
          </View>
        </View>

        {/* Lista de Comentários do SQLite */}
        <FlatList
          data={listaComentarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemComentario
              comentario={item}
              aoAlternarCurtida={lidarComCurtirComentario}
              aoPressionarResponder={preencherRespostaParaUsuario}
            />
          )}
          ListEmptyComponent={
            <View style={estilos.estadoVazio}>
              <Text style={estilos.tituloVazio}>Ainda não há comentários</Text>
              <Text style={estilos.subtituloVazio}>Inicie a conversa.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.conteudoLista}
        />

        {/* Rodapé com Barra de Emojis e Campo de Inserir Comentário */}
        <SafeAreaView edges={["bottom"]} style={estilos.rodapeEntrada}>
          <View style={estilos.barraEmojis}>
            {EMOJIS_RAPIDOS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => adicionarEmojiAoTexto(emoji)}
                activeOpacity={0.7}
              >
                <Text style={estilos.itemEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={estilos.linhaEntrada}>
            <Image source={{ uri: usuarioAtualMock.fotoUrl }} style={estilos.avatarEntrada} />

            <View style={estilos.caixaInputArredondada}>
              <TextInput
                value={textoDigitado}
                onChangeText={setTextoDigitado}
                placeholder="Adicione um comentário..."
                placeholderTextColor={CoresInstagram.textoSecundario}
                style={estilos.inputComentario}
                returnKeyType="send"
                onSubmitEditing={lidarComEnviarComentario}
              />

              {textoDigitado.trim().length > 0 ? (
                <TouchableOpacity
                  onPress={lidarComEnviarComentario}
                  style={estilos.botaoEnviar}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <View style={estilos.iconesDecorativosInput}>
                  <Ionicons name="image-outline" size={22} color={CoresInstagram.textoPrimario} />
                  <View style={estilos.seloGif}>
                    <Text style={estilos.textoGif}>GIF</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  areaFecharSuperior: {
    height: "24%",
  },
  folhaComentarios: {
    height: "76%",
    backgroundColor: "#1C1F24",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },
  cabecalhoFolha: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  barraPuxador: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#5A606A",
    alignSelf: "center",
    marginBottom: 14,
  },
  linhaTitulo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  espacadorCabecalho: {
    width: 40,
  },
  tituloComentarios: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    fontWeight: "700",
  },
  botaoOpcoesCircular: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#262A32",
    alignItems: "center",
    justifyContent: "center",
  },
  linhaFiltro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  textoFiltro: {
    color: CoresInstagram.textoPrimario,
    fontSize: 13,
    fontWeight: "600",
  },
  conteudoLista: {
    paddingBottom: 20,
  },
  estadoVazio: {
    paddingVertical: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  tituloVazio: {
    color: CoresInstagram.textoPrimario,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtituloVazio: {
    color: CoresInstagram.textoSecundario,
    fontSize: 13,
  },
  rodapeEntrada: {
    borderTopWidth: 0.5,
    borderTopColor: "#2C313A",
    backgroundColor: "#14171A",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 14,
  },
  barraEmojis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  itemEmoji: {
    fontSize: 24,
  },
  linhaEntrada: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarEntrada: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  caixaInputArredondada: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2229",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2E343E",
    paddingHorizontal: 14,
    height: 44,
  },
  inputComentario: {
    flex: 1,
    color: CoresInstagram.textoPrimario,
    fontSize: 14,
    paddingVertical: 0,
  },
  botaoEnviar: {
    backgroundColor: "#4150F7",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  iconesDecorativosInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 8,
  },
  seloGif: {
    borderWidth: 1.5,
    borderColor: CoresInstagram.textoPrimario,
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  textoGif: {
    color: CoresInstagram.textoPrimario,
    fontSize: 10,
    fontWeight: "800",
  },
});

