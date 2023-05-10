import { PrismaClient } from "@prisma/client";
import events from "./seed_data.mjs";

const prisma = new PrismaClient();

async function seed() {
  for (const e of events) {
    await prisma.event.create({
      data: e,
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
