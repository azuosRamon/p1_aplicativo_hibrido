### TELAS CRIADAS (P1 + P2)
1. Início (Feed Principal sincronizado com SQLite)
2. Mensagens (Direct)
3. Explorar (Integrado com API REST de busca de fotos por palavra-chave: `"casa"`, `"carro"`, `"moto"`, etc., com Scroll Infinito e abertura em formato de Post)
4. Perfil (Grade de 3 colunas sincronizada com SQLite e abertura em formato Scroll posicionado na foto clicada)
5. Configurações
6. Salvos (Sincronizado em tempo real com SQLite e abertura posicionada no item salvo clicado)
7. Novo Post — 1ª Etapa: Seleção de Foto da Galeria / Câmera (`src/app/novo-post/index.tsx`)
8. Novo Post — 2ª Etapa: Adição de Legenda e Compartilhamento (`src/app/novo-post/legenda.tsx`)
9. Posts do Perfil em Formato Scroll de Feed (`src/app/publicacoes-perfil.tsx`)
10. Comentários da Publicação em Modal / Bottom Sheet (`src/app/comentarios.tsx`)

### ARQUITETURA DE ARMAZENAMENTO E API (P2)
- **FileSystem (`expo-file-system`)**: Salva os arquivos físicos das fotos capturadas pela câmera ou escolhidas na galeria dentro da pasta permanente do aplicativo (`documentDirectory/publicacoes_feed/`).
- **SQLite (`expo-sqlite`)**: Banco de dados relacional com as tabelas `publicacoes` e `comentarios` (com chave estrangeira `FOREIGN KEY`), carga inicial (*seed*) dos posts existentes e persistência offline completa de posts, curtidas, salvos e comentários.
- **AsyncStorage (`@react-native-async-storage/async-storage`)**: Armazena preferências e histórico recente de termos pesquisados na aba Explorar.
- **SecureStore (`expo-secure-store`)**: Armazena credenciais e chave da API de forma criptografada no Keychain (iOS) / Keystore (Android).

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
