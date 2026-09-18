export interface NotaUsuario {
  id: string;
  texto?: string;
  musica?: {
    titulo: string;
    artista: string;
  };
}

export interface Usuario {
  id: string;
  nomeUsuario: string;
  nomeCompleto: string;
  fotoUrl: string;
  biografia: string;
  cidade?: string;
  profissao?: string;
  ano?: string;
  linkThreads?: string;
  totalPublicacoes: number;
  totalSeguidores: number;
  totalSeguindo: number;
  visualizacoesPainel?: number;
  possuiStoryNaoVisto?: boolean;
  nota?: NotaUsuario;
}
