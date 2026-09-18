# Diretrizes e Regras do Projeto (Expo & React Native)

## 1. Expo SDK 57
Consulte sempre a documentação oficial exata da versão antes de implementar ou modificar código:
https://docs.expo.dev/versions/v57.0.0/

## 2. Nomenclatura Obrigatória em Português do Brasil (pt-BR)
Toda e qualquer entidade criada no projeto DEVE utilizar a língua portuguesa do Brasil:
- **Funções e Métodos**: `camelCase` em pt-BR (ex: `buscarUsuarios()`, `tratarClique()`, `formatarData()`).
- **Variáveis e Constantes**: `camelCase` em pt-BR (ex: `usuarioAtual`, `estaCarregando`, `dadosResposta`).
- **Classes, Tipos e Interfaces**: `PascalCase` em pt-BR (ex: `PerfilUsuario`, `PropsBotao`, `ServicoNotificacao`).
- **Componentes React**: `PascalCase` em pt-BR (ex: `CartaoItem`, `CabecalhoPrincipal`, `ModalConfirmacao`).
- **Arquivos e Pastas**:
  - Pastas: `componentes/`, `ganchos/`, `servicos/`, `modelos/` (ou `tipos/`), `contextos/`, `utilitarios/`.
  - Arquivos: `kebab-case` em pt-BR (ex: `cartao-usuario.tsx`, `usar-autenticacao.ts`, `formatar-moeda.ts`).
- **Exceções Técnicas Específicas**:
  - Arquivos reservados do Expo Router necessários para roteamento estrutural (`_layout.tsx`, `index.tsx`, `+not-found.tsx`, `+html.tsx`, rotas dinâmicas como `[id].tsx`).
  - APIs externas de bibliotecas mantêm suas assinaturas nativas (`useState`, `useEffect`, `router.push`, `StyleSheet.create`), porém os valores desestruturados e manipuladores devem ser em pt-BR (`const [carregando, setCarregando] = useState(false)`).

## 3. Skill do Desenvolvedor
Consulte e utilize a skill especializada `.agents/skills/desenvolvedor-expo-react-native/SKILL.md` para práticas de arquitetura, acessibilidade, performance, navegação e componentização.
