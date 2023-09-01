import { PrismaClient } from "@prisma/client";
import { events, users } from "./seed_data.mjs";

const prisma = new PrismaClient();

async function seed() {
  for (const data of events) {
    await prisma.event.create({
      data,
    });
  }
  for (const data of users) {
    await prisma.user.create({
      data,
    });
  }
}

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
