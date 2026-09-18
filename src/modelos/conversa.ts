import { Usuario } from "./usuario";

export interface ItemConversa {
  id: string;
  contato: Usuario;
  ultimaMensagem: string;
  tempoDecorrido: string;
  possuiMensagemNaoLida: boolean;
  estaOnline: boolean;
  tempoUltimaAtividade?: string;
}
