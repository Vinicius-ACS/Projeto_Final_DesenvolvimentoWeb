const API_URL = "https://controle-estoque-api-0awi.onrender.com/produtos";

const listaProdutos = document.getElementById("listaProdutos");
const formProduto = document.getElementById("formProduto");

async function carregarProdutos() {
  const resposta = await fetch(API_URL);
  const produtos = await resposta.json();

  listaProdutos.textContent = "";

  if (produtos.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Nenhum produto cadastrado.";
    listaProdutos.appendChild(mensagem);
    return;
  }

  produtos.forEach((produto) => {
    const div = document.createElement("div");
    div.classList.add("produto");

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const categoria = document.createElement("p");
    categoria.textContent = `Categoria: ${produto.categoria}`;

    const quantidade = document.createElement("p");
    quantidade.textContent = `Quantidade: ${produto.quantidade}`;

    const preco = document.createElement("p");
    preco.textContent = `Preço: R$ ${Number(produto.preco).toFixed(2)}`;

    const descricao = document.createElement("p");
    descricao.textContent = `Descrição: ${produto.descricao || "Sem descrição"}`;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("botao-excluir");

    botaoExcluir.addEventListener("click", async () => {
      await fetch(`${API_URL}/${produto.id}`, {
        method: "DELETE"
      });

      carregarProdutos();
    });

    div.appendChild(nome);
    div.appendChild(categoria);
    div.appendChild(quantidade);
    div.appendChild(preco);
    div.appendChild(descricao);
    div.appendChild(botaoExcluir);

    listaProdutos.appendChild(div);
  });
}

formProduto.addEventListener("submit", async (event) => {
  event.preventDefault();

  const produto = {
    nome: document.getElementById("nome").value,
    categoria: document.getElementById("categoria").value,
    quantidade: Number(document.getElementById("quantidade").value),
    preco: Number(document.getElementById("preco").value),
    descricao: document.getElementById("descricao").value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(produto)
  });

  formProduto.reset();
  carregarProdutos();
});

carregarProdutos();