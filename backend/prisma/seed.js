const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.produto.createMany({
    data: [
      { nome: "Parafuso 4mm", categoria: "Ferragem", quantidade: 100, preco: 0.15, descricao: "Parafuso zincado", minimo: 10 },
      { nome: "Lâmpada LED 9W", categoria: "Elétrica", quantidade: 25, preco: 12.5, descricao: "Bivolt", minimo: 5 },
      { nome: "Cabo HDMI 2m", categoria: "Eletrônica", quantidade: 10, preco: 35.0, descricao: "HDMI 2.0", minimo: 2 }
    ],
    skipDuplicates: true
  });

  console.log("Seed concluída");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
