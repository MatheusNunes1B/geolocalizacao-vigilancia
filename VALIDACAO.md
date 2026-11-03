# Relatório de validação

Data: 03/11/2026. Projeto acadêmico — Aluno 25, tema VigilanciaSanitaria.

## Verificações concluídas

| Verificação | Resultado |
| --- | --- |
| Instalação npm e lockfile | Concluída |
| TypeScript estrito | Aprovado |
| Build de produção Vite | Aprovado |
| Testes de serviços | 10 testes aprovados |
| Testes de navegador | 4 testes aprovados, desktop e mobile |
| Cadastro, leitura após recarga, pesquisa e exclusão | Aprovados no navegador |
| Permissão negada e liberação do botão após falha | Aprovados no navegador |
| Validação de campos, coordenadas e armazenamento | Aprovada nos testes de serviços |
| Link Google Maps com coordenadas exatas | Aprovado no teste do utilitário |
| Revisão visual | Capturas desktop e mobile inspecionadas |
| Projeto Android | Gerado pelo Capacitor |
| APK debug | Compilado com sucesso pelo Gradle (4.921.930 bytes) |
| Execução Android 16 | APK instalado e aberto no emulador Medium_Phone_API_36.0 |
| Permissão nativa | Diálogo precisa/aproximada exibido; negativa tratada sem travamento |
| Sincronização Android | Aprovada, com três plugins oficiais detectados |
| Manifesto Android | Permissões coarse/fine presentes, sem background e sem GPS obrigatório |
| Auditoria de produção | Nenhuma vulnerabilidade conhecida reportada |
| Auditoria completa | Quatro avisos moderados na cadeia CLI Capacitor → rimraf → glob/minimatch |
| Lint | Não configurado; verificação estática realizada pelo TypeScript |
| Revisão Git | Sem erros em git diff --cached --check; CineView preservado |

Os alertas críticos inicialmente encontrados no executor de testes foram removidos com a atualização para Vitest 5.1.0. Não foi aplicado npm audit fix --force, pois a sugestão restante era um downgrade incompatível da CLI do Capacitor.

## Ambiente observado

- Windows, Node.js 22.16.0 e npm 10.9.2.
- Microsoft Edge disponível para testes Playwright.
- Capacitor core/Android/CLI 8.6.0; Geolocation 8.2.4.
- Android Studio 2024.3.2 instalado, com JDK 21 em C:/Program Files/Android/Android Studio/jbr. O Capacitor 8 exige Studio 2025.2.1 ou superior para uso do IDE; será necessário atualizar o Studio para abrir o projeto nele.
- JAVA_HOME original apontava para JDK 17; a tentativa de build usa o JDK 21 do Android Studio.
- SDK inicialmente disponível: Android 35. O projeto gerado requer compileSdk/targetSdk 36 e minSdk 24.
- Inicialmente nenhum dispositivo estava conectado. Em seguida, o emulador Medium_Phone_API_36.0 foi iniciado para o teste nativo e encerrado após a verificação.

## Compilação do APK

Compilação assembleDebug aprovada com JDK 21 e Gradle 8.14.3. Resultado: BUILD SUCCESSFUL in 3m 57s após preparação do cache. O Gradle instalou Android SDK Platform 36 e Build-Tools 35.0.0 usando a licença já aceita. APK debug gerado em android/app/build/outputs/apk/debug/app-debug.apk (não versionado). A primeira tentativa foi interrompida durante a resolução lenta das dependências; a segunda, com logs detalhados e o cache existente, terminou com sucesso.

## Teste nativo em emulador

APK instalado por adb com resultado Success e atividade MainActivity iniciada com Status: ok (cold start de 1.989 ms). O dashboard e a navegação mobile carregaram no WebView nativo. Ao tocar em Capturar localização GPS, o Android 16 apresentou a permissão real do aplicativo com opções precisa, aproximada, durante o uso, apenas desta vez e negar. O acesso foi negado no diálogo. O aplicativo exibiu a mensagem em português, voltou a habilitar Capturar localização GPS e manteve Salvar auto de vistoria desabilitado. Capturas e hierarquias de UI foram salvas em test-results/ (não versionado). Nenhuma coordenada de emulador foi capturada ou salva como localização real.

## Limites da verificação

Os testes web utilizaram coordenadas simuladas exclusivamente nos testes. Não houve captura real de GPS em smartphone, teste de permissão nativa em dispositivo físico, abertura real do aplicativo Google Maps ou compartilhamento nativo.

Para concluir a validação em campo:

1. Instale o SDK Android 36 pelo SDK Manager, se ainda não estiver disponível.
2. Sincronize o projeto e execute em smartphone conectado.
3. Autorize a localização precisa, capture o ponto e confira a precisão.
4. Abra o Google Maps, confira o ponto e retorne para salvar.
5. Reabra o aplicativo, consulte o histórico e teste compartilhar/excluir.
6. Repita com permissão negada, localização desligada e permissão aproximada.

Consulte o README para o roteiro completo de demonstração e os comandos Android.
