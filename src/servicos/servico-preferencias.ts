import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Chaves do AsyncStorage (chave -> valor em texto sem criptografia).
 * Conforme o slide da aula:
 * Regra prática: preferência / cache pequeno -> AsyncStorage (tema, idioma, onboarding, cache pequeno)
 */
export const CHAVES_PREFERENCIAS = {
  ULTIMO_TERMO_EXPLORAR: "@instagram_p2:ultimo_termo_explorar",
  HISTORICO_BUSCAS_EXPLORAR: "@instagram_p2:historico_buscas_explorar",
  CACHE_ULTIMA_BUSCA_EXPLORAR: "@instagram_p2:cache_ultima_busca_explorar",
};

/**
 * 🎓 MÃO NA MASSA (ETAPA 4):
 * Salva uma preferência ou cache pequeno (chave -> valor em texto) no AsyncStorage.
 * Utilize: await AsyncStorage.setItem(chave, valor)
 */
export async function salvarPreferenciaTexto(chave: string, valor: string): Promise<void> {
  try {
    await AsyncStorage.setItem(chave, valor);
  } catch (erro) {
    console.warn("Erro ao salvar preferência no AsyncStorage:", erro);
  }
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 4):
 * Busca uma preferência ou cache pequeno salvo no AsyncStorage.
 * Utilize: await AsyncStorage.getItem(chave)
 */
export async function buscarPreferenciaTexto(chave: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(chave);
  } catch (erro) {
    console.warn("Erro ao ler preferência no AsyncStorage:", erro);
    return null;
  }
}

/**
 * Salva o último termo pesquisado na aba Explorar (ex: "casa", "carro", "moto")
 * e atualiza a lista de buscas recentes (máximo de 5 termos).
 */
export async function registrarTermoPesquisado(termo: string): Promise<string[]> {
  const termoLimpo = termo.trim();
  if (!termoLimpo) {
    return obterHistoricoBuscas();
  }

  await salvarPreferenciaTexto(CHAVES_PREFERENCIAS.ULTIMO_TERMO_EXPLORAR, termoLimpo);

  const historicoAtual = await obterHistoricoBuscas();
  const semDuplicados = historicoAtual.filter(
    (item) => item.toLowerCase() !== termoLimpo.toLowerCase()
  );
  const novoHistorico = [termoLimpo, ...semDuplicados].slice(0, 5);

  await salvarPreferenciaTexto(
    CHAVES_PREFERENCIAS.HISTORICO_BUSCAS_EXPLORAR,
    JSON.stringify(novoHistorico)
  );

  return novoHistorico;
}

/**
 * Retorna a lista de buscas recentes na aba Explorar (ou sugestões iniciais).
 */
export async function obterHistoricoBuscas(): Promise<string[]> {
  const jsonSalvo = await buscarPreferenciaTexto(CHAVES_PREFERENCIAS.HISTORICO_BUSCAS_EXPLORAR);
  if (!jsonSalvo) {
    return ["casa", "carro", "moto"];
  }

  try {
    const lista = JSON.parse(jsonSalvo);
    return Array.isArray(lista) && lista.length > 0 ? lista : ["casa", "carro", "moto"];
  } catch {
    return ["casa", "carro", "moto"];
  }
}

