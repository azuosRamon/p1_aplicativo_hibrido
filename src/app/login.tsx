import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { autenticarUsuarioNoBanco } from "@/servicos/banco-dados/repositorio-usuarios";
import { buscarPreferenciaTexto } from "@/servicos/servico-preferencias";
import { validarForcaSenha } from "@/utilitarios/seguranca-senha";

export default function TelaLogin() {
  "use no memo";
  const navegador = useRouter();

  const [identificador, setIdentificador] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [estaEntrando, setEstaEntrando] = useState<boolean>(false);

  // Recupera o último usuário logado salvo no AsyncStorage
  useEffect(() => {
    async function carregarUltimoUsuario() {
      const salvo = await buscarPreferenciaTexto("@instagram_p2:ultimo_usuario_login");
      if (salvo) {
        setIdentificador(salvo);
      }
    }
    carregarUltimoUsuario();
  }, []);

  async function lidarComLogin() {
    setMensagemErro(null);

    if (!identificador.trim()) {
      setMensagemErro("Informe seu número de celular, nome de usuário ou email.");
      return;
    }

    const validacao = validarForcaSenha(senha);
    if (!validacao.ehValida) {
      setMensagemErro(validacao.mensagemErro);
      return;
    }

    setEstaEntrando(true);
    try {
      await autenticarUsuarioNoBanco(identificador, senha);
      navegador.replace("/(abas)");
    } catch (erro: any) {
      setMensagemErro(erro?.message || "Não foi possível entrar. Verifique seus dados.");
    } finally {
      setEstaEntrando(false);
    }
  }

  function irParaCadastro() {
    navegador.push("/cadastro" as any);
  }

  return (
    <SafeAreaView style={estilos.areaSegura} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={estilos.flexivel}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudoScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Bloco Principal Centralizado Fiel ao Print de Login */}
          <View style={estilos.blocoCentral}>
            <Text style={estilos.tituloEntrar}>Entrar no Instagram</Text>

            {/* Campo: Número de celular, nome de usuário ou email */}
            <View style={estilos.caixaCampo}>
              <Text style={estilos.rotuloFlutuante}>
                Número de celular, nome de usuário ou email
              </Text>
              <TextInput
                value={identificador}
                onChangeText={(texto) => {
                  setIdentificador(texto);
                  setMensagemErro(null);
                }}
                placeholder="ex: ramon.dev"
                placeholderTextColor="#5C6470"
                style={estilos.inputTexto}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Campo: Senha */}
            <View style={estilos.caixaCampoSenha}>
              <View style={estilos.flexivel}>
                <Text style={estilos.rotuloFlutuante}>Senha</Text>
                <TextInput
                  value={senha}
                  onChangeText={(texto) => {
                    setSenha(texto);
                    setMensagemErro(null);
                  }}
                  placeholder="Ex: Ramon$123"
                  placeholderTextColor="#5C6470"
                  style={estilos.inputTexto}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                onPress={() => setMostrarSenha((ant) => !ant)}
                style={estilos.botaoOlho}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9AA2AE"
                />
              </TouchableOpacity>
            </View>

            {/* Mensagem de Erro de Validação ou Autenticação */}
            {mensagemErro && (
              <View style={estilos.caixaErro}>
                <Ionicons name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={estilos.textoErro}>{mensagemErro}</Text>
              </View>
            )}

            {/* Botão Principal: Entrar */}
            <TouchableOpacity
              style={[
                estilos.botaoEntrar,
                (!identificador.trim() || !senha.trim()) && estilos.botaoEntrarDesativado,
              ]}
              onPress={lidarComLogin}
              disabled={estaEntrando}
              activeOpacity={0.85}
            >
              {estaEntrando ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={estilos.textoBotaoEntrar}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Link: Esqueceu a senha? */}
            <TouchableOpacity
              style={estilos.botaoEsqueceuSenha}
              onPress={() =>
                setMensagemErro(
                  "Dica de teste: usuário 'ramon.dev' e senha forte 'Ramon$123' (ou crie uma nova conta abaixo)."
                )
              }
              activeOpacity={0.7}
            >
              <Text style={estilos.textoEsqueceuSenha}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé com Entrar com o Facebook, Criar nova conta e Meta */}
          <View style={estilos.blocoInferior}>
            <TouchableOpacity
              style={estilos.botaoFacebook}
              onPress={() => navegador.replace("/(abas)")}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={18} color="#1877F2" />
              <Text style={estilos.textoBotaoFacebook}>Entrar com o Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoCriarConta}
              onPress={irParaCadastro}
              activeOpacity={0.8}
            >
              <Text style={estilos.textoCriarConta}>Criar nova conta</Text>
            </TouchableOpacity>

            <View style={estilos.rodapeMeta}>
              <Ionicons name="infinite-outline" size={18} color="#DCE1E7" />
              <Text style={estilos.textoMeta}>Meta</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: "#15181C",
  },
  flexivel: {
    flex: 1,
  },
  conteudoScroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  blocoCentral: {
    width: "100%",
  },
  tituloEntrar: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 22,
  },
  caixaCampo: {
    backgroundColor: "#15181C",
    borderWidth: 1,
    borderColor: "#3A424D",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 14,
  },
  caixaCampoSenha: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#15181C",
    borderWidth: 1,
    borderColor: "#3A424D",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 16,
  },
  rotuloFlutuante: {
    color: "#9AA2AE",
    fontSize: 12,
    marginBottom: 2,
  },
  inputTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 2,
  },
  botaoOlho: {
    paddingLeft: 10,
  },
  caixaErro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.35)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  textoErro: {
    flex: 1,
    color: "#FF8787",
    fontSize: 13,
    lineHeight: 18,
  },
  botaoEntrar: {
    backgroundColor: "#0064E0",
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  botaoEntrarDesativado: {
    backgroundColor: "#12386B",
  },
  textoBotaoEntrar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  botaoEsqueceuSenha: {
    alignItems: "center",
    paddingVertical: 18,
  },
  textoEsqueceuSenha: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  blocoInferior: {
    width: "100%",
    marginTop: 36,
  },
  botaoFacebook: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#22262C",
    height: 46,
    borderRadius: 23,
    marginBottom: 12,
  },
  textoBotaoFacebook: {
    color: "#DCE1E7",
    fontSize: 14,
    fontWeight: "600",
  },
  botaoCriarConta: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#2D88FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  textoCriarConta: {
    color: "#3EA6FF",
    fontSize: 14,
    fontWeight: "600",
  },
  rodapeMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  textoMeta: {
    color: "#DCE1E7",
    fontSize: 15,
    fontWeight: "600",
  },
});
