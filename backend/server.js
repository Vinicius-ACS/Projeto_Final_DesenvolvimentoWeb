const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API do Controle de Estoque funcionando!" });
});

// LISTAR PRODUTOS
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: {
        id: "desc"
      }
    });

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
});

// CADASTRAR PRODUTO
app.post("/produtos", async (req, res) => {
  try {
    const { nome, categoria, quantidade, preco, descricao } = req.body;

    if (!nome || !categoria || quantidade === undefined || preco === undefined) {
      return res.status(400).json({
        erro: "Preencha nome, categoria, quantidade e preço."
      });
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        categoria,
        quantidade: Number(quantidade),
        preco: Number(preco),
        descricao
      }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar produto." });
  }
});

// ATUALIZAR PRODUTO
app.put("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, categoria, quantidade, preco, descricao } = req.body;

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        categoria,
        quantidade: Number(quantidade),
        preco: Number(preco),
        descricao
      }
    });

    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar produto." });
  }
});

// EXCLUIR PRODUTO
app.delete("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.produto.delete({
      where: { id }
    });

    res.json({ mensagem: "Produto removido com sucesso." });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir produto." });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});