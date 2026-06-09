import { prisma } from '../lib/prisma.js';

async function main() {
  // Delete all activity logs
  const activityResult = await prisma.activityLog.deleteMany();
  console.log(`Deleted ${activityResult.count} activity logs`);

  // Delete all payment logs
  const paymentResult = await prisma.paymentLog.deleteMany();
  console.log(`Deleted ${paymentResult.count} payment logs`);
}

main()
  .catch((e) => {
    console.error('Error clearing logs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
