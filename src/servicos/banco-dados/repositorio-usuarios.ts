import { obterBancoDados } from "./conexao-sqlite";
import {
  gerarSaltAleatorio,
  gerarHashSenhaComSalt,
  verificarSenhaComHash,
} from "@/utilitarios/seguranca-senha";
import {
  CHAVES_COFRE_SEGURO,
  salvarSegredoNoCofre,
  removerSegredoDoCofre,
} from "@/servicos/servico-cofre-seguro";
import { salvarPreferenciaTexto } from "@/servicos/servico-preferencias";

export interface RegistroUsuarioBanco {
  id: string;
  contato_email_celular: string;
  nome_completo: string;
  nome_usuario: string;
  data_nascimento: string;
  senha_hash: string;
  senha_salt: string;
  criado_em: string;
}

export interface DadosNovoCadastro {
  contatoEmailCelular: string;
  senhaPura: string;
  dataNascimento: string;
  nomeCompleto: string;
  nomeUsuario: string;
}

const CHAVE_ULTIMO_USUARIO_LOGIN = "@instagram_p2:ultimo_usuario_login";

/**
 * Garante que exista a conta padrão `ramon.dev` (Senha forte: `Ramon$123`) no SQLite
 * para testes imediatos de Login, além das novas contas criadas na tela de Cadastro.
 */
async function garantirUsuarioPadraoNoBanco(): Promise<void> {
  const banco = await obterBancoDados();
  const existente = await banco.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM usuarios WHERE LOWER(nome_usuario) = LOWER(?)",
    ["ramon.dev"]
  );

  if (existente && existente.total > 0) {
    return;
  }

  const saltPadrao = "salt_padrao_ramon_2026";
  const hashPadrao = await gerarHashSenhaComSalt("Ramon$123", saltPadrao);

  await banco.runAsync(
    `INSERT OR IGNORE INTO usuarios (
      id, contato_email_celular, nome_completo, nome_usuario,
      data_nascimento, senha_hash, senha_salt, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "usr_padrao_ramon",
      "ramon@instagram.com",
      "Ramon Souza",
      "ramon.dev",
      "23/03/2002",
      hashPadrao,
      saltPadrao,
      new Date().toISOString(),
    ]
  );
}

/**
 * Cadastra um novo usuário no SQLite aplicando Hash SHA-256 + Salt aleatório na senha,
 * grava o token JWT de sessão no SecureStore e salva o identificador no AsyncStorage.
 */
export async function cadastrarNovoUsuarioNoBanco(
  dados: DadosNovoCadastro
): Promise<RegistroUsuarioBanco> {
  const banco = await obterBancoDados();
  await garantirUsuarioPadraoNoBanco();

  const nomeUsuarioLimpo = dados.nomeUsuario.trim().toLowerCase();
  const contatoLimpo = dados.contatoEmailCelular.trim().toLowerCase();

  const usuarioExistente = await banco.getFirstAsync<RegistroUsuarioBanco>(
    "SELECT * FROM usuarios WHERE LOWER(nome_usuario) = ? OR LOWER(contato_email_celular) = ?",
    [nomeUsuarioLimpo, contatoLimpo]
  );

  if (usuarioExistente) {
    throw new Error("Já existe uma conta cadastrada com este nome de usuário, celular ou email.");
  }

  // 1. Gera o Salt aleatório exclusivo e o Hash SHA-256 da senha
  const novoSalt = gerarSaltAleatorio();
  const novoHash = await gerarHashSenhaComSalt(dados.senhaPura, novoSalt);
  const novoId = `usr_${Date.now()}`;
  const criadoEm = new Date().toISOString();

  // 2. Salva no SQLite (apenas o hash e o salt, NUNCA a senha pura!)
  await banco.runAsync(
    `INSERT INTO usuarios (
      id, contato_email_celular, nome_completo, nome_usuario,
      data_nascimento, senha_hash, senha_salt, criado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      novoId,
      contatoLimpo,
      dados.nomeCompleto.trim(),
      nomeUsuarioLimpo,
      dados.dataNascimento,
      novoHash,
      novoSalt,
      criadoEm,
    ]
  );

  // 3. Salva o token JWT de sessão no SecureStore (Keychain / Keystore)
  const tokenSessao = `jwt_${novoId}_${Date.now()}`;
  await salvarSegredoNoCofre(CHAVES_COFRE_SEGURO.TOKEN_SESSAO_USUARIO, tokenSessao);

  // 4. Salva a preferência do último usuário logado no AsyncStorage
  await salvarPreferenciaTexto(CHAVE_ULTIMO_USUARIO_LOGIN, nomeUsuarioLimpo);

  return {
    id: novoId,
    contato_email_celular: contatoLimpo,
    nome_completo: dados.nomeCompleto.trim(),
    nome_usuario: nomeUsuarioLimpo,
    data_nascimento: dados.dataNascimento,
    senha_hash: novoHash,
    senha_salt: novoSalt,
    criado_em: criadoEm,
  };
}

/**
 * Autentica um usuário no Login:
 * 1. Busca o usuário no SQLite pelo nome de usuário, celular ou email.
 * 2. Recalcula o Hash SHA-256 com o `senha_salt` do banco e compara com `senha_hash`.
 * 3. Se válido, grava o token JWT no SecureStore e o usuário no AsyncStorage.
 */
export async function autenticarUsuarioNoBanco(
  identificador: string,
  senhaDigitada: string
): Promise<RegistroUsuarioBanco> {
  const banco = await obterBancoDados();
  await garantirUsuarioPadraoNoBanco();

  const idLimpo = identificador.trim().toLowerCase();

  const usuarioEncontrado = await banco.getFirstAsync<RegistroUsuarioBanco>(
    "SELECT * FROM usuarios WHERE LOWER(nome_usuario) = ? OR LOWER(contato_email_celular) = ?",
    [idLimpo, idLimpo]
  );

  if (!usuarioEncontrado) {
    throw new Error("Usuário, celular ou email não encontrado.");
  }

  const senhaCorreta = await verificarSenhaComHash(
    senhaDigitada,
    usuarioEncontrado.senha_salt,
    usuarioEncontrado.senha_hash
  );

  if (!senhaCorreta) {
    throw new Error("Senha incorreta. Verifique suas credenciais.");
  }

  // Gera e salva o token de sessão no SecureStore
  const tokenSessao = `jwt_${usuarioEncontrado.id}_${Date.now()}`;
  await salvarSegredoNoCofre(CHAVES_COFRE_SEGURO.TOKEN_SESSAO_USUARIO, tokenSessao);

  // Salva o último usuário logado no AsyncStorage
  await salvarPreferenciaTexto(CHAVE_ULTIMO_USUARIO_LOGIN, usuarioEncontrado.nome_usuario);

  return usuarioEncontrado;
}

/**
 * Encerra a sessão removendo o token JWT do SecureStore.
 */
export async function encerrarSessaoUsuario(): Promise<void> {
  await removerSegredoDoCofre(CHAVES_COFRE_SEGURO.TOKEN_SESSAO_USUARIO);
}
