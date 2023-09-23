import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";
import { User } from "~/types";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    const user: User = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const childrenCount = await prisma.user.count({
      where: { parentId: user.id, status: "child" },
    });

    if (childrenCount > 5) {
      throw createError({
        statusCode: 403,
        statusMessage: "Children limit exceeded",
      });
    }

    const body = await readBody(event);
    const { lastName, firstName, gender } = body;

    if (!firstName || !lastName || !gender) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad request",
      });
    }

    let birthday = null;
    if (body.birthday) {
      const [day, month, year] = body.birthday.split(".");
      birthday = new Date(
        `${year}-${month}-${day}T12:00:00Z`,
      );
    }

    return prisma.user.create({
      data: {
        firstName,
        lastName,
        birthday,
        gender,
        status: "child",
        parentId: user.id,
      },
    });
  },
);
