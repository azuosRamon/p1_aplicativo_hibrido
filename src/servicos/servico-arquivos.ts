import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

/**
 * Pasta física permanente dentro do aplicativo onde as fotos das publicações serão salvas.
 * Conforme o slide da aula:
 * FileSystem -> Guarda: arquivos (sem criptografia) -> Use para: fotos, PDFs, downloads.
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
 * Copia uma foto escolhida na galeria ou tirada pela câmera (uriOrigem)
 * para a pasta permanente do aplicativo no FileSystem (caminhoDestino) e retorna o novo caminho salvo.
 */
export async function salvarFotoNoSistemaArquivos(uriOrigem: string): Promise<string> {
  if (
    Platform.OS === "web" ||
    !FileSystem.documentDirectory ||
    uriOrigem.startsWith("http://") ||
    uriOrigem.startsWith("https://")
  ) {
    return uriOrigem;
  }

  try {
    await garantirPastaPublicacoes();

    const extensao = uriOrigem.split(".").pop()?.split("?")[0] || "jpg";
    const nomeArquivo = `foto_${Date.now()}.${extensao}`;
    const caminhoDestino = `${PASTA_PUBLICACOES}${nomeArquivo}`;

    await FileSystem.copyAsync({
      from: uriOrigem,
      to: caminhoDestino,
    });

    return caminhoDestino;
  } catch (erro) {
    console.warn("Aviso ao copiar foto para o FileSystem (mantendo URI original):", erro);
    return uriOrigem;
  }
}
