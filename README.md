# crawler-node

## Node.js crawler phrases
Application voltada a capturar conteudo para servir app Kotlin de frases com imagens e textos random.

## App node.js using crawler
### divid in two featres:
1 - App crawler phrases
2 - Data convert JSON images random for content

## Install
1 - Crie um projeto no firebase usando
* npm firebase login
* npm init functions e hosting
* npm npx

2 - Usar o CI
* instale rmdir
* intale rimraf
* dentro do seu package.json cole os scripts de install, build e clean

3 - Usando o CI
* dentro de functions use [npm run clean] para desinstalar o node modules
* para instalar novamente rode [npm install]
* para rodar localhost basta rodar [npm run rebuild]

4 - Crie um .env com as urls:
- https://www.pensador.com/
- https://picsum.photos/v2/list
