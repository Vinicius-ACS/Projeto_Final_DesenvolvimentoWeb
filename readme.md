# Controle de Estoque Full Stack

Projeto desenvolvido como atividade final Full Stack, seguindo a proposta de transformar uma interface web em uma aplicação completa com frontend, backend, banco de dados e documentação.

O sistema permite cadastrar, listar, atualizar e excluir produtos de um estoque, utilizando uma arquitetura cliente-servidor.

---

## Tecnologias Utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

### Backend

- Node.js
- Express.js
- CORS
- Helmet

### Banco de Dados

- SQLite
- Prisma ORM

---

## Objetivo do Projeto

O objetivo deste projeto é criar um sistema de controle de estoque funcional, com comunicação entre frontend e backend, persistência de dados em banco SQLite e proteção básica contra vulnerabilidades, como ataques XSS.

---

## Funcionalidades

- Cadastrar produtos
- Listar produtos cadastrados
- Atualizar produtos
- Excluir produtos
- Salvar dados no banco SQLite
- Consumir API com `fetch`
- Utilizar Prisma ORM para manipulação dos dados
- Proteger a aplicação contra XSS usando `textContent`
- Usar `helmet` no backend para cabeçalhos de segurança

---

## Estrutura do Projeto

```txt
controle-estoque/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── dev.db
│   │   └── migrations/
│   └── node_modules/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## Arquitetura do Sistema

O projeto segue o modelo cliente-servidor:

```txt
Frontend
HTML, CSS e JavaScript
        |
        | Requisições HTTP com fetch
        |
Backend
Node.js + Express
        |
        | Prisma ORM
        |
Banco de Dados
SQLite
```

---

## Fluxo da Aplicação

1. O usuário acessa a interface no navegador.
2. O frontend envia requisições HTTP para o backend usando `fetch`.
3. O backend recebe as requisições pelas rotas da API.
4. O Prisma faz a comunicação com o banco SQLite.
5. O backend retorna os dados em formato JSON.
6. O frontend exibe os produtos na tela.

---

## Modelagem do Banco de Dados

A entidade principal do sistema é `Produto`.

```prisma
model Produto {
  id         Int      @id @default(autoincrement())
  nome       String
  categoria  String
  quantidade Int
  preco      Float
  descricao  String?
  createdAt  DateTime @default(now())
}
```

---

## Rotas da API

### Listar todos os produtos

```http
GET /produtos
```

Retorna todos os produtos cadastrados no banco.

---

### Cadastrar novo produto

```http
POST /produtos
```

Exemplo de JSON enviado:

```json
{
  "nome": "Mouse",
  "categoria": "Periféricos",
  "quantidade": 10,
  "preco": 50,
  "descricao": "Mouse USB"
}
```

---

### Atualizar produto

```http
PUT /produtos/:id
```

Exemplo:

```http
PUT /produtos/1
```

---

### Excluir produto

```http
DELETE /produtos/:id
```

Exemplo:

```http
DELETE /produtos/1
```

---

## Como Rodar o Projeto

### 1. Clonar ou baixar o projeto

Abra o terminal na pasta onde deseja salvar o projeto.

```bash
git clone <link-do-repositorio>
```

Depois entre na pasta:

```bash
cd controle-estoque
```

---

## Rodando o Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Inicie o servidor:

```bash
node server.js
```

O backend ficará disponível em:

```txt
http://localhost:3000
```

Para testar a API no navegador, acesse:

```txt
http://localhost:3000
```

ou:

```txt
http://localhost:3000/produtos
```

---

## Rodando o Frontend

Abra a pasta:

```txt
frontend
```

Depois abra o arquivo:

```txt
index.html
```

Também é possível usar a extensão **Live Server** no VS Code.

---

## Segurança Contra XSS

O projeto evita o uso de `innerHTML` para exibir dados enviados pelo usuário.

Forma vulnerável:

```js
elemento.innerHTML = produto.nome;
```

Forma segura usada no projeto:

```js
elemento.textContent = produto.nome;
```

Além disso, o backend utiliza o pacote `helmet`, que adiciona cabeçalhos HTTP de segurança na aplicação Express.

```js
const helmet = require("helmet");

app.use(helmet());
```

---

## Persistência de Dados

Inicialmente, o projeto poderia funcionar com dados temporários em memória. Porém, para garantir persistência real, foi utilizado:

- SQLite como banco de dados;
- Prisma ORM para modelagem e acesso aos dados;
- Migrações para criação da tabela `Produto`.

Com isso, os produtos continuam salvos mesmo após fechar e abrir novamente o sistema.

---

## Checklist do Projeto

- [x] Interface criada com HTML, CSS e JavaScript
- [x] Backend criado com Node.js e Express
- [x] Comunicação frontend/backend usando `fetch`
- [x] Banco SQLite configurado
- [x] Prisma ORM configurado
- [x] Entidade Produto criada
- [x] Rota GET funcionando
- [x] Rota POST funcionando
- [x] Rota PUT funcionando
- [x] Rota DELETE funcionando
- [x] Dados persistidos no banco
- [x] Proteção básica contra XSS
- [x] Uso do Helmet no backend
- [x] README.md documentado

---

## Possíveis Melhorias Futuras

- Criar tela de edição visual para produtos
- Adicionar login de usuário
- Criar categorias fixas
- Adicionar filtro por nome ou categoria
- Criar alerta para produtos com estoque baixo
- Melhorar o layout da interface
- Publicar o projeto online

---

## Uso de Inteligência Artificial

A inteligência artificial foi utilizada como apoio para organização do projeto, explicação dos conceitos, estruturação do código e elaboração da documentação.

O desenvolvimento, testes e ajustes finais foram realizados pelo autor do projeto.

---

## Autor

Projeto desenvolvido por:

**Vinicius ACS**

---

## Conclusão

Este projeto demonstra a construção de uma aplicação Full Stack simples e funcional, integrando frontend, backend e banco de dados.

A aplicação atende aos principais requisitos de um sistema web completo:

- Interface de usuário;
- API com Node.js e Express;
- Banco de dados SQLite;
- Operações CRUD;
- Segurança básica contra XSS;
- Documentação do projeto.