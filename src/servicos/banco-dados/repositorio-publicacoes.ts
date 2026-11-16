import { PublicacaoFeed, RegistroPublicacaoBanco } from "@/modelos/publicacao";
import { usuarioAtualMock } from "@/dados/dados-mockados";
import { salvarFotoNoSistemaArquivos } from "@/servicos/servico-arquivos";
import { obterBancoDados } from "./conexao-sqlite";

interface LinhaPublicacaoComContagem extends RegistroPublicacaoBanco {
  total_comentarios: number;
}

/**
 * Converte uma linha bruta do SQLite (onde booleanos são 0 ou 1)
 * para o objeto tipado `PublicacaoFeed` utilizado pelos componentes React.
 */
function mapearRegistroParaPublicacao(linha: LinhaPublicacaoComContagem): PublicacaoFeed {
  return {
    id: linha.id,
    autor: {
      id: linha.id_autor,
      nomeUsuario: linha.nome_usuario,
      nomeCompleto: linha.nome_completo,
      fotoUrl: linha.foto_autor_url,
      biografia: "",
      totalPublicacoes: 0,
      totalSeguidores: 0,
      totalSeguindo: 0,
    },
    midiaUrl: linha.caminho_midia,
    legenda: linha.legenda,
    localizacao: linha.localizacao ?? undefined,
    audioNome: linha.audio_nome ?? undefined,
    outrasPessoasMarcadas: linha.outras_pessoas_marcadas ?? undefined,
    textoSobreposto: linha.texto_sobreposto ?? undefined,
    curtidas: linha.curtidas,
    comentarios: linha.total_comentarios ?? 0,
    criadoEm: linha.criado_em,
    ehReel: linha.eh_reel === 1,
    estaCurtido: linha.esta_curtido === 1,
    estaSalvo: linha.esta_salvo === 1,
    curtidoPorDestaque: linha.curtido_por_destaque ?? "aleisa2015",
    ehDoUsuarioAtual: linha.eh_do_usuario_atual === 1,
  };
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 7):
 * Lista todas as publicações salvas no SQLite, já trazendo a contagem real
 * de comentários relacionados na tabela `comentarios`, ordenadas das mais recentes para as mais antigas.
 */
export async function listarPublicacoesDoBanco(): Promise<PublicacaoFeed[]> {
  const banco = await obterBancoDados();

  const consultaSql = `
    SELECT p.*,
      (SELECT COUNT(*) FROM comentarios c WHERE c.id_publicacao = p.id) AS total_comentarios
    FROM publicacoes p
    ORDER BY p.ordem_exibicao DESC
  `;

  const linhas = await banco.getAllAsync<LinhaPublicacaoComContagem>(consultaSql);

  return linhas.map(mapearRegistroParaPublicacao);
}

/**
 * Cria uma nova publicação:
 * 1. Salva a foto física no FileSystem (`salvarFotoNoSistemaArquivos`).
 * 2. Insere o registro relacional na tabela `publicacoes` do SQLite.
 */
export async function criarNovaPublicacaoNoBanco(
  uriFotoEscolhida: string,
  legenda: string,
  localizacao: string = "Maricá"
): Promise<PublicacaoFeed> {
  const banco = await obterBancoDados();

  // 1. Copia a foto para a pasta permanente no FileSystem
  const caminhoMidiaPermanente = await salvarFotoNoSistemaArquivos(uriFotoEscolhida);

  // 2. Descobre a maior ordem_exibicao para colocar o novo post no topo do Feed e do Perfil
  const maiorOrdem = await banco.getFirstAsync<{ max_ordem: number | null }>(
    "SELECT MAX(ordem_exibicao) as max_ordem FROM publicacoes"
  );
  const novaOrdem = (maiorOrdem?.max_ordem ?? 100) + 1;
  const novoId = `post_${Date.now()}`;
  const dataFormatada = "Agora mesmo";

  await banco.runAsync(
    `INSERT INTO publicacoes (
      id, id_autor, nome_usuario, nome_completo, foto_autor_url,
      caminho_midia, legenda, localizacao, audio_nome, outras_pessoas_marcadas,
      texto_sobreposto, curtidas, esta_curtido, esta_salvo, eh_reel,
      eh_do_usuario_atual, curtido_por_destaque, criado_em, ordem_exibicao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      novoId,
      usuarioAtualMock.id,
      usuarioAtualMock.nomeUsuario,
      usuarioAtualMock.nomeCompleto,
      usuarioAtualMock.fotoUrl,
      caminhoMidiaPermanente,
      legenda.trim(),
      localizacao,
      null,
      null,
      null,
      0,
      0,
      0,
      0,
      1,
      "aleisa2015",
      dataFormatada,
      novaOrdem,
    ]
  );

  return {
    id: novoId,
    autor: usuarioAtualMock,
    midiaUrl: caminhoMidiaPermanente,
    legenda: legenda.trim(),
    localizacao,
    curtidas: 0,
    comentarios: 0,
    criadoEm: dataFormatada,
    ehReel: false,
    estaCurtido: false,
    estaSalvo: false,
    curtidoPorDestaque: "aleisa2015",
    ehDoUsuarioAtual: true,
  };
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 7):
 * Alterna a curtida (Like / Dislike) de uma publicação no SQLite.
 */
export async function alternarCurtidaNoBanco(
  idPublicacao: string,
  novoEstadoCurtido: boolean,
  novoTotalCurtidas: number
): Promise<void> {
  const banco = await obterBancoDados();
  const valorInteiroCurtido = novoEstadoCurtido ? 1 : 0;

  await banco.runAsync(
    "UPDATE publicacoes SET curtidas = ?, esta_curtido = ? WHERE id = ?",
    [novoTotalCurtidas, valorInteiroCurtido, idPublicacao]
  );
}

/**
 * Alterna o estado de salvo (Bookmark) de uma publicação no SQLite.
 */
export async function alternarSalvoNoBanco(
  idPublicacao: string,
  novoEstadoSalvo: boolean
): Promise<void> {
  const banco = await obterBancoDados();
  const valorInteiroSalvo = novoEstadoSalvo ? 1 : 0;

  await banco.runAsync(
    "UPDATE publicacoes SET esta_salvo = ? WHERE id = ?",
    [valorInteiroSalvo, idPublicacao]
  );
}

