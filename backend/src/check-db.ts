import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const campaigns = await prisma.drawCampaign.findMany();
  console.log("=== CAMPAIGNS ===");
  console.log(JSON.stringify(campaigns, null, 2));
  
  const winners = await prisma.luckyTicket.findMany({
    where: { isWinner: true }
  });
  console.log("=== WINNERS ===");
  console.log(JSON.stringify(winners, null, 2));
}
main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
