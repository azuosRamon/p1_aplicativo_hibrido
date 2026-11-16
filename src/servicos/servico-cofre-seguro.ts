import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Chaves seguras utilizadas no Keychain (iOS) / Keystore (Android).
 * Conforme o slide da aula:
 * Regra prática: segredo -> SecureStore (token JWT, refresh token, PIN, Chave de API)
 */
export const CHAVES_COFRE_SEGURO = {
  CHAVE_API_PEXELS: "segredo_chave_api_pexels",
  TOKEN_SESSAO_USUARIO: "segredo_token_sessao_jwt",
};

// Chave padrão de desenvolvimento caso o usuário ainda não tenha configurado uma própria
const CHAVE_PEXELS_PADRAO = "563492ad6f91700001000001a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

/**
 * 🎓 MÃO NA MASSA (ETAPA 3):
 * Salva um texto curto confidencial de forma criptografada no Keychain / Keystore.
 * Utilize: await SecureStore.setItemAsync(chave, valor)
 */
export async function salvarSegredoNoCofre(chave: string, valor: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(chave, valor);
    return;
  }

  await SecureStore.setItemAsync(chave, valor);
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 3):
 * Recupera um texto confidencial salvo no Keychain / Keystore.
 * Utilize: await SecureStore.getItemAsync(chave)
 */
export async function buscarSegredoDoCofre(chave: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(chave);
  }

  return await SecureStore.getItemAsync(chave);
}

/**
 * Remove um segredo do Keychain / Keystore.
 */
export async function removerSegredoDoCofre(chave: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(chave);
    return;
  }
  await SecureStore.deleteItemAsync(chave);
}

/**
 * Obtém a chave da API Pexels armazenada no SecureStore (ou inicializa com a chave padrão).
 */
export async function obterChaveApiPexels(): Promise<string> {
  const chaveSalva = await buscarSegredoDoCofre(CHAVES_COFRE_SEGURO.CHAVE_API_PEXELS);
  if (chaveSalva) {
    return chaveSalva;
  }
  await salvarSegredoNoCofre(CHAVES_COFRE_SEGURO.CHAVE_API_PEXELS, CHAVE_PEXELS_PADRAO);
  return CHAVE_PEXELS_PADRAO;
}

