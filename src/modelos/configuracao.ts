export interface ItemConfiguracao {
  id: string;
  titulo: string;
  subtitulo?: string;
  iconeNome: string;
  rotaDestino?: string;
  valorDireita?: string;
  destaqueBadge?: string;
}

export interface SecaoConfiguracao {
  titulo: string;
  itens: ItemConfiguracao[];
}
