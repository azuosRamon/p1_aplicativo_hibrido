import * as Crypto from "expo-crypto";

export interface ResultadoValidacaoSenha {
  ehValida: boolean;
  possuiMinimoOitoCaracteres: boolean;
  possuiLetraMaiuscula: boolean;
  possuiLetraMinuscula: boolean;
  possuiCaractereEspecial: boolean;
  possuiNumero: boolean;
  mensagemErro: string | null;
}

/**
 * Valida se a senha atende a todos os critérios de Senha Forte (Mm$3 e mínimo de 8 caracteres):
 * - Mínimo de 8 caracteres
 * - Pelo menos 1 letra maiúscula (M)
 * - Pelo menos 1 letra minúscula (m)
 * - Pelo menos 1 caractere especial ($, @, #, !, %, etc.)
 * - Pelo menos 1 número (3)
 */
export function validarForcaSenha(senha: string): ResultadoValidacaoSenha {
  const possuiMinimoOitoCaracteres = senha.length >= 8;
  const possuiLetraMaiuscula = /[A-Z]/.test(senha);
  const possuiLetraMinuscula = /[a-z]/.test(senha);
  const possuiCaractereEspecial = /[^A-Za-z0-9]/.test(senha);
  const possuiNumero = /[0-9]/.test(senha);

  const ehValida =
    possuiMinimoOitoCaracteres &&
    possuiLetraMaiuscula &&
    possuiLetraMinuscula &&
    possuiCaractereEspecial &&
    possuiNumero;

  let mensagemErro: string | null = null;
  if (!ehValida) {
    mensagemErro =
      "A senha deve ter no mínimo 8 caracteres e conter letra maiúscula (M), minúscula (m), caractere especial ($) e número (3).";
  }

  return {
    ehValida,
    possuiMinimoOitoCaracteres,
    possuiLetraMaiuscula,
    possuiLetraMinuscula,
    possuiCaractereEspecial,
    possuiNumero,
    mensagemErro,
  };
}

/**
 * Gera um Salt aleatório único para cada usuário cadastrado.
 * O Salt impede ataques de Rainbow Table (mesmo que dois usuários tenham a mesma senha,
 * o hash salvo no banco será completamente diferente!).
 */
export function gerarSaltAleatorio(): string {
  const aleatorio1 = Math.random().toString(36).substring(2, 12);
  const aleatorio2 = Date.now().toString(36);
  return `salt_${aleatorio1}_${aleatorio2}`;
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 26):
 * Combina o `salt` único do usuário com a `senhaPura` e gera o Hash criptográfico SHA-256.
 * Nunca salvamos a senha pura no SQLite — salvamos apenas o `hash` e o `salt`!
 */
export async function gerarHashSenhaComSalt(
  senhaPura: string,
  salt: string
): Promise<string> {
  const textoCombinado = `${salt}:${senhaPura}`;

  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    textoCombinado
  );
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 26):
 * No momento do Login, pega a senha digitada pelo usuário, aplica o MESMO `saltSalvoNoBanco`
 * e verifica se o hash resultante é idêntico ao `hashSalvoNoBanco`.
 */
export async function verificarSenhaComHash(
  senhaDigitada: string,
  saltSalvoNoBanco: string,
  hashSalvoNoBanco: string
): Promise<boolean> {
  const hashCalculado = await gerarHashSenhaComSalt(senhaDigitada, saltSalvoNoBanco);
  return hashCalculado === hashSalvoNoBanco;
}
