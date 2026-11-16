import { PublicacaoExplorar } from "@/modelos/publicacao";
import { RespostaBuscaPexels } from "@/modelos/midia-api";
import { publicacoesExplorarMock } from "@/dados/dados-mockados";
import { obterChaveApiPexels } from "./servico-cofre-seguro";

interface ItemImagemOpenverse {
  id: string;
  title?: string;
  creator?: string;
  url: string;
  thumbnail?: string;
}

interface RespostaOpenverseApi {
  result_count: number;
  results: ItemImagemOpenverse[];
}

/**
 * Formata um número simulado de visualizações para manter o estilo visual do Explorar.
 */
function gerarVisualizacoesFormatadas(indice: number): string {
  const valores = ["142 mil", "890 mil", "1,2 mi", "320 mil", "2,4 mi", "510 mil", "95 mil", "1,8 mi"];
  return valores[indice % valores.length];
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 11):
 * Realiza a requisição HTTP GET (fetch) na API pública de imagens (Openverse REST API)
 * buscando fotos reais de acordo com a palavra digitada (ex: "casa", "carro", "moto").
 */
async function buscarFotosNaApiPublica(termoBusca: string): Promise<PublicacaoExplorar[]> {
  const termoCodificado = encodeURIComponent(termoBusca.trim() || "arquitetura");
  const urlRequisicao = `https://api.openverse.org/v1/images/?q=${termoCodificado}&page_size=21`;

  const resposta = await fetch(urlRequisicao);

  if (!resposta.ok) {
    throw new Error(`Falha na requisição da API: status ${resposta.status}`);
  }

  const dados: RespostaOpenverseApi = await resposta.json();

  return (dados.results ?? []).map((foto, indice) => ({
    id: `api_${foto.id}_${indice}`,
    midiaUrl: foto.thumbnail || foto.url,
    visualizacoes: gerarVisualizacoesFormatadas(indice),
    ehVideo: indice % 3 === 0,
    rotuloTexto: foto.title ? foto.title.slice(0, 28) : termoBusca,
    nomeFotografo: foto.creator || "comunidade",
  }));
}

/**
 * Caso o usuário tenha configurado uma chave personalizada da Pexels no SecureStore,
 * realiza a busca autenticada via Header Authorization na Pexels API.
 */
async function buscarFotosNaPexelsApi(
  termoBusca: string,
  chaveApi: string
): Promise<PublicacaoExplorar[]> {
  const termo = encodeURIComponent(termoBusca.trim() || "natureza");
  const url = `https://api.pexels.com/v1/search?query=${termo}&per_page=21&locale=pt-BR`;

  const resposta = await fetch(url, {
    headers: {
      Authorization: chaveApi,
    },
  });

  if (!resposta.ok) {
    throw new Error(`Erro Pexels API: ${resposta.status}`);
  }

  const dados: RespostaBuscaPexels = await resposta.json();

  return (dados.photos ?? []).map((foto, indice) => ({
    id: `pexels_${foto.id}`,
    midiaUrl: foto.src.medium || foto.src.large,
    visualizacoes: gerarVisualizacoesFormatadas(indice),
    ehVideo: indice % 4 === 0,
    rotuloTexto: foto.alt || termoBusca,
    nomeFotografo: foto.photographer,
  }));
}

/**
 * Função principal consumida pela tela Explorar:
 * 1. Lê a chave salva no SecureStore (`obterChaveApiPexels`).
 * 2. Busca as imagens na API da internet de acordo com o termo ("casa", "carro", "moto", etc.).
 * 3. Caso o celular esteja sem internet, retorna fallback seguro para não quebrar a tela.
 */
export async function buscarImagensExplorarPorTermo(
  termoPesquisa: string
): Promise<PublicacaoExplorar[]> {
  const termoFinal = termoPesquisa.trim() || "arquitetura moderna";

  try {
    const chaveCofre = await obterChaveApiPexels();
    const ehChavePadraoSimulada = chaveCofre.startsWith("563492ad6f91700001000001a1b2c3");

    if (!ehChavePadraoSimulada) {
      return await buscarFotosNaPexelsApi(termoFinal, chaveCofre);
    }

    const resultadosApi = await buscarFotosNaApiPublica(termoFinal);
    if (resultadosApi.length > 0) {
      return resultadosApi;
    }
    return publicacoesExplorarMock;
  } catch (erro) {
    console.warn("Erro ao buscar imagens na API (usando fallback local):", erro);
    return publicacoesExplorarMock;
  }
}

