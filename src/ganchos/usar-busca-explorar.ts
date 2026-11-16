import { useState, useEffect, useCallback } from "react";
import { PublicacaoExplorar } from "@/modelos/publicacao";
import { buscarImagensExplorarPorTermo } from "@/servicos/servico-api-fotos";
import {
  CHAVES_PREFERENCIAS,
  buscarPreferenciaTexto,
  registrarTermoPesquisado,
  obterHistoricoBuscas,
} from "@/servicos/servico-preferencias";

/**
 * 🎓 MÃO NA MASSA (ETAPA 12):
 * Gancho customizado (Custom Hook) que conecta a tela Explorar:
 * 1. Ao serviço de API de imagens (`buscarImagensExplorarPorTermo`).
 * 2. Ao `AsyncStorage` (`registrarTermoPesquisado` e `obterHistoricoBuscas`).
 */
export function usarBuscaExplorar() {
  const [termoPesquisa, setTermoPesquisa] = useState<string>("");
  const [itensExplorar, setItensExplorar] = useState<PublicacaoExplorar[]>([]);
  const [estaCarregando, setEstaCarregando] = useState<boolean>(true);
  const [historicoRecente, setHistoricoRecente] = useState<string[]>(["casa", "carro", "moto"]);

  const executarPesquisa = useCallback(async (termo: string) => {
    const termoFinal = termo.trim() || "casa";
    setEstaCarregando(true);

    try {
      const resultados = await buscarImagensExplorarPorTermo(termoFinal);
      setItensExplorar(resultados);

      const novoHistorico = await registrarTermoPesquisado(termoFinal);
      setHistoricoRecente(novoHistorico);
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  // Carrega o último termo salvo no AsyncStorage quando a tela Explorar abre
  useEffect(() => {
    async function inicializarExplorar() {
      const historicoSalvo = await obterHistoricoBuscas();
      setHistoricoRecente(historicoSalvo);

      const ultimoTermo = await buscarPreferenciaTexto(
        CHAVES_PREFERENCIAS.ULTIMO_TERMO_EXPLORAR
      );
      const termoInicial = ultimoTermo || "casa";
      setTermoPesquisa(termoInicial);
      await executarPesquisa(termoInicial);
    }

    inicializarExplorar();
  }, [executarPesquisa]);

  return {
    termoPesquisa,
    setTermoPesquisa,
    itensExplorar,
    estaCarregando,
    historicoRecente,
    executarPesquisa,
  };
}

