import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { PublicacaoFeed } from "@/modelos/publicacao";
import { ComentarioPublicacao } from "@/modelos/comentario";
import {
  listarPublicacoesDoBanco,
  criarNovaPublicacaoNoBanco,
  alternarCurtidaNoBanco,
  alternarSalvoNoBanco,
} from "@/servicos/banco-dados/repositorio-publicacoes";
import {
  listarComentariosDaPublicacao,
  inserirNovoComentarioNoBanco,
  alternarCurtidaComentarioNoBanco,
} from "@/servicos/banco-dados/repositorio-comentarios";
import { publicacoesFeedMock, publicacoesPerfilMock, usuarioAtualMock } from "@/dados/dados-mockados";

interface DadosContextoPublicacoes {
  publicacoes: PublicacaoFeed[];
  publicacoesDoUsuario: PublicacaoFeed[];
  estaCarregando: boolean;
  recarregarPublicacoes: () => Promise<void>;
  criarPublicacao: (uriFoto: string, legenda: string, localizacao?: string) => Promise<PublicacaoFeed>;
  alternarCurtida: (idPublicacao: string) => Promise<void>;
  alternarSalvo: (idPublicacao: string) => Promise<void>;
  buscarComentarios: (idPublicacao: string) => Promise<ComentarioPublicacao[]>;
  adicionarComentario: (idPublicacao: string, texto: string) => Promise<ComentarioPublicacao>;
  alternarCurtidaComentario: (
    idComentario: string,
    novoEstadoCurtido: boolean,
    novoTotalCurtidas: number
  ) => Promise<void>;
}

const ContextoPublicacoes = createContext<DadosContextoPublicacoes | undefined>(undefined);

function montarFallbackInicial(): PublicacaoFeed[] {
  const postsPerfilConvertidos: PublicacaoFeed[] = publicacoesPerfilMock.map((item, idx) => ({
    id: item.id,
    autor: usuarioAtualMock,
    midiaUrl: item.midiaUrl,
    legenda: "Registro especial no perfil ✨",
    localizacao: "Maricá",
    curtidas: 48 + idx * 15,
    comentarios: idx === 0 ? 1 : 0,
    criadoEm: "3 de março de 2024",
    ehReel: item.ehVideo ?? false,
    estaCurtido: false,
    estaSalvo: false,
    curtidoPorDestaque: "aleisa2015",
    ehDoUsuarioAtual: true,
  }));

  return [...publicacoesFeedMock, ...postsPerfilConvertidos];
}

export function ProvedorPublicacoes({ children }: { children: React.ReactNode }) {
  const [publicacoes, setPublicacoes] = useState<PublicacaoFeed[]>([]);
  const [estaCarregando, setEstaCarregando] = useState<boolean>(true);

  const recarregarPublicacoes = useCallback(async () => {
    try {
      const listaBanco = await listarPublicacoesDoBanco();
      setPublicacoes(listaBanco);
    } catch (erro) {
      console.warn("Usando lista em memória (fallback SQLite):", erro);
      setPublicacoes((atual) => (atual.length > 0 ? atual : montarFallbackInicial()));
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregarPublicacoes();
  }, [recarregarPublicacoes]);

  async function criarPublicacao(
    uriFoto: string,
    legenda: string,
    localizacao: string = "Maricá"
  ): Promise<PublicacaoFeed> {
    try {
      const nova = await criarNovaPublicacaoNoBanco(uriFoto, legenda, localizacao);
      await recarregarPublicacoes();
      return nova;
    } catch (erro) {
      console.warn("Fallback ao criar publicação:", erro);
      const novaFallback: PublicacaoFeed = {
        id: `post_${Date.now()}`,
        autor: usuarioAtualMock,
        midiaUrl: uriFoto,
        legenda: legenda.trim(),
        localizacao,
        curtidas: 0,
        comentarios: 0,
        criadoEm: "Agora mesmo",
        ehReel: false,
        estaCurtido: false,
        estaSalvo: false,
        curtidoPorDestaque: "aleisa2015",
        ehDoUsuarioAtual: true,
      };
      setPublicacoes((anterior) => [novaFallback, ...anterior]);
      return novaFallback;
    }
  }

  async function alternarCurtida(idPublicacao: string): Promise<void> {
    const alvo = publicacoes.find((p) => p.id === idPublicacao);
    if (!alvo) return;

    const novoEstadoCurtido = !alvo.estaCurtido;
    const novoTotalCurtidas = novoEstadoCurtido ? alvo.curtidas + 1 : Math.max(0, alvo.curtidas - 1);

    setPublicacoes((anterior) =>
      anterior.map((p) =>
        p.id === idPublicacao
          ? { ...p, estaCurtido: novoEstadoCurtido, curtidas: novoTotalCurtidas }
          : p
      )
    );

    try {
      await alternarCurtidaNoBanco(idPublicacao, novoEstadoCurtido, novoTotalCurtidas);
    } catch (erro) {
      console.warn("Erro ao persistir curtida no SQLite:", erro);
    }
  }

  async function alternarSalvo(idPublicacao: string): Promise<void> {
    const alvo = publicacoes.find((p) => p.id === idPublicacao);
    if (!alvo) return;

    const novoEstadoSalvo = !alvo.estaSalvo;

    setPublicacoes((anterior) =>
      anterior.map((p) => (p.id === idPublicacao ? { ...p, estaSalvo: novoEstadoSalvo } : p))
    );

    try {
      await alternarSalvoNoBanco(idPublicacao, novoEstadoSalvo);
    } catch (erro) {
      console.warn("Erro ao persistir salvo no SQLite:", erro);
    }
  }

  async function buscarComentarios(idPublicacao: string): Promise<ComentarioPublicacao[]> {
    try {
      return await listarComentariosDaPublicacao(idPublicacao);
    } catch (erro) {
      console.warn("Erro ao buscar comentários no SQLite:", erro);
      return [];
    }
  }

  async function adicionarComentario(
    idPublicacao: string,
    texto: string
  ): Promise<ComentarioPublicacao> {
    const novoComentario = await inserirNovoComentarioNoBanco(idPublicacao, texto);

    setPublicacoes((anterior) =>
      anterior.map((p) =>
        p.id === idPublicacao ? { ...p, comentarios: p.comentarios + 1 } : p
      )
    );

    return novoComentario;
  }

  async function alternarCurtidaComentario(
    idComentario: string,
    novoEstadoCurtido: boolean,
    novoTotalCurtidas: number
  ): Promise<void> {
    try {
      await alternarCurtidaComentarioNoBanco(idComentario, novoEstadoCurtido, novoTotalCurtidas);
    } catch (erro) {
      console.warn("Erro ao curtir comentário no SQLite:", erro);
    }
  }

  const publicacoesDoUsuario = publicacoes.filter(
    (p) => p.ehDoUsuarioAtual || p.autor.id === usuarioAtualMock.id
  );

  return (
    <ContextoPublicacoes.Provider
      value={{
        publicacoes,
        publicacoesDoUsuario,
        estaCarregando,
        recarregarPublicacoes,
        criarPublicacao,
        alternarCurtida,
        alternarSalvo,
        buscarComentarios,
        adicionarComentario,
        alternarCurtidaComentario,
      }}
    >
      {children}
    </ContextoPublicacoes.Provider>
  );
}

export function usarPublicacoes(): DadosContextoPublicacoes {
  const contexto = useContext(ContextoPublicacoes);
  if (!contexto) {
    throw new Error("usarPublicacoes deve ser utilizado dentro de um ProvedorPublicacoes");
  }
  return contexto;
}
