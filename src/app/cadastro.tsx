import React, { useState } from "react";
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
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cadastrarNovoUsuarioNoBanco } from "@/servicos/banco-dados/repositorio-usuarios";
import { validarForcaSenha } from "@/utilitarios/seguranca-senha";

const LISTA_DIAS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const LISTA_MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];
const LISTA_ANOS = Array.from({ length: 70 }, (_, i) => String(2012 - i));

type TipoSeletorData = "dia" | "mes" | "ano" | null;

export default function TelaCadastro() {
  "use no memo";
  const navegador = useRouter();

  const [contato, setContato] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [dia, setDia] = useState<string>("");
  const [mes, setMes] = useState<string>("");
  const [ano, setAno] = useState<string>("");
  const [nomeCompleto, setNomeCompleto] = useState<string>("");
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [seletorAtivo, setSeletorAtivo] = useState<TipoSeletorData>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [estaCadastrando, setEstaCadastrando] = useState<boolean>(false);

  const analiseSenha = validarForcaSenha(senha);

  async function lidarComEnviarCadastro() {
    setMensagemErro(null);

    if (!contato.trim()) {
      setMensagemErro("Preencha o número de celular ou email.");
      return;
    }

    if (!analiseSenha.ehValida) {
      setMensagemErro(analiseSenha.mensagemErro);
      return;
    }

    if (!dia || !mes || !ano) {
      setMensagemErro("Selecione sua data de nascimento completa (Dia, Mês e Ano).");
      return;
    }

    if (!nomeCompleto.trim()) {
      setMensagemErro("Preencha seu nome completo.");
      return;
    }

    if (!nomeUsuario.trim()) {
      setMensagemErro("Escolha um nome de usuário.");
      return;
    }

    setEstaCadastrando(true);
    try {
      await cadastrarNovoUsuarioNoBanco({
        contatoEmailCelular: contato,
        senhaPura: senha,
        dataNascimento: `${dia}/${mes}/${ano}`,
        nomeCompleto,
        nomeUsuario,
      });

      navegador.replace("/(abas)");
    } catch (erro: any) {
      setMensagemErro(erro?.message || "Erro ao realizar cadastro no banco de dados.");
    } finally {
      setEstaCadastrando(false);
    }
  }

  function obterOpcoesSeletor(): string[] {
    if (seletorAtivo === "dia") return LISTA_DIAS;
    if (seletorAtivo === "mes") return LISTA_MESES;
    if (seletorAtivo === "ano") return LISTA_ANOS;
    return [];
  }

  function selecionarValorData(valor: string) {
    if (seletorAtivo === "dia") setDia(valor);
    if (seletorAtivo === "mes") setMes(valor);
    if (seletorAtivo === "ano") setAno(valor);
    setSeletorAtivo(null);
  }

  function renderizarRequisitoSenha(atendido: boolean, texto: string) {
    return (
      <View style={estilos.itemRequisito}>
        <Ionicons
          name={atendido ? "checkmark-circle" : "ellipse-outline"}
          size={14}
          color={atendido ? "#2ECC71" : "#8E96A3"}
        />
        <Text
          style={[
            estilos.textoRequisito,
            atendido && estilos.textoRequisitoAtendido,
          ]}
        >
          {texto}
        </Text>
      </View>
    );
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
          {/* Cabeçalho Meta + Título Principal Fiel ao Print 2 */}
          <View style={estilos.linhaMetaTopo}>
            <Ionicons name="infinite-outline" size={20} color="#DCE1E7" />
            <Text style={estilos.textoMetaTopo}>Meta</Text>
          </View>

          <Text style={estilos.tituloPrincipal}>
            Comece a usar o Instagram com uma Conta Meta
          </Text>

          <Text style={estilos.subtituloPrincipal}>
            Uma Conta Meta dá acesso a várias tecnologias da Meta (como o Instagram) de forma fácil e segura.
          </Text>

          {/* Número de celular ou email */}
          <Text style={estilos.rotuloSecao}>Número de celular ou email</Text>
          <View style={estilos.caixaInput}>
            <TextInput
              value={contato}
              onChangeText={(t) => {
                setContato(t);
                setMensagemErro(null);
              }}
              placeholder="Número de celular ou email"
              placeholderTextColor="#7D8592"
              style={estilos.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={estilos.textoAjudaContato}>
            Você poderá receber notificações enviadas por nós.{" "}
            <Text style={estilos.linkAzul}>
              Saiba por que pedimos suas informações de contato
            </Text>
          </Text>

          {/* Senha com Hash + Salt e Validação Forte (Mm$3 e >= 8 caracteres) */}
          <Text style={estilos.rotuloSecao}>Senha</Text>
          <View style={estilos.caixaInputSenha}>
            <TextInput
              value={senha}
              onChangeText={(t) => {
                setSenha(t);
                setMensagemErro(null);
              }}
              placeholder="Senha (ex: Minha$123)"
              placeholderTextColor="#7D8592"
              style={estilos.input}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha((ant) => !ant)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9AA2AE"
              />
            </TouchableOpacity>
          </View>

          {/* Checklist Visual da Senha Forte (Mm$3 e 8+ caracteres) */}
          <View style={estilos.painelRequisitosSenha}>
            {renderizarRequisitoSenha(analiseSenha.possuiMinimoOitoCaracteres, "Mínimo 8 caracteres")}
            {renderizarRequisitoSenha(analiseSenha.possuiLetraMaiuscula, "Letra maiúscula (M)")}
            {renderizarRequisitoSenha(analiseSenha.possuiLetraMinuscula, "Letra minúscula (m)")}
            {renderizarRequisitoSenha(analiseSenha.possuiCaractereEspecial, "Caractere especial ($)")}
            {renderizarRequisitoSenha(analiseSenha.possuiNumero, "Número (3)")}
          </View>

          {/* Data de nascimento: Dia | Mês | Ano */}
          <View style={estilos.linhaRotuloData}>
            <Text style={estilos.rotuloSecaoSemMargem}>Data de nascimento</Text>
            <Ionicons name="help-circle-outline" size={18} color="#DCE1E7" />
          </View>

          <View style={estilos.linhaSeletoresData}>
            <TouchableOpacity
              style={estilos.caixaSeletorData}
              onPress={() => setSeletorAtivo("dia")}
              activeOpacity={0.75}
            >
              <Text style={[estilos.textoSeletorData, Boolean(dia) && estilos.textoSeletorPreenchido]}>
                {dia || "Dia"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#DCE1E7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.caixaSeletorData}
              onPress={() => setSeletorAtivo("mes")}
              activeOpacity={0.75}
            >
              <Text style={[estilos.textoSeletorData, Boolean(mes) && estilos.textoSeletorPreenchido]}>
                {mes || "Mês"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#DCE1E7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.caixaSeletorData}
              onPress={() => setSeletorAtivo("ano")}
              activeOpacity={0.75}
            >
              <Text style={[estilos.textoSeletorData, Boolean(ano) && estilos.textoSeletorPreenchido]}>
                {ano || "Ano"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#DCE1E7" />
            </TouchableOpacity>
          </View>

          {/* Nome Completo */}
          <Text style={estilos.rotuloSecao}>Nome</Text>
          <View style={estilos.caixaInput}>
            <TextInput
              value={nomeCompleto}
              onChangeText={(t) => {
                setNomeCompleto(t);
                setMensagemErro(null);
              }}
              placeholder="Nome completo"
              placeholderTextColor="#7D8592"
              style={estilos.input}
            />
          </View>

          {/* Nome de usuário */}
          <Text style={estilos.rotuloSecao}>Nome de usuário</Text>
          <View style={estilos.caixaInput}>
            <TextInput
              value={nomeUsuario}
              onChangeText={(t) => {
                setNomeUsuario(t);
                setMensagemErro(null);
              }}
              placeholder="Nome de usuário"
              placeholderTextColor="#7D8592"
              style={estilos.input}
              autoCapitalize="none"
            />
          </View>

          {/* Textos Legais Fiéis ao Print 3 */}
          <Text style={estilos.paragrafoLegal}>
            As pessoas que usam nosso serviço podem ter carregado suas informações de contato no Instagram.{" "}
            <Text style={estilos.linkAzul}>Saiba mais</Text>.
          </Text>

          <Text style={estilos.paragrafoLegal}>
            Ao tocar em Enviar, você concorda em criar uma conta e em seguir os{" "}
            <Text style={estilos.linkAzul}>Termos</Text>, a{" "}
            <Text style={estilos.linkAzul}>Política de Privacidade</Text> e a{" "}
            <Text style={estilos.linkAzul}>Política de Cookies</Text> do Instagram.
          </Text>

          <Text style={estilos.paragrafoLegal}>
            A <Text style={estilos.linkAzul}>Política de Privacidade</Text> descreve como podemos usar as informações que coletamos quando você cria uma conta. Por exemplo, usamos essas informações para fornecer, personalizar e melhorar nossos produtos, incluindo anúncios.
          </Text>

          {mensagemErro && (
            <View style={estilos.caixaErro}>
              <Ionicons name="alert-circle-outline" size={16} color="#FF6B6B" />
              <Text style={estilos.textoErro}>{mensagemErro}</Text>
            </View>
          )}

          {/* Botão Principal: Enviar */}
          <TouchableOpacity
            style={estilos.botaoEnviar}
            onPress={lidarComEnviarCadastro}
            disabled={estaCadastrando}
            activeOpacity={0.85}
          >
            {estaCadastrando ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={estilos.textoBotaoEnviar}>Enviar</Text>
            )}
          </TouchableOpacity>

          {/* Botão Secundário: Já tenho uma conta */}
          <TouchableOpacity
            style={estilos.botaoJaTenhoConta}
            onPress={() => navegador.replace("/login" as any)}
            activeOpacity={0.8}
          >
            <Text style={estilos.textoJaTenhoConta}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Seletor de Dia / Mês / Ano */}
      <Modal
        visible={seletorAtivo !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSeletorAtivo(null)}
      >
        <TouchableOpacity
          style={estilos.fundoModalData}
          activeOpacity={1}
          onPress={() => setSeletorAtivo(null)}
        >
          <View style={estilos.caixaModalData}>
            <Text style={estilos.tituloModalData}>
              Selecionar {seletorAtivo === "dia" ? "Dia" : seletorAtivo === "mes" ? "Mês" : "Ano"}
            </Text>
            <FlatList
              data={obterOpcoesSeletor()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={estilos.itemOpcaoData}
                  onPress={() => selecionarValorData(item)}
                >
                  <Text style={estilos.textoOpcaoData}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  linhaMetaTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  textoMetaTopo: {
    color: "#DCE1E7",
    fontSize: 15,
    fontWeight: "600",
  },
  tituloPrincipal: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: 10,
  },
  subtituloPrincipal: {
    color: "#DCE1E7",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  rotuloSecao: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },
  rotuloSecaoSemMargem: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  linhaRotuloData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 8,
  },
  caixaInput: {
    backgroundColor: "#1C2026",
    borderWidth: 1,
    borderColor: "#3A424D",
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  caixaInputSenha: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2026",
    borderWidth: 1,
    borderColor: "#3A424D",
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },
  textoAjudaContato: {
    color: "#DCE1E7",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 6,
  },
  linkAzul: {
    color: "#3EA6FF",
    fontWeight: "600",
  },
  painelRequisitosSenha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: "#1C2026",
    padding: 10,
    borderRadius: 10,
  },
  itemRequisito: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 8,
  },
  textoRequisito: {
    color: "#8E96A3",
    fontSize: 12,
  },
  textoRequisitoAtendido: {
    color: "#2ECC71",
    fontWeight: "600",
  },
  linhaSeletoresData: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  caixaSeletorData: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C2026",
    borderWidth: 1,
    borderColor: "#3A424D",
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 14,
  },
  textoSeletorData: {
    color: "#8E96A3",
    fontSize: 15,
  },
  textoSeletorPreenchido: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  paragrafoLegal: {
    color: "#DCE1E7",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
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
    marginTop: 16,
  },
  textoErro: {
    flex: 1,
    color: "#FF8787",
    fontSize: 13,
    lineHeight: 18,
  },
  botaoEnviar: {
    backgroundColor: "#0064E0",
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    marginBottom: 12,
  },
  textoBotaoEnviar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  botaoJaTenhoConta: {
    backgroundColor: "#22262C",
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  textoJaTenhoConta: {
    color: "#DCE1E7",
    fontSize: 14,
    fontWeight: "600",
  },
  fundoModalData: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  caixaModalData: {
    width: "85%",
    maxHeight: "60%",
    backgroundColor: "#1E2229",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#3A424D",
  },
  tituloModalData: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  itemOpcaoData: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C313A",
    alignItems: "center",
  },
  textoOpcaoData: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
