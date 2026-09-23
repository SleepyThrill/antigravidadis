# Contexto do Projeto

## 1. Objetivo
Desenvolver uma aplicacao completa para gerenciamento de perifericos da Corsair (cadastro, listagem, edicao e exclusao).
O projeto e composto por uma API REST em Node.js com MongoDB, preparada para deploy serverless na Vercel, e um frontend desacoplado em HTML5, CSS3 e JavaScript puro (sem frameworks adicionais como React).

## 2. Arquitetura
A solucao e dividida em duas camadas desacopladas:
- API REST (/api): backend Node.js com Express, estruturado em routes, controllers, models, middlewares e config. Possui conexao persistente/cacheada com MongoDB compativel com funcoes serverless e entrypoint compativel com a Vercel.
- Frontend (/frontend): aplicacao web estatica que se comunica com a API exclusivamente via requisicoes HTTP (fetch API), com tratamento visual de erros, estados de carregamento e iconografia SVG pura.

## 3. Stack Tecnologica
- Backend: Node.js (v24), Express, Mongoose, Cors, Dotenv
- Testes: Node test runner / Supertest / mongodb-memory-server (para testes isolados e determinísticos em qualquer ambiente sem necessidade de banco externo rodando)
- Banco de Dados: MongoDB (Atlas em producao ou local configuravel via MONGODB_URI)
- Hospedagem Backend: Vercel Serverless Functions
- Frontend: HTML5 semantico, CSS3 responsivo (tema escuro Corsair com acentos amarelo ouro #FFD100), JavaScript ES6+ moderno

## 4. Estrutura de Diretorios
```
/projeto
  /api
    /src
      /config
        db.js
      /controllers
        perifericosController.js
      /middlewares
        errorHandler.js
        validation.js
      /models
        Periferico.js
      /routes
        perifericosRoutes.js
      app.js
      server.js
    /tests
      perifericos.test.js
      setup.js
    .env.example
    index.js
    package.json
    vercel.json
  /frontend
    /assets
      icons.svg
    /css
      styles.css
    /js
      app.js
    index.html
  .gitignore
  Contexto.md
  Roadmap.md
  api.md
```

## 5. Modelo de Dados (Periferico)
- _id: ObjectId (gerado pelo MongoDB)
- marca: String (obrigatoria, restrita a 'Corsair' no escopo atual)
- modelo: String (obrigatorio, nao vazio, sem espacos em branco excessivos)
- preco: Number (obrigatorio, tipo numerico, maior ou igual a zero)
- foto: String (obrigatoria, URL valida com protocolo http ou https)
- createdAt: Date (gerado automaticamente via timestamps)
- updatedAt: Date (gerado automaticamente via timestamps)

## 6. Endpoints Mapeados
- GET /api/perifericos: lista todos os perifericos cadastrados. Retorno: { "data": [...] }
- GET /api/perifericos/:id: retorna os dados de um periferico especifico. Retorno: { "data": { ... } }
- POST /api/perifericos: cria um novo registro. Retorno: status 201 com o objeto criado.
- PUT /api/perifericos/:id: atualiza os dados de um registro existente. Retorno: status 200 com o objeto atualizado.
- DELETE /api/perifericos/:id: remove o registro. Retorno: status 204 (sem conteudo) ou status 200 com mensagem.

## 7. Variaveis de Ambiente
- PORT: porta do servidor local (padrao: 3000)
- MONGODB_URI: string de conexao com o banco de dados MongoDB
- CORS_ORIGIN: origens permitidas para requisicoes no backend (padrao: * ou url do frontend)

## 8. Decisoes Tecnicas
- Cache de conexao Mongoose: em ambientes serverless (Vercel), multiplas invocacoes reaproveitam a conexao mantida em variavel global para evitar esgotamento de sockets.
- Ausencia de Emojis: uso estrito de icones vetoriais SVG e texto limpo para comunicacao visual e documentacao.
- Testes automatizados isolados: uso do `mongodb-memory-server` em ambiente de testes para garantir que a suite de testes rode com 100% de confiabilidade, sem depender de instalacao previa de servico local ou conexao com a internet.
- Seguranca no Frontend: sanitizacao e manipulacao de elementos via createElement/textContent e definicao explicita de atributos para impedir vulnerabilidades de XSS. Tratamento de fallback para fotos com erro de carregamento (evento onerror).

## 9. Estado Atual
- Projeto concluido e plenamente operacional com todas as etapas do Roadmap finalizadas.
- API REST Node.js/Express com integracao ao MongoDB (Mongoose) implementada e validada.
- Middlewares de validacao estrita (marca Corsair, modelo, preco numerico positivo, URL de foto, formato ObjectId) e tratamento centralizado de erros em operacao.
- Cache de conexao com MongoDB implementado para operacao eficiente e estavel em funcoes serverless (Vercel).
- Frontend desacoplado desenvolvido exclusivamente com HTML5 semantico, CSS3 responsivo (tema Corsair) e JavaScript moderno (ES6 puro), sem React ou bibliotecas pesadas.
- Sistema de feedback visual com modais acessiveis, previas de imagem, tratamento de fotos com URLs invalidas/quebradas e notificacoes do tipo toast.
- Suite automatizada com 22 testes unitarios e de integracao executados com 100% de sucesso.
- Versionamento com Git iniciado e configurado adequadamente, com `.gitignore` protegendo credenciais e `node_modules`.

## 10. Proxima Tarefa
- Projeto concluido. Para colocar em producao, basta executar `vercel --prod` configurando a variavel `MONGODB_URI` no painel da Vercel.

## 11. Problemas Conhecidos
- Nenhum. Todas as funcionalidades previstas foram testadas e validadas.

## 12. Testes Realizados
- Validacao inicial de presenca do ambiente Node.js (v24.11.1) e npm (11.6.2).
- Instalacao com sucesso de 155 pacotes sem vulnerabilidades.
- Teste unitario automatizado do banco de dados e modelo Periferico (tests/db.test.js) aprovado.
- Suite completa de testes automatizados da API REST (tests/perifericos.test.js) com 18 cenarios aprovados.
- Testes de integracao e ponta a ponta (tests/integration.test.js) cobrindo ciclo de vida completo (criacao, consulta por id, listagem, edicao, exclusao, validacao de preco zero e cabecalhos de seguranca CORS) com 100% de exito (total de 22 testes).
