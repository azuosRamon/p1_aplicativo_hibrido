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
  publicacoesSalvas: PublicacaoFeed[];
  estaCarregando: boolean;
  recarregarPublicacoes: () => Promise<void>;
  criarPublicacao: (uriFoto: string, legenda: string, localizacao?: string) => Promise<PublicacaoFeed>;
  alternarCurtida: (idPublicacao: string) => Promise<void>;
  alternarSalvo: (idPublicacao: string, postExterno?: PublicacaoFeed) => Promise<void>;
  buscarComentarios: (idPublicacao: string) => Promise<ComentarioPublicacao[]>;
  adicionarComentario: (idPublicacao: string, texto: string) => Promise<ComentarioPublicacao>;
  alternarCurtidaComentario: (
    idComentario: string,
    novoEstadoCurtido: boolean,
    novoTotalCurtidas: number
  ) => Promise<void>;
}

const ContextoPublicacoes = createContext<DadosContextoPublicacoes | undefined>(undefined);

const legendasPerfilIniciais = [
  "Foco total nos treinos e evolução diária! 💪🔥",
  "Final de tarde incrível na praia, recarregando as energias 🌊☀️",
  "Explorando novos ângulos e composições na fotografia urbana 📸✨",
  "Construindo aplicativos híbridos modernos com React Native, Expo e SQLite 🚀📱",
  "Dia de imersão em arquitetura de software e performance mobile ⚡",
  "Inspiração em design minimalista e iluminação natural 🏛️",
];

function montarFallbackInicial(): PublicacaoFeed[] {
  const postsFeed = publicacoesFeedMock.map((post) => ({
    ...post,
    comentarios: post.id === "feed_1" || post.id === "feed_2" ? 1 : post.comentarios,
    curtidoPorDestaque: "aleisa2015",
    ehDoUsuarioAtual: false,
  }));

  const postsPerfilConvertidos: PublicacaoFeed[] = publicacoesPerfilMock.map((item, idx) => ({
    id: item.id,
    autor: usuarioAtualMock,
    midiaUrl: item.midiaUrl,
    legenda: legendasPerfilIniciais[idx] ?? "Registro especial no perfil ✨",
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

  return [...postsFeed, ...postsPerfilConvertidos];
}

export function ProvedorPublicacoes({ children }: { children: React.ReactNode }) {
  "use no memo";
  // Inicializa já com os posts prontos para nunca travar a tela inicial em estado vazio
  const [publicacoes, setPublicacoes] = useState<PublicacaoFeed[]>(() => montarFallbackInicial());
  const [estaCarregando, setEstaCarregando] = useState<boolean>(false);

  const recarregarPublicacoes = useCallback(async () => {
    try {
      const listaBanco = await listarPublicacoesDoBanco();
      if (listaBanco.length > 0) {
        setPublicacoes(listaBanco);
      }
    } catch (erro) {
      console.warn("Usando lista inicial em memória (fallback SQLite):", erro);
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
      setPublicacoes((anterior) => [nova, ...anterior]);
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
    let novoEstadoCurtido = false;
    let novoTotalCurtidas = 0;
    let encontrou = false;

    setPublicacoes((anterior) =>
      anterior.map((p) => {
        if (p.id !== idPublicacao) return p;
        encontrou = true;
        novoEstadoCurtido = !p.estaCurtido;
        novoTotalCurtidas = novoEstadoCurtido ? p.curtidas + 1 : Math.max(0, p.curtidas - 1);
        return { ...p, estaCurtido: novoEstadoCurtido, curtidas: novoTotalCurtidas };
      })
    );

    if (!encontrou) return;

    try {
      await alternarCurtidaNoBanco(idPublicacao, novoEstadoCurtido, novoTotalCurtidas);
    } catch (erro) {
      console.warn("Erro ao persistir curtida no SQLite:", erro);
    }
  }

  async function alternarSalvo(
    idPublicacao: string,
    postExterno?: PublicacaoFeed
  ): Promise<void> {
    let novoEstadoSalvo = false;
    let encontrou = false;

    setPublicacoes((anterior) => {
      const existe = anterior.some((p) => p.id === idPublicacao);
      if (!existe && postExterno) {
        encontrou = true;
        novoEstadoSalvo = true;
        return [{ ...postExterno, estaSalvo: true }, ...anterior];
      }

      return anterior.map((p) => {
        if (p.id !== idPublicacao) return p;
        encontrou = true;
        novoEstadoSalvo = !p.estaSalvo;
        return { ...p, estaSalvo: novoEstadoSalvo };
      });
    });

    if (!encontrou) return;

    try {
      await alternarSalvoNoBanco(idPublicacao, novoEstadoSalvo, postExterno);
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
    try {
      const novoComentario = await inserirNovoComentarioNoBanco(idPublicacao, texto);
      setPublicacoes((anterior) =>
        anterior.map((p) =>
          p.id === idPublicacao ? { ...p, comentarios: p.comentarios + 1 } : p
        )
      );
      return novoComentario;
    } catch (erro) {
      console.warn("Fallback ao adicionar comentário:", erro);
      const comentarioMemoria: ComentarioPublicacao = {
        id: `com_${Date.now()}`,
        idPublicacao,
        nomeUsuario: usuarioAtualMock.nomeUsuario,
        fotoUsuarioUrl: usuarioAtualMock.fotoUrl,
        texto: texto.trim(),
        tempoDecorrido: "Agora",
        curtidas: 0,
        estaCurtido: false,
        curtidoPeloAutor: false,
      };
      setPublicacoes((anterior) =>
        anterior.map((p) =>
          p.id === idPublicacao ? { ...p, comentarios: p.comentarios + 1 } : p
        )
      );
      return comentarioMemoria;
    }
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

  const publicacoesSalvas = publicacoes.filter((p) => Boolean(p.estaSalvo));

  return (
    <ContextoPublicacoes.Provider
      value={{
        publicacoes,
        publicacoesDoUsuario,
        publicacoesSalvas,
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
