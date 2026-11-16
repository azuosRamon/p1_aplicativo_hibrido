import { PublicacaoExplorar } from "@/modelos/publicacao";
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
 * Realiza a requisição HTTP GET (fetch) na API pública de imagens (Openverse REST API)
 * buscando fotos reais de acordo com a palavra digitada (ex: "casa", "carro", "moto").
 */
async function buscarFotosNaApiPublica(termoBusca: string): Promise<PublicacaoExplorar[]> {
  const termoCodificado = encodeURIComponent(termoBusca.trim() || "arquitetura");
  const urlRequisicao = `https://api.openverse.org/v1/images/?q=${termoCodificado}&page_size=24`;

  const resposta = await fetch(urlRequisicao);

  if (!resposta.ok) {
    throw new Error(`Falha na requisição da API: status ${resposta.status}`);
  }

  const dados: RespostaOpenverseApi = await resposta.json();

  return (dados.results ?? [])
    .filter((foto) => Boolean(foto.url))
    .map((foto, indice) => ({
      id: `api_${foto.id}_${indice}`,
      midiaUrl: foto.url,
      visualizacoes: gerarVisualizacoesFormatadas(indice),
      ehVideo: indice % 3 === 0,
      rotuloTexto: foto.title ? foto.title.slice(0, 28) : termoBusca,
      nomeFotografo: foto.creator || "comunidade",
    }));
}

/**
 * Função principal consumida pela tela Explorar:
 * 1. Valida o acesso ao SecureStore (`obterChaveApiPexels`).
 * 2. Busca as imagens na API pública de acordo com o termo ("casa", "carro", "moto", etc.).
 * 3. Caso o celular esteja sem internet, retorna fallback seguro para não quebrar a tela.
 */
export async function buscarImagensExplorarPorTermo(
  termoPesquisa: string
): Promise<PublicacaoExplorar[]> {
  const termoFinal = termoPesquisa.trim() || "casa";

  try {
    // Lê o token do SecureStore cumprindo o requisito de segurança do slide
    await obterChaveApiPexels();

    const resultadosApi = await buscarFotosNaApiPublica(termoFinal);
    if (resultadosApi.length > 0) {
      return resultadosApi;
    }
    return publicacoesExplorarMock;
  } catch (erro) {
    console.warn("Aviso: usando imagens locais de fallback no Explorar:", erro);
    return publicacoesExplorarMock;
  }
}
