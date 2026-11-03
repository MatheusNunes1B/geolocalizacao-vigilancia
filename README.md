# Vigilância Sanitária — Sistema de Vistorias

**Aluno:** 25 · **Tema:** Saúde — VigilanciaSanitaria
**Regra de negócio:** “Fiscal registra auto de vistoria em restaurante gravando o GPS local.”

Aplicação acadêmica em português para registrar autos de vistoria sanitária com a localização real fornecida pelo dispositivo. Interface responsiva, com dashboard, navegação lateral no desktop e navegação inferior no smartphone. Não há backend, autenticação nem transmissão automática de coordenadas.

## Tecnologias

React, TypeScript, Vite, Tailwind CSS, Lucide React, Capacitor 8, Android e plugins oficiais @capacitor/geolocation, @capacitor/app-launcher e @capacitor/share. Vitest para testes dos serviços e Playwright para testes dos fluxos web.

As versões efetivamente instaladas ficam fixadas no package-lock.json. O projeto foi criado em uma subpasta própria para preservar o projeto CineView presente no diretório inicial.

## Funcionalidades

- Dashboard com total de autos, vistorias do dia e quantidade com resultado conforme, calculados dos registros locais.
- Formulário com restaurante e fiscal obrigatórios, endereço opcional, data/hora, observações e resultado.
- Captura acionada explicitamente pelo usuário, com Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }).
- Permissões nativas verificadas com checkPermissions() e solicitadas com requestPermissions(), sem repetição automática.
- Permissão aproximada identificada separadamente da precisa no Android.
- Latitude, longitude, precisão em metros e horário da captura.
- Tratamento de permissão negada, localização desativada, timeout, coordenadas inválidas e falhas do dispositivo.
- Google Maps aberto voluntariamente com as coordenadas registradas, sem chave de API.
- Salvamento apenas de registros completos, IDs criptograficamente aleatórios e persistência em localStorage.
- Histórico com busca por restaurante, detalhes completos e exclusão confirmada.
- Compartilhamento nativo no Android; Web Share ou cópia para a área de transferência na web.
- Exportação .txt no navegador. No Android, use **Compartilhar auto** e escolha um aplicativo de destino.
- Nenhuma edição de coordenadas de autos salvos.

## Estrutura

```text
src/
  components/           # Cartão de vistoria, status e painel de localização
  pages/                # Dashboard, cadastro, histórico e detalhes
  services/             # Geolocalização e armazenamento, com testes
  types/                # Tipos e validação de registros
  utils/                # Google Maps, datas, compartilhamento e exportação
  App.tsx
  main.tsx
  index.css
e2e/                    # Testes web desktop e mobile
android/                # Projeto nativo gerado pelo Capacitor
capacitor.config.ts
```

## Requisitos do ambiente

- Node.js 22.12 ou superior em uma versão suportada pelo Vitest (por exemplo, 22 LTS ou 24 LTS) e npm.
- Para Android: Android Studio 2025.2.1 ou superior, Android SDK compatível com o projeto gerado e JDK 21 ou superior conforme exigido pela versão do Gradle/Android Gradle Plugin.
- Para compilar, configure JAVA_HOME com o JDK adequado e ANDROID_HOME com o SDK. O Java embutido em Android Studio/jbr pode ser usado.
- Para testes de navegador neste ambiente Windows, a configuração usa Microsoft Edge instalado. Em outro ambiente, ajuste channel em playwright.config.ts e instale o navegador correspondente.

## Instalar e executar na web

No diretório deste repositório:

```bash
npm install
npm run dev
```

Abra a URL indicada pelo Vite. Para uma instalação reprodutível após o clone, também é possível usar npm ci.

```bash
npm run typecheck
npm test
npm run build
```

A localização web exige **HTTPS ou localhost** e permissão do navegador. Abrir o endereço HTTP do computador pelo smartphone normalmente não atende ao requisito de contexto seguro. Para demonstrar no smartphone, prefira o app Android. Na web, o pedido de acesso é feito pelo próprio getCurrentPosition, pois Geolocation.requestPermissions() não é suportado nesse alvo.

## Capacitor e Android

Configuração:

```text
appName: Vigilância Sanitária
appId: br.com.vigilanciasanitaria.app
webDir: dist
```

O diretório android/ é versionado; não execute cap add android novamente se ele já existir.

```bash
npm run build
npx cap sync android
npx cap open android
```

Ou:

```bash
npm run android:sync
npm run android:open
```

O Android Studio encontrado neste computador é o 2024.3.2. Para abrir este projeto Capacitor 8 no IDE, atualize para 2025.2.1 ou superior, conforme a [documentação oficial](https://capacitorjs.com/docs/getting-started/environment-setup). A compilação pelo terminal utiliza o JDK 21 disponível.

No Android Studio compatível, aguarde o Gradle Sync. Instale o SDK solicitado pelo projeto e aceite as licenças pelo SDK Manager, quando necessário.

### Executar no smartphone

1. Ative as opções de desenvolvedor e a depuração USB no Android.
2. Conecte o smartphone por USB, autorize a depuração e selecione-o no Android Studio.
3. Clique em **Run app**. Alternativamente, depois de sincronizar: npx cap run android.
4. Ative a localização do smartphone.
5. Acesse **Nova vistoria**, preencha os dados e toque em **Capturar localização GPS**.
6. Autorize **Durante o uso do aplicativo** e selecione **Precisa**.
7. Confira latitude, longitude, precisão e horário. Se necessário, toque em **Atualizar localização**.
8. Toque em **Abrir localização no Google Maps** para conferir o ponto.
9. Toque em **Salvar auto de vistoria**.

O manifesto declara somente ACCESS_COARSE_LOCATION e ACCESS_FINE_LOCATION, além da permissão de internet do template. Não há ACCESS_BACKGROUND_LOCATION, rastreamento contínuo ou hardware GPS obrigatório.

### Permissões e erros

- **Negada:** habilite em Configurações > Aplicativos > Vigilância Sanitária > Permissões > Localização > Durante o uso. Na web, revise as permissões do site.
- **Aproximada:** a captura é aceita e sinalizada, pois a precisão poderá ser limitada. Habilite localização precisa para tentar melhorar.
- **Timeout:** aguarde e tente novamente em local aberto. Cada captura usa timeout de 20 segundos.
- **Localização desligada:** ative a localização e faça uma nova captura.
- **Google Play Services/conectividade:** confira os serviços, a conexão e o modo avião. A localização pode depender de diferentes provedores do sistema.
- **Sem suporte/HTTP inseguro:** use um navegador compatível em HTTPS/localhost ou execute o aplicativo Android.

O app usa async/await, try/catch/finally e impede capturas simultâneas. Não inventa coordenadas quando a captura falha, não usa IP como substituto e não garante que a posição veio exclusivamente de um receptor GPS físico.

### Gerar APK de demonstração

No Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**, ou a opção equivalente da versão instalada.

No PowerShell:

```powershell
npm run android:sync
cd android
.\gradlew.bat assembleDebug
```

No Linux/macOS:

```bash
cd android
./gradlew assembleDebug
```

Saída esperada após build bem-sucedido: android/app/build/outputs/apk/debug/app-debug.apk. O APK debug é destinado à demonstração, sem configuração de assinatura de produção. Depois de autorizar a instalação por USB, também pode ser instalado com adb install -r <caminho-do-apk>.

## Testes

```bash
npm run typecheck
npm test
npm run build
npx playwright test
npx cap sync android
```

Os testes dos serviços verificam campos obrigatórios, coordenadas válidas, persistência, exclusão, falha de armazenamento, preservação de dados corrompidos, link do Google Maps e fluxo de permissões nativas.

Os testes de navegador verificam cadastro, captura com geolocalização **simulada apenas no teste**, persistência após recarga, pesquisa, exclusão confirmada, negativa de permissão e ausência de rolagem horizontal. Cobrem viewport desktop e mobile e salvam capturas em test-results/ (não versionado).

**Testes automatizados com localização simulada não comprovam o funcionamento do GPS de um dispositivo físico.** O resultado das verificações realizadas neste ambiente está em VALIDACAO.md.

## Como demonstrar o projeto ao professor

1. Abrir o aplicativo no smartphone.
2. Acessar **Nova vistoria**.
3. Preencher o nome de um restaurante.
4. Informar o fiscal responsável.
5. Tocar em **Capturar localização GPS** para solicitar acesso.
6. Autorizar a localização precisa durante o uso.
7. Aguardar e mostrar latitude e longitude reais.
8. Mostrar a precisão em metros e o horário da captura.
9. Abrir a localização no Google Maps e conferir o ponto.
10. Voltar e salvar o auto de vistoria.
11. Visualizar o registro no histórico, pesquisar e abrir os detalhes.
12. Opcionalmente compartilhar o auto e mostrar a persistência após reabrir o aplicativo.

## Limitações e cuidados

- Projeto acadêmico do aluno 25. Não representa sistema oficial auditável de fiscalização.
- Registros ficam no armazenamento web local do app/navegador, sem sincronização, backup ou criptografia de aplicação. Não use para dados oficiais ou sensíveis.
- Limpar dados, desinstalar o aplicativo ou usar outra origem/navegador pode tornar os registros indisponíveis.
- Falhas de armazenamento são informadas; conteúdo corrompido é preservado e não é silenciosamente substituído.
- A data da vistoria é informada pelo usuário; o horário da captura é fornecido pelo dispositivo. Nenhum dos dois é atestado por servidor.
- A precisão e a disponibilidade da localização dependem de permissões, hardware, ambiente e serviços do sistema. Localização não é prova inviolável de presença.
- Abrir Google Maps ou compartilhar é uma ação voluntária que pode enviar dados ao aplicativo escolhido. Não há transmissão automática de coordenadas.
- Exportação por download é oferecida na web; no Android, utilize o compartilhamento nativo.
- O teste real de GPS, o comportamento das permissões Android e a abertura de aplicativos externos precisam ser confirmados no smartphone.

## Referências oficiais

- [Capacitor Geolocation v8: API, permissões e códigos de erro](https://capacitorjs.com/docs/apis/geolocation)
- [Ambiente de desenvolvimento do Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup)
- [Capacitor Android](https://capacitorjs.com/docs/android)
