/**
 * Sistema de Design Oficial do Instagram (Tema Escuro OLED)
 * Contém tokens de cores, tipografia, espaçamento e raios de borda.
 */

export const CoresInstagram = {
  // Fundos e Superfícies
  fundo: "#000000",
  fundoSecundario: "#121212",
  fundoElevado: "#1C1C1E",
  fundoEntrada: "#262626",
  fundoPill: "#262626",
  fundoBarraFlutuante: "rgba(22, 22, 24, 0.96)",
  fundoAbaSelecionada: "#2C2C2E",

  // Divisores e Bordas
  borda: "#262626",
  bordaSuave: "#1F1F1F",
  bordaDestaque: "#363636",

  // Textos
  textoPrimario: "#FFFFFF",
  textoSecundario: "#A8A8A8",
  textoSuave: "#737373",
  textoLink: "#E0F1FF",

  // Acentos e Notificações
  azulInstagram: "#0095F6",
  azulBotaoPressionado: "#0077C6",
  vermelhoNotificacao: "#FF3040",
  verdeOnline: "#10B981",
  azulNaoLido: "#3797EF",

  // Gradientes
  gradienteStories: ["#FBAA47", "#D91A46", "#A60F93"] as const,
  gradienteHistoriasVisto: ["#363636", "#262626"] as const,
};

export const Espacamentos = {
  minusculo: 4,
  pequeno: 8,
  medio: 12,
  padrao: 16,
  grande: 20,
  extraGrande: 24,
  enorme: 32,
};

export const RaiosBorda = {
  pequeno: 6,
  medio: 10,
  padrao: 14,
  grande: 20,
  pilula: 30,
  circular: 9999,
};

export const Tipografia = {
  tituloGrande: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: CoresInstagram.textoPrimario,
  },
  tituloMedio: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: CoresInstagram.textoPrimario,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: CoresInstagram.textoPrimario,
  },
  nomeUsuario: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: CoresInstagram.textoPrimario,
  },
  corpo: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: CoresInstagram.textoPrimario,
    lineHeight: 18,
  },
  subtitulo: {
    fontSize: 13,
    fontWeight: "400" as const,
    color: CoresInstagram.textoSecundario,
  },
  legenda: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: CoresInstagram.textoSuave,
  },
  contadorNumero: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: CoresInstagram.textoPrimario,
  },
  contadorRotulo: {
    fontSize: 13,
    fontWeight: "400" as const,
    color: CoresInstagram.textoPrimario,
  },
};
