import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log("PRODUCTS COUNT IN DB:", count);
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true
    }
  });
  console.log("ALL PRODUCTS IN DB:", JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
