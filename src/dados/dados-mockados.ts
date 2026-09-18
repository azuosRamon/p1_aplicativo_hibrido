import { Usuario, NotaUsuario } from "@/modelos/usuario";
import { PublicacaoFeed, PublicacaoExplorar, PublicacaoPerfil } from "@/modelos/publicacao";
import { ItemStory } from "@/modelos/story";
import { ItemConversa } from "@/modelos/conversa";
import { ItemDestaque } from "@/modelos/destaque";
import { ItemColecaoSalva } from "@/modelos/colecao";
import { SecaoConfiguracao } from "@/modelos/configuracao";

// Usuário Principal Logado (Genérico e Neutro)
export const usuarioAtualMock: Usuario = {
  id: "usuario_atual",
  nomeUsuario: "ramon.dev",
  nomeCompleto: "Ramon Souza",
  fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  biografia: "Desenvolvedor de Software Móvel 📱\nCriando experiências fluidas com React Native & Expo\nRio de Janeiro, Brasil 🇧🇷",
  cidade: "Rio de Janeiro/RJ",
  profissao: "Engenheiro de Software",
  ano: "2026",
  linkThreads: "threads.net/@ramon.dev",
  totalPublicacoes: 12,
  totalSeguidores: 842,
  totalSeguindo: 512,
  visualizacoesPainel: 420,
  possuiStoryNaoVisto: false,
  nota: {
    id: "nota_atual",
    texto: "Construindo o novo app...",
    musica: {
      titulo: "Midnight City",
      artista: "M83",
    },
  },
};

// Stories da Barra Superior
export const storiesMock: ItemStory[] = [
  {
    id: "story_proprio",
    nomeUsuario: "Seu story",
    fotoUsuarioUrl: usuarioAtualMock.fotoUrl,
    possuiStoryNaoVisto: false,
    ehSeuStory: true,
  },
  {
    id: "story_1",
    nomeUsuario: "design.minimal",
    fotoUsuarioUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    possuiStoryNaoVisto: true,
  },
  {
    id: "story_2",
    nomeUsuario: "natureza.pura",
    fotoUsuarioUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    possuiStoryNaoVisto: true,
  },
  {
    id: "story_3",
    nomeUsuario: "codigo.cafe",
    fotoUsuarioUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    possuiStoryNaoVisto: true,
  },
  {
    id: "story_4",
    nomeUsuario: "arquitetura.urb",
    fotoUsuarioUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
    possuiStoryNaoVisto: true,
  },
  {
    id: "story_5",
    nomeUsuario: "fotografia.arte",
    fotoUsuarioUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80",
    possuiStoryNaoVisto: false,
  },
];

// Publicações do Feed Principal
export const publicacoesFeedMock: PublicacaoFeed[] = [
  {
    id: "feed_1",
    autor: {
      id: "autor_1",
      nomeUsuario: "arquitetura.urb",
      nomeCompleto: "Arquitetura Urbana",
      fotoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
      biografia: "Estudos de iluminação e sustentabilidade",
      totalPublicacoes: 84,
      totalSeguidores: 12500,
      totalSeguindo: 320,
    },
    midiaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&auto=format&fit=crop&q=80",
    legenda: "Design minimalista contemporâneo com aproveitamento de luz natural e ventilação cruzada. O que acharam dessa composição? 🏛️✨",
    audioNome: "Lofi Beats • Relaxing Sound",
    outrasPessoasMarcadas: "decor.moderna e outras 2 pessoas",
    curtidas: 1420,
    comentarios: 89,
    criadoEm: "Há 2 horas",
    ehReel: false,
    estaCurtido: false,
    estaSalvo: false,
    textoSobreposto: "Como planejar a iluminação ideal para espaços integrados? 💡",
  },
  {
    id: "feed_2",
    autor: {
      id: "autor_2",
      nomeUsuario: "codigo.cafe",
      nomeCompleto: "Código & Café",
      fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      biografia: "Dicas de desenvolvimento mobile e produtividade",
      totalPublicacoes: 140,
      totalSeguidores: 28400,
      totalSeguindo: 190,
    },
    midiaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1080&auto=format&fit=crop&q=80",
    legenda: "Criando componentes acessíveis e fluidos com React Native e Expo SDK 57. A experiência nativa faz toda a diferença no mobile! 🚀📱",
    audioNome: "Synthesizer Wave • Ambient Code",
    curtidas: 3580,
    comentarios: 215,
    criadoEm: "Há 5 horas",
    ehReel: true,
    estaCurtido: true,
    estaSalvo: true,
    textoSobreposto: "Três dicas para deixar suas animações 60 FPS estáveis!",
  },
];

// Notas do Direct
export const notasDirectMock: { id: string; contato: Usuario; nota: NotaUsuario }[] = [
  {
    id: "nota_1",
    contato: usuarioAtualMock,
    nota: {
      id: "n_propria",
      texto: "Compartilhe uma música...",
    },
  },
  {
    id: "nota_2",
    contato: {
      id: "contato_gisele",
      nomeUsuario: "gisele.bastos",
      nomeCompleto: "Gisele Bastos",
      fotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
      biografia: "Designer de Interfaces",
      totalPublicacoes: 22,
      totalSeguidores: 890,
      totalSeguindo: 400,
    },
    nota: {
      id: "n_gisele",
      musica: {
        titulo: "Pra Ficar Bem",
        artista: "Silva",
      },
    },
  },
  {
    id: "nota_3",
    contato: {
      id: "contato_alessandra",
      nomeUsuario: "alessandra.ar",
      nomeCompleto: "Alessandra Arruda",
      fotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      biografia: "Fotografia Criativa",
      totalPublicacoes: 65,
      totalSeguidores: 1400,
      totalSeguindo: 320,
    },
    nota: {
      id: "n_alessandra",
      musica: {
        titulo: "Ouvi Dizer",
        artista: "Melim",
      },
    },
  },
];

// Conversas do Direct
export const conversasMock: ItemConversa[] = [
  {
    id: "conv_1",
    contato: {
      id: "contato_clara",
      nomeUsuario: "clara.design",
      nomeCompleto: "Clara Mendes",
      fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      biografia: "UI/UX & Product Design",
      totalPublicacoes: 40,
      totalSeguidores: 1200,
      totalSeguindo: 300,
    },
    ultimaMensagem: "Online há 13 min",
    tempoDecorrido: "13 min",
    possuiMensagemNaoLida: false,
    estaOnline: false,
    tempoUltimaAtividade: "Online há 13 min",
  },
  {
    id: "conv_2",
    contato: {
      id: "contato_raquel",
      nomeUsuario: "raquel.fontes",
      nomeCompleto: "Raquel Fontes",
      fotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
      biografia: "Engenheira de Dados",
      totalPublicacoes: 18,
      totalSeguidores: 670,
      totalSeguindo: 410,
    },
    ultimaMensagem: "Legal! Vou dar uma olhada nisso amanhã.",
    tempoDecorrido: "3 d",
    possuiMensagemNaoLida: true,
    estaOnline: false,
    tempoUltimaAtividade: "3 d",
  },
  {
    id: "conv_3",
    contato: {
      id: "contato_marcos",
      nomeUsuario: "marcos.tech",
      nomeCompleto: "Marcos Lima",
      fotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      biografia: "Mobile Lead & Entusiasta Expo",
      totalPublicacoes: 92,
      totalSeguidores: 4300,
      totalSeguindo: 510,
    },
    ultimaMensagem: "Online agora",
    tempoDecorrido: "Agora",
    possuiMensagemNaoLida: false,
    estaOnline: true,
    tempoUltimaAtividade: "Online agora",
  },
  {
    id: "conv_4",
    contato: {
      id: "contato_gabriel",
      nomeUsuario: "gabriel.amorim",
      nomeCompleto: "Gabriel Amorim",
      fotoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
      biografia: "Fotógrafo de Viagens",
      totalPublicacoes: 120,
      totalSeguidores: 3100,
      totalSeguindo: 600,
    },
    ultimaMensagem: "Online há 7 min",
    tempoDecorrido: "7 min",
    possuiMensagemNaoLida: false,
    estaOnline: false,
    tempoUltimaAtividade: "Online há 7 min",
  },
];

// Publicações da Grade Explorar
export const publicacoesExplorarMock: PublicacaoExplorar[] = [
  {
    id: "exp_1",
    midiaUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "271 mil",
    ehVideo: true,
    rotuloTexto: "Arquitetura moderna",
  },
  {
    id: "exp_2",
    midiaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "1,4 mi",
    ehVideo: true,
    rotuloTexto: "Eletrônica & Tech",
  },
  {
    id: "exp_3",
    midiaUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "1,7 mi",
    ehVideo: false,
    rotuloTexto: "Edifícios icônicos",
  },
  {
    id: "exp_4",
    midiaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "516 mil",
    ehVideo: true,
    rotuloTexto: "Natureza exuberante",
  },
  {
    id: "exp_5",
    midiaUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "1,8 mi",
    ehVideo: true,
    rotuloTexto: "Luzes de neon",
  },
  {
    id: "exp_6",
    midiaUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "257 mil",
    ehVideo: false,
    rotuloTexto: "Casas sustentáveis",
  },
  {
    id: "exp_7",
    midiaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "1,6 mi",
    ehVideo: true,
    rotuloTexto: "Setup dev 2026",
  },
  {
    id: "exp_8",
    midiaUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "890 mil",
    ehVideo: false,
    rotuloTexto: "Trilhas & Montanhas",
  },
  {
    id: "exp_9",
    midiaUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "340 mil",
    ehVideo: true,
    rotuloTexto: "Minimalismo diário",
  },
];

// Destaques do Perfil
export const destaquesPerfilMock: ItemDestaque[] = [
  {
    id: "dest_novo",
    titulo: "Novo",
    capaUrl: "",
    ehNovo: true,
  },
  {
    id: "dest_1",
    titulo: "Shows",
    capaUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "dest_2",
    titulo: "Viagens",
    capaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "dest_3",
    titulo: "Código",
    capaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80",
  },
];

// Publicações do Perfil (3 colunas)
export const publicacoesPerfilMock: PublicacaoPerfil[] = [
  {
    id: "perf_1",
    midiaUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    ehVideo: false,
  },
  {
    id: "perf_2",
    midiaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
    ehVideo: false,
  },
  {
    id: "perf_3",
    midiaUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    ehVideo: true,
    visualizacoes: "1,2 mil",
  },
  {
    id: "perf_4",
    midiaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80",
    ehVideo: false,
  },
  {
    id: "perf_5",
    midiaUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    ehVideo: true,
    visualizacoes: "3,4 mil",
  },
  {
    id: "perf_6",
    midiaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80",
    ehVideo: false,
  },
];

// Coleções Salvas
export const colecoesSalvasMock: ItemColecaoSalva[] = [
  {
    id: "col_1",
    titulo: "Áudio & Músicas",
    capaUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
    ehPrivada: true,
    totalItens: 18,
  },
  {
    id: "col_2",
    titulo: "Inspirações UI/UX",
    capaUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80",
    ehPrivada: true,
    totalItens: 42,
  },
];

// Publicações Salvas (Reels e Posts)
export const publicacoesSalvasMock: PublicacaoExplorar[] = [
  {
    id: "salvo_1",
    midiaUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "1,2 mi",
    ehVideo: true,
  },
  {
    id: "salvo_2",
    midiaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "450 mil",
    ehVideo: true,
  },
  {
    id: "salvo_3",
    midiaUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "980 mil",
    ehVideo: false,
  },
  {
    id: "salvo_4",
    midiaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "2,1 mi",
    ehVideo: true,
  },
  {
    id: "salvo_5",
    midiaUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "1,5 mi",
    ehVideo: true,
  },
  {
    id: "salvo_6",
    midiaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    visualizacoes: "620 mil",
    ehVideo: true,
  },
];

// Seções da Tela de Configurações
export const secoesConfiguracaoMock: SecaoConfiguracao[] = [
  {
    titulo: "Sua conta",
    itens: [
      {
        id: "conf_central_contas",
        titulo: "Central de Contas",
        subtitulo: "Senha, segurança, dados pessoais, experiências conectadas",
        iconeNome: "person-circle-outline",
      },
    ],
  },
  {
    titulo: "Como você usa o Instagram",
    itens: [
      {
        id: "conf_salvos",
        titulo: "Salvos",
        iconeNome: "bookmark-outline",
        rotaDestino: "/salvos",
      },
      {
        id: "conf_arquivados",
        titulo: "Itens Arquivados",
        iconeNome: "time-outline",
      },
      {
        id: "conf_atividade",
        titulo: "Sua atividade",
        iconeNome: "trending-up-outline",
      },
      {
        id: "conf_notificacoes",
        titulo: "Notificações",
        iconeNome: "notifications-outline",
      },
      {
        id: "conf_tempo",
        titulo: "Gerenciamento de tempo",
        iconeNome: "alarm-outline",
      },
      {
        id: "conf_ipad",
        titulo: "Instagram para iPad",
        iconeNome: "tablet-portrait-outline",
      },
    ],
  },
  {
    titulo: "Quem pode ver seu conteúdo",
    itens: [
      {
        id: "conf_privacidade",
        titulo: "Privacidade da conta",
        iconeNome: "lock-closed-outline",
        valorDireita: "Público",
      },
      {
        id: "conf_amigos_proximos",
        titulo: "Amigos Próximos",
        iconeNome: "star-outline",
        valorDireita: "9",
      },
      {
        id: "conf_posts_cruzados",
        titulo: "Posts cruzados",
        iconeNome: "grid-outline",
      },
    ],
  },
];
