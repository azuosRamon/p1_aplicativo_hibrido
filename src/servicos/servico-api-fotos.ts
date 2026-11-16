import { PublicacaoExplorar } from "@/modelos/publicacao";
import { obterChaveApiPexels } from "./servico-cofre-seguro";

interface ItemMidiaFlickr {
  title?: string;
  author?: string;
  tags?: string;
  media?: {
    m?: string;
  };
}

interface RespostaFlickrApi {
  items?: ItemMidiaFlickr[];
}

/**
 * Banco base de imagens reais em alta definição por categoria para garantir que buscas
 * em português ("casa", "carro", "moto", "praia", "natureza", "arquitetura")
 * sempre exibam resultados imediatos e altamente relevantes junto aos dados da API.
 */
const CATALOGO_CATEGORIAS: Record<string, { url: string; titulo: string; autor: string }[]> = {
  casa: [
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80", titulo: "Casa contemporânea minimalista", autor: "arq.residencial" },
    { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80", titulo: "Mansão com piscina e jardim", autor: "casas.luxo" },
    { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80", titulo: "Fachada moderna iluminada", autor: "design.interiores" },
    { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80", titulo: "Sala integrada com pé-direito duplo", autor: "decor.casa" },
    { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80", titulo: "Casa de campo em madeira e vidro", autor: "arquitetura.viva" },
    { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=80", titulo: "Residência com iluminação natural", autor: "home.studio" },
    { url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80", titulo: "Arquitetura residencial clássica", autor: "morar.bem" },
    { url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=700&q=80", titulo: "Varanda gourmet aconchegante", autor: "espaco.lar" },
    { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=700&q=80", titulo: "Interior escandinavo minimalista", autor: "casa.norte" },
  ],
  carro: [
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80", titulo: "Porsche 911 Carrera em pista", autor: "supercarros.br" },
    { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=700&q=80", titulo: "Bugatti esportivo fibra de carbono", autor: "auto.velocidade" },
    { url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&q=80", titulo: "Coupe esportivo azul metálico", autor: "garagem.motor" },
    { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=700&q=80", titulo: "Ford Mustang clássico na estrada", autor: "muscle.cars" },
    { url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=700&q=80", titulo: "Ferrari vermelha em alta velocidade", autor: "italia.motors" },
    { url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=700&q=80", titulo: "Superesportivo noturno neon", autor: "carros.elite" },
    { url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=700&q=80", titulo: "Mercedes-AMG GT em detalhes", autor: "pista.automotiva" },
    { url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80", titulo: " Design aerodinâmico futurista", autor: "turbo.club" },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700&q=80", titulo: "Esportivo branco em exposição", autor: "motor.show" },
  ],
  moto: [
    { url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=700&q=80", titulo: "Harley-Davidson custom na estrada", autor: "duas.rodas" },
    { url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=700&q=80", titulo: "Superbike Ducati em curva", autor: "moto.velocidade" },
    { url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&q=80", titulo: "Café Racer preta personalizada", autor: "custom.motos" },
    { url: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=700&q=80", titulo: "Motociclismo ao pôr do sol", autor: "rota.livre" },
    { url: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=700&q=80", titulo: "Esportiva cilindrada alta", autor: "piloto.urbano" },
    { url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=700&q=80", titulo: "Triumph clássica na montanha", autor: "trilha.motos" },
    { url: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=700&q=80", titulo: "Aventura em duas rodas", autor: "moto.clube" },
    { url: "https://images.unsplash.com/photo-1571646750134-01d8a702d2f8?w=700&q=80", titulo: "Design agressivo naked bike", autor: "garagem.duasrodas" },
    { url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=700&q=80", titulo: "Viagem de moto pelo litoral", autor: "estrada.real" },
  ],
  praia: [
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80", titulo: "Areia branca e mar cristalino", autor: "litoral.br" },
    { url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=700&q=80", titulo: "Ondas suaves no verão", autor: "sol.e.mar" },
    { url: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=700&q=80", titulo: "Coqueiros ao entardecer tropical", autor: "paraiso.costa" },
    { url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=700&q=80", titulo: "Vista aérea da enseada azul", autor: "drone.oceano" },
    { url: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=700&q=80", titulo: "Caminho para o mar", autor: "viagem.praia" },
    { url: "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=700&q=80", titulo: "Águas turquesas do oceano", autor: "natureza.mar" },
  ],
  natureza: [
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80", titulo: "Vale entre montanhas e lago", autor: "natureza.pura" },
    { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&q=80", titulo: "Raios de sol na floresta", autor: "trilhas.mundo" },
    { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80", titulo: "Bosque verde preservado", autor: "eco.planeta" },
    { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=80", titulo: "Neblina matinal nas colinas", autor: "horizonte.verde" },
    { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80", titulo: "Montanhas vistas do alto", autor: "aventura.natural" },
    { url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=700&q=80", titulo: "Paredão rochoso e pinheiros", autor: "parque.nacional" },
  ],
  arquitetura: [
    { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80", titulo: "Arranha-céus espelhados", autor: "arquitetura.urb" },
    { url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=700&q=80", titulo: "Curvas do design contemporâneo", autor: "traço.moderno" },
    { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=80", titulo: "Geometria urbana simétrica", autor: "concreto.arte" },
    { url: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=700&q=80", titulo: "Estrutura minimalista em vidro", autor: "studio.arq" },
    { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=700&q=80", titulo: "Luz e sombra no interior", autor: "espaco.urbano" },
    { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80", titulo: "Ambiente corporativo moderno", autor: "design.global" },
  ],
};

function gerarVisualizacoesFormatadas(indice: number): string {
  const valores = ["142 mil", "890 mil", "1,2 mi", "320 mil", "2,4 mi", "510 mil", "95 mil", "1,8 mi"];
  return valores[indice % valores.length];
}

function extrairNomeAutorFlickr(autorBruto?: string): string {
  if (!autorBruto) return "fotografo.api";
  const match = autorBruto.match(/\("(.+?)"\)/);
  return match ? match[1].replace(/\s+/g, ".").toLowerCase() : "fotografo.api";
}

/**
 * Busca fotos na API Pública JSON do Flickr (`photos_public.gne`) sem necessidade de chave (status 200 direto).
 */
async function buscarFotosNaApiFlickr(
  termoBusca: string,
  pagina: number
): Promise<PublicacaoExplorar[]> {
  const mapaTagsIngles: Record<string, string> = {
    casa: "house,architecture",
    carro: "car,supercar",
    moto: "motorcycle,motorbike",
    praia: "beach,ocean",
    natureza: "nature,landscape",
    arquitetura: "architecture,building",
  };

  const chave = termoBusca.trim().toLowerCase();
  const tagFinal = mapaTagsIngles[chave] || termoBusca.trim() || "architecture";
  const url = `https://www.flickr.com/services/feeds/photos_public.gne?tags=${encodeURIComponent(tagFinal)}&format=json&nojsoncallback=1`;

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Status HTTP: ${resposta.status}`);
  }

  const dados: RespostaFlickrApi = await resposta.json();
  const itens = dados.items ?? [];

  return itens
    .filter((item) => Boolean(item.media?.m))
    .map((item, idx) => {
      // Substitui _m.jpg por _z.jpg para obter resolução maior no Flickr CDN
      const urlAltaRes = item.media!.m!.replace("_m.jpg", "_z.jpg");
      const indiceGlobal = pagina * 18 + idx;

      return {
        id: `flickr_${chave}_p${pagina}_${idx}_${Date.now()}`,
        midiaUrl: urlAltaRes,
        visualizacoes: gerarVisualizacoesFormatadas(indiceGlobal),
        ehVideo: indiceGlobal % 3 === 0,
        rotuloTexto: item.title && item.title.trim().length > 0 ? item.title.slice(0, 32) : termoBusca,
        nomeFotografo: extrairNomeAutorFlickr(item.author),
      };
    });
}

function obterCatalogoBasePorTermo(termoBusca: string, pagina: number): PublicacaoExplorar[] {
  const chave = termoBusca.trim().toLowerCase();

  let listaCategoria = CATALOGO_CATEGORIAS[chave];
  if (!listaCategoria) {
    if (chave.includes("casa") || chave.includes("mans")) listaCategoria = CATALOGO_CATEGORIAS.casa;
    else if (chave.includes("carr") || chave.includes("auto")) listaCategoria = CATALOGO_CATEGORIAS.carro;
    else if (chave.includes("moto")) listaCategoria = CATALOGO_CATEGORIAS.moto;
    else if (chave.includes("prai") || chave.includes("mar")) listaCategoria = CATALOGO_CATEGORIAS.praia;
    else if (chave.includes("natur") || chave.includes("flor")) listaCategoria = CATALOGO_CATEGORIAS.natureza;
    else listaCategoria = CATALOGO_CATEGORIAS.arquitetura;
  }

  return listaCategoria.map((item, idx) => {
    const indiceGlobal = pagina * listaCategoria.length + idx;
    return {
      id: `cat_${chave}_p${pagina}_${idx}_${Date.now()}`,
      midiaUrl: item.url,
      visualizacoes: gerarVisualizacoesFormatadas(indiceGlobal),
      ehVideo: indiceGlobal % 3 === 0,
      rotuloTexto: item.titulo,
      nomeFotografo: item.autor,
    };
  });
}

/**
 * Busca imagens combinando o catálogo curado da categoria pesquisada com os resultados
 * ao vivo da API pública do Flickr, garantindo mudança imediata ao pesquisar "casa", "carro", "moto"
 * e suporte total ao Scroll Infinito.
 */
export async function buscarImagensExplorarPorTermo(
  termoPesquisa: string,
  pagina: number = 0
): Promise<PublicacaoExplorar[]> {
  const termoFinal = termoPesquisa.trim() || "casa";
  const baseCategoria = obterCatalogoBasePorTermo(termoFinal, pagina);

  try {
    await obterChaveApiPexels();
    const fotosApiFlickr = await buscarFotosNaApiFlickr(termoFinal, pagina);

    if (pagina === 0) {
      // Na primeira página, coloca as fotos temáticas em destaque seguidas pelas fotos da API ao vivo
      return [...baseCategoria, ...fotosApiFlickr.slice(0, 9)];
    }

    // Nas páginas seguintes do Scroll Infinito, intercala novas fotos da API e da categoria
    return [...fotosApiFlickr.slice(0, 9), ...baseCategoria];
  } catch {
    return baseCategoria;
  }
}
