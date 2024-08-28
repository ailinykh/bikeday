import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";
import type { User } from "~/types";
import { createSession } from "~/server/lib/session";

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

    const id = parseInt(event.context.params!.id);
    // TODO: status helper
    if (user.status == "user" && id != user.id) {
      console.warn(
        `unauthorized access: id: ${id}, user.id: ${user.id}`,
      );
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    const body = await readBody(event);
    const { lastName, firstName, gender } = body;
    let birthday = null;
    if (body.birthday) {
      const [day, month, year] = body.birthday.split(".");
      birthday = new Date(
        `${year}-${month}-${day}T12:00:00Z`,
      );
    }

    const updated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        birthday,
        gender,
      },
    });

    if (updated.id == user.id) {
      // update values in JWT
      createSession(event, user);
    }

    return updated;
  },
);
