import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

/**
 * Pasta física permanente dentro do aplicativo onde as fotos das publicações serão salvas.
 * Conforme o slide da aula:
 * FileSystem -> Guarda: arquivos (sem criptografia) -> Use para: fotos, PDFs, downloads.
 *
 * IMPORTANTE PARA A PROVA:
 * Nunca salvamos a imagem inteira (binário/base64 pesado) dentro do SQLite!
 * O fluxo profissional é:
 * 1. Copiar o arquivo de foto da câmera/galeria para o FileSystem (pasta permanente do app).
 * 2. Salvar apenas o texto do caminho (URI gerada pelo FileSystem) na coluna `caminho_midia` do SQLite.
 */
const PASTA_PUBLICACOES = `${FileSystem.documentDirectory ?? ""}publicacoes_feed/`;

/**
 * Garante que a pasta física `publicacoes_feed/` exista dentro do diretório de documentos do app.
 */
export async function garantirPastaPublicacoes(): Promise<void> {
  if (Platform.OS === "web" || !FileSystem.documentDirectory) {
    return;
  }

  const informacaoPasta = await FileSystem.getInfoAsync(PASTA_PUBLICACOES);
  if (!informacaoPasta.exists) {
    await FileSystem.makeDirectoryAsync(PASTA_PUBLICACOES, { intermediates: true });
  }
}

/**
 * 🎓 MÃO NA MASSA (ETAPA 5):
 * Copia uma foto escolhida na galeria ou tirada pela câmera (uriOrigem)
 * para a pasta permanente do aplicativo no FileSystem (caminhoDestino) e retorna o novo caminho salvo.
 *
 * Utilize:
 * await FileSystem.copyAsync({ from: uriOrigem, to: caminhoDestino });
 */
export async function salvarFotoNoSistemaArquivos(uriOrigem: string): Promise<string> {
  // Se estiver na Web ou já for uma URL remota (http/https), retorna a própria URI
  if (
    Platform.OS === "web" ||
    !FileSystem.documentDirectory ||
    uriOrigem.startsWith("http://") ||
    uriOrigem.startsWith("https://")
  ) {
    return uriOrigem;
  }

  await garantirPastaPublicacoes();

  const extensao = uriOrigem.split(".").pop()?.split("?")[0] || "jpg";
  const nomeArquivo = `foto_${Date.now()}.${extensao}`;
  const caminhoDestino = `${PASTA_PUBLICACOES}${nomeArquivo}`;
  await FileSystem.copyAsync({
    from: uriOrigem,
    to: caminhoDestino,
  });

  return caminhoDestino;
}

