# Documentacao da API REST - Gerenciamento de Periféricos Corsair

Esta documentacao descreve a especificacao completa, configuracao e exemplos de uso da API de perifericos da Corsair.

## 1. Visao Geral e Configuracao Local

### URL Base
- Desenvolvimento Local: `http://localhost:3000`
- URL de producao: `https://<projeto-corsair>.vercel.app` (configurada automaticamente no deploy)

### Instrucoes para Execucao Local
1. Instale as dependencias na pasta `/api`:
   ```bash
   cd api
   npm install
   ```
2. Execute a suite de testes automatizados:
   ```bash
   npm test
   ```
3. Inicie o servidor local:
   ```bash
   npm start
   ```
   Acesse a aplicacao completa (Frontend e API) em: `http://localhost:3000`

### Instrucoes para Deploy na Vercel
1. Instale a CLI da Vercel (caso ainda nao possua):
   ```bash
   npm install -g vercel
   ```
2. Na pasta do projeto, execute o comando de deploy:
   ```bash
   vercel
   ```
3. Configure as variaveis de ambiente no painel da Vercel (ou via CLI):
   - `MONGODB_URI`: Sua string de conexao com o MongoDB Atlas
   - `CORS_ORIGIN`: `*` ou o dominio da Vercel gerado no deploy
4. Faca o deploy para producao:
   ```bash
   vercel --prod
   ```

---

## 2. Endpoints

### 2.1. Listar Perifericos
Recupera todos os perifericos cadastrados.

- **Metodo:** `GET`
- **Rota:** `/api/perifericos`
- **Autenticacao:** Nao requerida
- **Headers:** Nao requerido

#### Respostas
- **200 OK**: Lista retornada com sucesso.
```json
{
  "data": [
    {
      "_id": "674205a1c0de981a2f183921",
      "marca": "Corsair",
      "modelo": "K70 RGB PRO",
      "preco": 899.90,
      "foto": "https://cwsmgmt.corsair.com/media/catalog/product/k/7/k70_rgb_pro_hero.png",
      "createdAt": "2026-09-23T10:00:00.000Z",
      "updatedAt": "2026-09-23T10:00:00.000Z"
    }
  ]
}
```

#### Exemplo cURL
```bash
curl -X GET http://localhost:3000/api/perifericos
```

---

### 2.2. Consultar Periferico por ID
Recupera os detalhes de um periférico especifico pelo seu identificador.

- **Metodo:** `GET`
- **Rota:** `/api/perifericos/:id`
- **Parametros de Rota:** `id` (ObjectId valido de 24 caracteres hexadecimais)

#### Respostas
- **200 OK**: Periferico encontrado.
```json
{
  "data": {
    "_id": "674205a1c0de981a2f183921",
    "marca": "Corsair",
    "modelo": "K70 RGB PRO",
    "preco": 899.90,
    "foto": "https://cwsmgmt.corsair.com/media/catalog/product/k/7/k70_rgb_pro_hero.png",
    "createdAt": "2026-09-23T10:00:00.000Z",
    "updatedAt": "2026-09-23T10:00:00.000Z"
  }
}
```
- **400 Bad Request**: Formato de ID invalido.
```json
{
  "error": "Identificador invalido"
}
```
- **404 Not Found**: Periferico nao localizado.
```json
{
  "error": "Periferico nao encontrado"
}
```

#### Exemplo cURL
```bash
curl -X GET http://localhost:3000/api/perifericos/674205a1c0de981a2f183921
```

---

### 2.3. Cadastrar Periferico
Cadastra um novo periferico no banco de dados.

- **Metodo:** `POST`
- **Rota:** `/api/perifericos`
- **Headers:** `Content-Type: application/json`

#### Corpo da Requisicao (Body)
```json
{
  "marca": "Corsair",
  "modelo": "Dark Core RGB Pro",
  "preco": 450.00,
  "foto": "https://cwsmgmt.corsair.com/media/catalog/product/d/a/dark_core_pro.png"
}
```

#### Regras de Validacao
- `marca`: Obrigatorio. Deve ser exatamente `Corsair`.
- `modelo`: Obrigatorio. Texto nao vazio.
- `preco`: Obrigatorio. Valor numerico maior ou igual a zero.
- `foto`: Obrigatorio. URL valida iniciando em `http://` ou `https://`.

#### Respostas
- **201 Created**: Periferico cadastrado com sucesso.
```json
{
  "_id": "674205a1c0de981a2f183922",
  "marca": "Corsair",
  "modelo": "Dark Core RGB Pro",
  "preco": 450.00,
  "foto": "https://cwsmgmt.corsair.com/media/catalog/product/d/a/dark_core_pro.png",
  "createdAt": "2026-09-23T10:05:00.000Z",
  "updatedAt": "2026-09-23T10:05:00.000Z"
}
```
- **400 Bad Request**: Falha de validacao nos campos.
```json
{
  "error": "A marca deve ser obrigatoriamente Corsair"
}
```

#### Exemplo cURL
```bash
curl -X POST http://localhost:3000/api/perifericos \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Corsair",
    "modelo": "Dark Core RGB Pro",
    "preco": 450.00,
    "foto": "https://cwsmgmt.corsair.com/media/catalog/product/d/a/dark_core_pro.png"
  }'
```

---

### 2.4. Atualizar Periferico
Atualiza as informacoes de um periférico existente.

- **Metodo:** `PUT`
- **Rota:** `/api/perifericos/:id`
- **Headers:** `Content-Type: application/json`

#### Corpo da Requisicao (Body)
```json
{
  "marca": "Corsair",
  "modelo": "Dark Core RGB Pro SE",
  "preco": 499.90,
  "foto": "https://cwsmgmt.corsair.com/media/catalog/product/d/a/dark_core_pro_se.png"
}
```

#### Respostas
- **200 OK**: Periferico atualizado com sucesso.
```json
{
  "_id": "674205a1c0de981a2f183922",
  "marca": "Corsair",
  "modelo": "Dark Core RGB Pro SE",
  "preco": 499.90,
  "foto": "https://cwsmgmt.corsair.com/media/catalog/product/d/a/dark_core_pro_se.png",
  "createdAt": "2026-09-23T10:05:00.000Z",
  "updatedAt": "2026-09-23T10:12:00.000Z"
}
```
- **400 Bad Request**: Dados invalidos ou ID incorreto.
- **404 Not Found**: Periferico nao localizado.

#### Exemplo cURL
```bash
curl -X PUT http://localhost:3000/api/perifericos/674205a1c0de981a2f183922 \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Corsair",
    "modelo": "Dark Core RGB Pro SE",
    "preco": 499.90,
    "foto": "https://cwsmgmt.corsair.com/media/catalog/product/d/a/dark_core_pro_se.png"
  }'
```

---

### 2.5. Excluir Periferico
Remove um periférico cadastrado.

- **Metodo:** `DELETE`
- **Rota:** `/api/perifericos/:id`

#### Respostas
- **204 No Content**: Periferico removido com sucesso (corpo vazio).
- **400 Bad Request**: Formato de ID invalido.
- **404 Not Found**: Periferico nao localizado.

#### Exemplo cURL
```bash
curl -X DELETE http://localhost:3000/api/perifericos/674205a1c0de981a2f183922
```
