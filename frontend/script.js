const API_URL = "/produtos"; // relativo para dev local; se precisar usar a URL pública, troque aqui

const listaProdutos = document.getElementById("listaProdutos");
const formProduto = document.getElementById("formProduto");

async function carregarProdutos() {
  const resposta = await fetch(API_URL);
  const produtos = await resposta.json();

  listaProdutos.textContent = "";

  if (!Array.isArray(produtos) || produtos.length === 0) {
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

    // alerta de estoque baixo
    if (produto.minimo !== undefined && produto.quantidade <= produto.minimo) {
      const alerta = document.createElement("span");
      alerta.textContent = "Estoque baixo";
      alerta.classList.add("alerta-estoque");
      div.appendChild(alerta);
    } else if (produto.quantidade <= 0) {
      const alerta = document.createElement("span");
      alerta.textContent = "Sem estoque";
      alerta.classList.add("alerta-estoque");
      div.appendChild(alerta);
    }

    const preco = document.createElement("p");
    preco.textContent = `Preço: R$ ${Number(produto.preco).toFixed(2)}`;

    const descricao = document.createElement("p");
    descricao.textContent = `Descrição: ${produto.descricao || "Sem descrição"}`;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("botao-excluir");

    const botaoMov = document.createElement("button");
    botaoMov.textContent = "Movimentar";
    botaoMov.classList.add("botao-mov");

    botaoExcluir.addEventListener("click", async () => {
      if (!confirm(`Excluir ${produto.nome}?`)) return;
      await fetch(`${API_URL}/${produto.id}`, { method: "DELETE" });
      carregarProdutos();
    });

    botaoMov.addEventListener("click", async () => {
      const tipo = prompt("Tipo (ENTRADA ou SAIDA):", "SAIDA");
      if (!tipo) return;
      const qtdStr = prompt("Quantidade:");
      const qtd = Number(qtdStr);
      if (!qtd || qtd <= 0) {
        alert("Quantidade inválida.");
        return;
      }
      const desc = prompt("Descrição (opcional):", "");
      const res = await fetch(`${API_URL}/${produto.id}/movimentacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, quantidade: qtd, descricao: desc })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.erro || "Erro ao registrar movimentação");
        return;
      }
      carregarProdutos();
      alert("Movimentação registrada com sucesso.");
    });

    div.appendChild(nome);
    div.appendChild(categoria);
    div.appendChild(quantidade);
    div.appendChild(preco);
    div.appendChild(descricao);
    div.appendChild(botaoMov);
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

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto)
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.erro || "Erro ao salvar produto");
    return;
  }

  formProduto.reset();
  carregarProdutos();
});

carregarProdutos();
