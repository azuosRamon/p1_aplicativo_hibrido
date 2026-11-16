import { useState, useEffect, useCallback, useRef } from "react";
import { PublicacaoExplorar } from "@/modelos/publicacao";
import { buscarImagensExplorarPorTermo } from "@/servicos/servico-api-fotos";
import {
  CHAVES_PREFERENCIAS,
  buscarPreferenciaTexto,
  registrarTermoPesquisado,
  obterHistoricoBuscas,
} from "@/servicos/servico-preferencias";

/**
 * Gancho customizado (Custom Hook) que conecta a tela Explorar:
 * 1. Ao serviço de API de imagens (`buscarImagensExplorarPorTermo`) com Paginação / Scroll Infinito.
 * 2. Ao `AsyncStorage` (`registrarTermoPesquisado` e `obterHistoricoBuscas`).
 */
export function usarBuscaExplorar() {
  "use no memo";
  const [termoPesquisa, setTermoPesquisa] = useState<string>("casa");
  const [termoAtivoApi, setTermoAtivoApi] = useState<string>("casa");
  const [itensExplorar, setItensExplorar] = useState<PublicacaoExplorar[]>([]);
  const [estaCarregando, setEstaCarregando] = useState<boolean>(true);
  const [estaCarregandoMais, setEstaCarregandoMais] = useState<boolean>(false);
  const [paginaAtual, setPaginaAtual] = useState<number>(0);
  const [historicoRecente, setHistoricoRecente] = useState<string[]>(["casa", "carro", "moto"]);

  const jaInicializou = useRef<boolean>(false);

  const executarPesquisa = useCallback(async (termo: string) => {
    const termoFinal = termo.trim() || "casa";
    setTermoAtivoApi(termoFinal);
    setPaginaAtual(0);
    setEstaCarregando(true);

    try {
      const resultados = await buscarImagensExplorarPorTermo(termoFinal, 0);
      setItensExplorar(resultados);

      const novoHistorico = await registrarTermoPesquisado(termoFinal);
      setHistoricoRecente(novoHistorico);
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  // Carrega o próximo lote de fotos da API quando o usuário chega ao fim da rolagem (Scroll Infinito)
  const carregarMaisResultados = useCallback(async () => {
    if (estaCarregando || estaCarregandoMais) {
      return;
    }

    const proximaPagina = paginaAtual + 1;
    setEstaCarregandoMais(true);

    try {
      const novosItens = await buscarImagensExplorarPorTermo(termoAtivoApi, proximaPagina);
      if (novosItens.length > 0) {
        setPaginaAtual(proximaPagina);
        setItensExplorar((anterior) => [...anterior, ...novosItens]);
      }
    } finally {
      setEstaCarregandoMais(false);
    }
  }, [estaCarregando, estaCarregandoMais, paginaAtual, termoAtivoApi]);

  // Inicializa com o último termo salvo no AsyncStorage
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
      jaInicializou.current = true;
    }

    inicializarExplorar();
  }, [executarPesquisa]);

  // Busca automática (debounce de 500ms) conforme o usuário digita na barra de pesquisa
  useEffect(() => {
    if (!jaInicializou.current) {
      return;
    }
    const termoLimpo = termoPesquisa.trim();
    if (!termoLimpo || termoLimpo.toLowerCase() === termoAtivoApi.toLowerCase()) {
      return;
    }

    const temporizador = setTimeout(() => {
      executarPesquisa(termoLimpo);
    }, 500);

    return () => clearTimeout(temporizador);
  }, [termoPesquisa, termoAtivoApi, executarPesquisa]);

  return {
    termoPesquisa,
    setTermoPesquisa,
    itensExplorar,
    estaCarregando,
    estaCarregandoMais,
    historicoRecente,
    executarPesquisa,
    carregarMaisResultados,
  };
}
