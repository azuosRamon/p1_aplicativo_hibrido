import { ComentarioPublicacao, RegistroComentarioBanco } from "@/modelos/comentario";
import { Usuario } from "@/modelos/usuario";
import { usuarioAtualMock } from "@/dados/dados-mockados";
import { obterBancoDados } from "./conexao-sqlite";

/**
 * Converte uma linha bruta da tabela `comentarios` do SQLite
 * para a interface `ComentarioPublicacao` usada na tela de comentários.
 */
function mapearRegistroParaComentario(linha: RegistroComentarioBanco): ComentarioPublicacao {
  return {
    id: linha.id,
    idPublicacao: linha.id_publicacao,
    nomeUsuario: linha.nome_usuario,
    fotoUsuarioUrl: linha.foto_usuario_url,
    texto: linha.texto,
    tempoDecorrido: linha.tempo_decorrido,
    curtidas: linha.curtidas,
    estaCurtido: linha.esta_curtido === 1,
    curtidoPeloAutor: linha.curtido_pelo_autor === 1,
  };
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 8):
 * Busca todos os comentários de uma publicação específica no SQLite,
 * ordenados do mais antigo para o mais recente.
 */
export async function listarComentariosDaPublicacao(
  idPublicacao: string
): Promise<ComentarioPublicacao[]> {
  const banco = await obterBancoDados();

  const linhas = await banco.getAllAsync<RegistroComentarioBanco>(
    "SELECT * FROM comentarios WHERE id_publicacao = ? ORDER BY criado_em_timestamp ASC",
    [idPublicacao]
  );

  return linhas.map(mapearRegistroParaComentario);
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 8):
 * Insere um novo comentário feito pelo usuário logado na tabela `comentarios` do SQLite.
 */
export async function inserirNovoComentarioNoBanco(
  idPublicacao: string,
  textoComentario: string,
  autorComentario: Usuario = usuarioAtualMock
): Promise<ComentarioPublicacao> {
  const banco = await obterBancoDados();

  const novoId = `com_${Date.now()}`;
  const agora = Date.now();
  const textoLimpo = textoComentario.trim();

  await banco.runAsync(
    `INSERT INTO comentarios (
      id, id_publicacao, nome_usuario, foto_usuario_url,
      texto, tempo_decorrido, curtidas, esta_curtido,
      curtido_pelo_autor, criado_em_timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      novoId,
      idPublicacao,
      autorComentario.nomeUsuario,
      autorComentario.fotoUrl,
      textoLimpo,
      "Agora",
      0,
      0,
      0,
      agora,
    ]
  );

  return {
    id: novoId,
    idPublicacao,
    nomeUsuario: autorComentario.nomeUsuario,
    fotoUsuarioUrl: autorComentario.fotoUrl,
    texto: textoLimpo,
    tempoDecorrido: "Agora",
    curtidas: 0,
    estaCurtido: false,
    curtidoPeloAutor: false,
  };
}

/**
 * Alterna a curtida (coraçãozinho) em um comentário específico no SQLite.
 */
export async function alternarCurtidaComentarioNoBanco(
  idComentario: string,
  novoEstadoCurtido: boolean,
  novoTotalCurtidas: number
): Promise<void> {
  const banco = await obterBancoDados();
  const valorInteiro = novoEstadoCurtido ? 1 : 0;

  await banco.runAsync(
    "UPDATE comentarios SET curtidas = ?, esta_curtido = ? WHERE id = ?",
    [novoTotalCurtidas, valorInteiro, idComentario]
  );
}

