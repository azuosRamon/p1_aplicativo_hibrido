import * as SQLite from "expo-sqlite";
import { publicacoesFeedMock, publicacoesPerfilMock, usuarioAtualMock } from "@/dados/dados-mockados";

const NOME_BANCO_DADOS = "instagram_p2_v2.db";

let instanciaBanco: SQLite.SQLiteDatabase | null = null;
let promessaConexao: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * DDL Relacional do SQLite:
 * Conforme o slide da aula:
 * SQLite -> Guarda: tabelas relacionais -> Use para: listas grandes, filtros, offline completo.
 * Regra prática: dados que você consulta e filtra -> SQLite.
 */
const SQL_CRIAR_TABELAS = `
  CREATE TABLE IF NOT EXISTS publicacoes (
    id TEXT PRIMARY KEY NOT NULL,
    id_autor TEXT NOT NULL,
    nome_usuario TEXT NOT NULL,
    nome_completo TEXT NOT NULL,
    foto_autor_url TEXT NOT NULL,
    caminho_midia TEXT NOT NULL,
    legenda TEXT NOT NULL,
    localizacao TEXT,
    audio_nome TEXT,
    outras_pessoas_marcadas TEXT,
    texto_sobreposto TEXT,
    curtidas INTEGER NOT NULL DEFAULT 0,
    esta_curtido INTEGER NOT NULL DEFAULT 0,
    esta_salvo INTEGER NOT NULL DEFAULT 0,
    eh_reel INTEGER NOT NULL DEFAULT 0,
    eh_do_usuario_atual INTEGER NOT NULL DEFAULT 0,
    curtido_por_destaque TEXT,
    criado_em TEXT NOT NULL,
    ordem_exibicao INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comentarios (
    id TEXT PRIMARY KEY NOT NULL,
    id_publicacao TEXT NOT NULL,
    nome_usuario TEXT NOT NULL,
    foto_usuario_url TEXT NOT NULL,
    texto TEXT NOT NULL,
    tempo_decorrido TEXT NOT NULL,
    curtidas INTEGER NOT NULL DEFAULT 0,
    esta_curtido INTEGER NOT NULL DEFAULT 0,
    curtido_pelo_autor INTEGER NOT NULL DEFAULT 0,
    criado_em_timestamp INTEGER NOT NULL,
    FOREIGN KEY (id_publicacao) REFERENCES publicacoes (id) ON DELETE CASCADE
  );
`;

/**
 * Abre (ou retorna) a conexão única com o banco de dados SQLite e garante que as tabelas
 * relacionais `publicacoes` e `comentarios` existam e recebam a carga inicial (seed).
 */
export async function obterBancoDados(): Promise<SQLite.SQLiteDatabase> {
  if (instanciaBanco) {
    return instanciaBanco;
  }

  if (promessaConexao) {
    return promessaConexao;
  }

  promessaConexao = (async () => {
    const banco = await SQLite.openDatabaseAsync(NOME_BANCO_DADOS);
    await banco.execAsync(SQL_CRIAR_TABELAS);
    await popularDadosIniciaisSeVazio(banco);
    instanciaBanco = banco;
    return banco;
  })();

  try {
    return await promessaConexao;
  } catch (erro) {
    promessaConexao = null;
    throw erro;
  }
}

/**
 * Realiza a carga inicial (Seed) inserindo no SQLite todos os posts mockados
 * existentes (tanto do Feed Inicial quanto da Grade do Perfil) e comentários iniciais,
 * permitindo curtir, salvar e comentar em qualquer post existente.
 */
async function popularDadosIniciaisSeVazio(banco: SQLite.SQLiteDatabase): Promise<void> {
  const contagem = await banco.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM publicacoes"
  );

  if (contagem && contagem.total > 0) {
    return;
  }

  let ordem = 100;

  // 1. Insere os posts existentes do Feed Principal
  for (const post of publicacoesFeedMock) {
    await banco.runAsync(
      `INSERT OR IGNORE INTO publicacoes (
        id, id_autor, nome_usuario, nome_completo, foto_autor_url,
        caminho_midia, legenda, localizacao, audio_nome, outras_pessoas_marcadas,
        texto_sobreposto, curtidas, esta_curtido, esta_salvo, eh_reel,
        eh_do_usuario_atual, curtido_por_destaque, criado_em, ordem_exibicao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.id,
        post.autor.id,
        post.autor.nomeUsuario,
        post.autor.nomeCompleto,
        post.autor.fotoUrl,
        post.midiaUrl,
        post.legenda,
        "Rio de Janeiro",
        post.audioNome ?? null,
        post.outrasPessoasMarcadas ?? null,
        post.textoSobreposto ?? null,
        post.curtidas,
        post.estaCurtido ? 1 : 0,
        post.estaSalvo ? 1 : 0,
        post.ehReel ? 1 : 0,
        0,
        "aleisa2015",
        post.criadoEm,
        ordem--,
      ]
    );
  }

  // 2. Insere os posts existentes da Grade do Perfil (pertencentes ao usuário logado)
  const legendasPerfil = [
    "Foco total nos treinos e evolução diária! 💪🔥",
    "Final de tarde incrível na praia, recarregando as energias 🌊☀️",
    "Explorando novos ângulos e composições na fotografia urbana 📸✨",
    "Construindo aplicativos híbridos modernos com React Native, Expo e SQLite 🚀📱",
    "Dia de imersão em arquitetura de software e performance mobile ⚡",
    "Inspiração em design minimalista e iluminação natural 🏛️",
  ];

  for (let indice = 0; indice < publicacoesPerfilMock.length; indice++) {
    const postPerfil = publicacoesPerfilMock[indice];
    const legenda = legendasPerfil[indice] ?? "Registro especial no perfil ✨";

    await banco.runAsync(
      `INSERT OR IGNORE INTO publicacoes (
        id, id_autor, nome_usuario, nome_completo, foto_autor_url,
        caminho_midia, legenda, localizacao, audio_nome, outras_pessoas_marcadas,
        texto_sobreposto, curtidas, esta_curtido, esta_salvo, eh_reel,
        eh_do_usuario_atual, curtido_por_destaque, criado_em, ordem_exibicao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postPerfil.id,
        usuarioAtualMock.id,
        usuarioAtualMock.nomeUsuario,
        usuarioAtualMock.nomeCompleto,
        usuarioAtualMock.fotoUrl,
        postPerfil.midiaUrl,
        legenda,
        "Maricá",
        null,
        null,
        null,
        48 + indice * 15,
        0,
        0,
        postPerfil.ehVideo ? 1 : 0,
        1,
        "aleisa2015",
        "3 de março de 2024",
        ordem--,
      ]
    );
  }

  // 3. Insere comentários iniciais para que os posts do Feed e do Perfil já possuam interações
  const comentariosIniciais = [
    {
      id: "com_inicial_1",
      id_publicacao: "perf_1",
      nome_usuario: "barros_keilla",
      foto_usuario_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      texto: "😍😍",
      tempo_decorrido: "140 sem",
      curtidas: 1,
      esta_curtido: 1,
      curtido_pelo_autor: 1,
      criado_em_timestamp: Date.now() - 3600000 * 24,
    },
    {
      id: "com_inicial_2",
      id_publicacao: "feed_1",
      nome_usuario: "clara.design",
      foto_usuario_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      texto: "Essa iluminação natural ficou impecável! 👏✨",
      tempo_decorrido: "2 h",
      curtidas: 4,
      esta_curtido: 0,
      curtido_pelo_autor: 1,
      criado_em_timestamp: Date.now() - 7200000,
    },
    {
      id: "com_inicial_3",
      id_publicacao: "feed_2",
      nome_usuario: "marcos.tech",
      foto_usuario_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      texto: "Expo SDK 58 com SQLite ficou absurdo de rápido! 🚀",
      tempo_decorrido: "1 h",
      curtidas: 7,
      esta_curtido: 1,
      curtido_pelo_autor: 1,
      criado_em_timestamp: Date.now() - 3600000,
    },
  ];

  for (const com of comentariosIniciais) {
    await banco.runAsync(
      `INSERT OR IGNORE INTO comentarios (
        id, id_publicacao, nome_usuario, foto_usuario_url,
        texto, tempo_decorrido, curtidas, esta_curtido,
        curtido_pelo_autor, criado_em_timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        com.id,
        com.id_publicacao,
        com.nome_usuario,
        com.foto_usuario_url,
        com.texto,
        com.tempo_decorrido,
        com.curtidas,
        com.esta_curtido,
        com.curtido_pelo_autor,
        com.criado_em_timestamp,
      ]
    );
  }
}
