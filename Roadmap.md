# Roadmap do Projeto

## 1. Estrutura inicial
- [x] Criar estrutura de diretorios (/projeto, /api, /frontend)
- [x] Configurar .gitignore
- [x] Configurar package.json da API com dependencias necessarias
- [x] Configurar variaveis de ambiente (.env.example)
- [x] Configurar arquivos base de documentacao (Roadmap.md, Contexto.md, api.md)

## 2. Banco de dados
- [x] Configurar modulo de conexao com MongoDB (com cache para Vercel Serverless)
- [x] Criar modelo Periferico com Mongoose (marca, modelo, preco, foto, timestamps)
- [x] Configurar estrategia de banco em memoria para testes locais determinísticos

## 3. API REST
- [x] Configurar Express com middlewares (CORS dinâmico, JSON body parser)
- [x] Implementar middleware de validacao de payload e de ObjectId
- [x] Implementar middleware centralizado de tratamento de erros
- [x] Implementar GET /api/perifericos (listagem)
- [x] Implementar GET /api/perifericos/:id (consulta individual)
- [x] Implementar POST /api/perifericos (criacao)
- [x] Implementar PUT /api/perifericos/:id (atualizacao)
- [x] Implementar DELETE /api/perifericos/:id (remocao)
- [x] Configurar entrypoint para execucao local e exportacao para Vercel Serverless

## 4. Frontend
- [x] Criar index.html com semantica, modais e containers de estado
- [x] Criar assets/icons.svg com iconografia em SVG (sem emojis)
- [x] Criar estilos CSS responsivos com tema Corsair (cores escuras e destaque amarelo)
- [x] Implementar script js/app.js com consumo da API via fetch
- [x] Implementar estados visuais: carregando, lista vazia, erro e feedback (toasts)
- [x] Implementar confirmacao previa para exclusao
- [x] Implementar fallback visual para fotos com URLs quebradas

## 5. Testes
- [x] Criar suite de testes automatizados para a API (supertest)
- [x] Testar conexao e operacoes de banco
- [x] Testar cenarios de sucesso para todos os endpoints (GET, POST, PUT, DELETE)
- [x] Testar cenarios de erro e validacao (marca invalida, modelo ausente, preco incorreto, URL de foto invalida, ObjectId invalido, recurso inexistente)
- [x] Executar e validar testes automatizados
- [x] Realizar testes manuais de integracao frontend e API

## 6. Deploy e Documentacao
- [x] Criar configuracao vercel.json para hospedagem serverless
- [x] Validar conformidade de api.md com os endpoints reais
- [x] Atualizar Contexto.md com todas as decisoes e estado final
- [x] Concluir Roadmap.md
