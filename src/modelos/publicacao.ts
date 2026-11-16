import { Usuario } from "./usuario";

export interface PublicacaoFeed {
  id: string;
  autor: Usuario;
  midiaUrl: string;
  legenda: string;
  localizacao?: string;
  audioNome?: string;
  outrasPessoasMarcadas?: string;
  curtidas: number;
  comentarios: number;
  criadoEm: string;
  ehReel?: boolean;
  estaCurtido?: boolean;
  estaSalvo?: boolean;
  textoSobreposto?: string;
  curtidoPorDestaque?: string;
  ehDoUsuarioAtual?: boolean;
}

export interface RegistroPublicacaoBanco {
  id: string;
  id_autor: string;
  nome_usuario: string;
  nome_completo: string;
  foto_autor_url: string;
  caminho_midia: string;
  legenda: string;
  localizacao: string | null;
  audio_nome: string | null;
  outras_pessoas_marcadas: string | null;
  texto_sobreposto: string | null;
  curtidas: number;
  esta_curtido: number;
  esta_salvo: number;
  eh_reel: number;
  eh_do_usuario_atual: number;
  curtido_por_destaque: string | null;
  criado_em: string;
  ordem_exibicao: number;
}

export interface PublicacaoExplorar {
  id: string;
  midiaUrl: string;
  visualizacoes: string;
  ehVideo: boolean;
  rotuloTexto?: string;
  nomeFotografo?: string;
}

export interface PublicacaoPerfil {
  id: string;
  midiaUrl: string;
  ehVideo?: boolean;
  visualizacoes?: string;
}
