import { PublicacaoExplorar } from "@/modelos/publicacao";
import { publicacoesExplorarMock } from "@/dados/dados-mockados";
import { obterChaveApiPexels } from "./servico-cofre-seguro";

interface InfoImagemWikimedia {
  url: string;
  thumburl?: string;
  user?: string;
}

interface PaginaWikimedia {
  pageid: number;
  title: string;
  imageinfo?: InfoImagemWikimedia[];
}

interface RespostaWikimediaApi {
  query?: {
    pages?: Record<string, PaginaWikimedia>;
  };
}

const DICIONARIO_TERMOS_BUSCA: Record<string, string> = {
  casa: "modern house architecture luxury home",
  casas: "modern house architecture luxury home",
  carro: "sports car supercar automobile",
  carros: "sports car supercar automobile",
  moto: "motorcycle motorbike superbike",
  motos: "motorcycle motorbike superbike",
  praia: "tropical beach ocean sunset",
  natureza: "nature landscape mountains forest",
  arquitetura: "modern architecture building interior",
  cachorro: "dog puppy pet",
  gato: "cat kitten pet",
  comida: "gourmet food photography dish",
  viagem: "travel destination landmark",
};

const QUANTIDADE_POR_PAGINA = 18;

/**
 * Formata um número simulado de visualizações para manter o estilo visual do Explorar.
 */
function gerarVisualizacoesFormatadas(indice: number): string {
  const valores = ["142 mil", "890 mil", "1,2 mi", "320 mil", "2,4 mi", "510 mil", "95 mil", "1,8 mi"];
  return valores[indice % valores.length];
}

function limparTituloArquivo(tituloBruto: string, termoOriginal: string): string {
  const semPrefixo = tituloBruto
    .replace(/^File:/i, "")
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();

  return semPrefixo.length > 0 ? semPrefixo.slice(0, 32) : termoOriginal;
}

/**
 * Realiza a requisição HTTP GET (fetch) na API pública oficial do Wikimedia Commons
 * com suporte a paginação (offset) para Scroll Infinito e sem bloqueio 401.
 */
async function buscarFotosNaWikimediaApi(
  termoBusca: string,
  pagina: number = 0
): Promise<PublicacaoExplorar[]> {
  const chaveMinuscula = termoBusca.trim().toLowerCase();
  const termoTraduzido = DICIONARIO_TERMOS_BUSCA[chaveMinuscula] || termoBusca.trim() || "architecture";
  const deslocamento = pagina * QUANTIDADE_POR_PAGINA;

  const consultaCodificada = encodeURIComponent(`${termoTraduzido} filetype:bitmap`);
  const urlRequisicao =
    `https://commons.wikimedia.org/w/api.php?action=query` +
    `&generator=search&gsrnamespace=6&gsrsearch=${consultaCodificada}` +
    `&gsrlimit=${QUANTIDADE_POR_PAGINA}&gsroffset=${deslocamento}` +
    `&prop=imageinfo&iiprop=url|user&iiurlwidth=600&format=json&origin=*`;

  const resposta = await fetch(urlRequisicao, {
    headers: {
      Accept: "application/json",
      "User-Agent": "AplicativoInstagramP2/1.0 (https://expo.dev)",
    },
  });

  if (!resposta.ok) {
    throw new Error(`Falha na requisição da API: status ${resposta.status}`);
  }

  const dados: RespostaWikimediaApi = await resposta.json();
  const paginas = Object.values(dados.query?.pages ?? {});

  return paginas
    .filter((item) => Boolean(item.imageinfo?.[0]?.thumburl || item.imageinfo?.[0]?.url))
    .map((item, indice) => {
      const info = item.imageinfo![0];
      const indiceGlobal = deslocamento + indice;

      return {
        id: `wiki_${item.pageid}_${pagina}_${indice}`,
        midiaUrl: info.thumburl || info.url,
        visualizacoes: gerarVisualizacoesFormatadas(indiceGlobal),
        ehVideo: indiceGlobal % 3 === 0,
        rotuloTexto: limparTituloArquivo(item.title, termoBusca),
        nomeFotografo: info.user || "wikimedia.commons",
      };
    });
}

/**
 * Função principal consumida pela tela Explorar:
 * 1. Lê o token no SecureStore (`obterChaveApiPexels`).
 * 2. Busca as imagens na API pública de acordo com o termo ("casa", "carro", "moto", etc.) e a página do scroll infinito.
 */
export async function buscarImagensExplorarPorTermo(
  termoPesquisa: string,
  pagina: number = 0
): Promise<PublicacaoExplorar[]> {
  const termoFinal = termoPesquisa.trim() || "casa";

  try {
    await obterChaveApiPexels();

    const resultadosApi = await buscarFotosNaWikimediaApi(termoFinal, pagina);
    if (resultadosApi.length > 0) {
      return resultadosApi;
    }

    if (pagina === 0) {
      return publicacoesExplorarMock;
    }
    return [];
  } catch (erro) {
    console.warn("Aviso: usando imagens locais de fallback no Explorar:", erro);
    return pagina === 0
      ? publicacoesExplorarMock
      : publicacoesExplorarMock.map((item, idx) => ({
          ...item,
          id: `${item.id}_pag_${pagina}_${idx}`,
        }));
  }
}
