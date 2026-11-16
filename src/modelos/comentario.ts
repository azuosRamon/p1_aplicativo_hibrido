export interface ComentarioPublicacao {
  id: string;
  idPublicacao: string;
  nomeUsuario: string;
  fotoUsuarioUrl: string;
  texto: string;
  tempoDecorrido: string;
  curtidas: number;
  estaCurtido: boolean;
  curtidoPeloAutor: boolean;
}

export interface RegistroComentarioBanco {
  id: string;
  id_publicacao: string;
  nome_usuario: string;
  foto_usuario_url: string;
  texto: string;
  tempo_decorrido: string;
  curtidas: number;
  esta_curtido: number;
  curtido_pelo_autor: number;
  criado_em_timestamp: number;
}

