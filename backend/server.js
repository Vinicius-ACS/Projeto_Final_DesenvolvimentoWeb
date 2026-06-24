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

// LISTAR PRODUTOS (paginação e busca)
app.get("/produtos", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1000;
    const q = req.query.q || "";
    const skip = (page - 1) * limit;

    const where = q
      ? {
          OR: [
            { nome: { contains: q, mode: "insensitive" } },
            { categoria: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } }
          ]
        }
      : {};

    const produtos = await prisma.produto.findMany({
      where,
      orderBy: { id: "desc" },
      take: limit,
      skip
    });

    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
});

// OBTER PRODUTO
app.get("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar produto." });
  }
});

// CADASTRAR PRODUTO
app.post("/produtos", async (req, res) => {
  try {
    const { nome, categoria, quantidade, preco, descricao, sku, fornecedor, localizacao, minimo } = req.body;

    if (!nome || !categoria || preco === undefined) {
      return res.status(400).json({ erro: "Preencha nome, categoria e preço." });
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        categoria,
        quantidade: Number(quantidade) || 0,
        preco: Number(preco),
        descricao,
        sku,
        fornecedor,
        localizacao,
        minimo: Number(minimo) || 0
      }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar produto." });
  }
});

// ATUALIZAR PRODUTO
app.put("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, categoria, quantidade, preco, descricao, sku, fornecedor, localizacao, minimo } = req.body;

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        categoria,
        quantidade: Number(quantidade),
        preco: Number(preco),
        descricao,
        sku,
        fornecedor,
        localizacao,
        minimo: Number(minimo) || 0
      }
    });

    res.json(produtoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar produto." });
  }
});

// EXCLUIR PRODUTO
app.delete("/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.produto.delete({ where: { id } });

    res.json({ mensagem: "Produto removido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir produto." });
  }
});

// REGISTRAR MOVIMENTAÇÃO (ENTRADA / SAIDA) e ATUALIZAR ESTOQUE (transação)
app.post("/produtos/:id/movimentacoes", async (req, res) => {
  try {
    const produtoId = Number(req.params.id);
    const { tipo, quantidade, descricao } = req.body;

    if (![ "ENTRADA", "SAIDA" ].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo inválido. Use ENTRADA ou SAIDA." });
    }

    const qty = Number(quantidade);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ erro: "Quantidade deve ser número positivo." });
    }

    const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado." });

    const novaQuantidade = tipo === "ENTRADA" ? produto.quantidade + qty : produto.quantidade - qty;
    if (novaQuantidade < 0) {
      return res.status(400).json({ erro: "Movimentação negaria estoque (saldo insuficiente)." });
    }

    const [movimentacao, atualizado] = await prisma.$transaction([
      prisma.movimentacao.create({
        data: {
          produtoId,
          tipo,
          quantidade: qty,
          descricao
        }
      }),
      prisma.produto.update({ where: { id: produtoId }, data: { quantidade: novaQuantidade } })
    ]);

    res.status(201).json({ movimentacao, produto: atualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao registrar movimentação." });
  }
});

// LISTAR MOVIMENTAÇÕES DE UM PRODUTO
app.get("/produtos/:id/movimentacoes", async (req, res) => {
  try {
    const produtoId = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const movimentacoes = await prisma.movimentacao.findMany({
      where: { produtoId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip
    });

    res.json(movimentacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar movimentações." });
  }
});

// RELATÓRIO: produtos com estoque baixo (quantidade <= minimo)
app.get("/relatorios/baixo-estoque", async (req, res) => {
  try {
    const lista = await prisma.$queryRaw`SELECT * FROM Produto WHERE quantidade <= minimo`;
    return res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao gerar relatório." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
