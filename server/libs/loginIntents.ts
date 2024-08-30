import prisma from "~/server/libs/prisma";
import type {
  OneTimePassword,
  Prisma,
} from "@prisma/client";

export async function create({
  context,
  password,
  provider,
  ipAddress,
  userAgent,
}: Prisma.OneTimePasswordCreateInput): Promise<OneTimePassword> {
  return prisma.oneTimePassword.create({
    data: {
      context,
      password,
      provider,
      ipAddress,
      userAgent,
    },
  });
}

export async function first({
  provider,
  context,
  password,
  timestamp,
}: {
  provider?: string;
  context?: string;
  password?: string;
  timestamp?: Date;
}): Promise<OneTimePassword | null> {
  return prisma.oneTimePassword.findFirst({
    where: {
      provider,
      context,
      password,
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
  return prisma.oneTimePassword.count({
    where: {
      ipAddress,
      createdAt: {
        gte: timestamp,
      },
    },
  });
}
