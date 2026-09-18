import { Usuario } from "./usuario";

export interface PublicacaoFeed {
  id: string;
  autor: Usuario;
  midiaUrl: string;
  legenda: string;
  audioNome?: string;
  outrasPessoasMarcadas?: string;
  curtidas: number;
  comentarios: number;
  criadoEm: string;
  ehReel?: boolean;
  estaCurtido?: boolean;
  estaSalvo?: boolean;
  textoSobreposto?: string;
}

export interface PublicacaoExplorar {
  id: string;
  midiaUrl: string;
  visualizacoes: string;
  ehVideo: boolean;
  rotuloTexto?: string;
}

export interface PublicacaoPerfil {
  id: string;
  midiaUrl: string;
  ehVideo?: boolean;
  visualizacoes?: string;
}
