const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Users
  const adminPassword = 'ChangeMe123!';
  const operatorPassword = 'Operator123!';
  const viewerPassword = 'Viewer123!';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const operatorHash = await bcrypt.hash(operatorPassword, 10);
  const viewerHash = await bcrypt.hash(viewerPassword, 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash: adminHash, role: 'ADMIN' },
    create: { email: 'admin@example.com', passwordHash: adminHash, role: 'ADMIN' }
  });

  await prisma.user.upsert({
    where: { email: 'operator@example.com' },
    update: { passwordHash: operatorHash, role: 'OPERATOR' },
    create: { email: 'operator@example.com', passwordHash: operatorHash, role: 'OPERATOR' }
  });

  await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: { passwordHash: viewerHash, role: 'VIEWER' },
    create: { email: 'viewer@example.com', passwordHash: viewerHash, role: 'VIEWER' }
  });

  // Produtos
  await prisma.produto.createMany({
    data: [
      { nome: 'Parafuso 4mm', categoria: 'Ferragem', quantidade: 100, preco: 0.15, descricao: 'Parafuso zincado', minimo: 10 },
      { nome: 'Lâmpada LED 9W', categoria: 'Elétrica', quantidade: 25, preco: 12.5, descricao: 'Bivolt', minimo: 5 },
      { nome: 'Cabo HDMI 2m', categoria: 'Eletrônica', quantidade: 10, preco: 35.0, descricao: 'HDMI 2.0', minimo: 2 }
    ],
    skipDuplicates: true
  });

  console.log('Seed concluída');
  console.log('Usuários criados (troque as senhas após o primeiro login):');
  console.log('admin@example.com ->', adminPassword);
  console.log('operator@example.com ->', operatorPassword);
  console.log('viewer@example.com ->', viewerPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
