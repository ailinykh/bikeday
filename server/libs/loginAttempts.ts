import prisma from "~/server/libs/prisma";
import type {
  OneTimePasswordLog,
  Prisma,
} from "@prisma/client";

export async function create({
  password,
  ipAddress,
  userAgent,
}: Prisma.OneTimePasswordLogCreateInput): Promise<OneTimePasswordLog> {
  return prisma.oneTimePasswordLog.create({
    data: {
      password,
      ipAddress,
      userAgent,
    },
  });
}

export async function first({
  password,
  ipAddress,
  timestamp,
}: {
  password: string;
  ipAddress: string;
  timestamp: Date;
}): Promise<OneTimePasswordLog | null> {
  return prisma.oneTimePasswordLog.findFirst({
    where: {
      password,
      ipAddress,
      createdAt: {
        gte: timestamp,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function count({
  ipAddress,
  timestamp,
}: {
  ipAddress: string;
  timestamp?: Date;
}): Promise<number> {
  return prisma.oneTimePasswordLog.count({
    where: {
      ipAddress,
      createdAt: {
        gte: timestamp,
      },
    },
  });
}
