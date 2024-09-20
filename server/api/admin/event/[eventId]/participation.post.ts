import { H3Event } from "h3";
import prisma from "~~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const eventId = parseInt(event.context.params!.eventId);

    const {
      firstName,
      lastName,
      status,
      phone: p,
      district,
      band,
    } = await readBody(event);
    const phone = "7" + p.replace(/\D+/g, "").slice(-10); // assume only russian numbers
    if (phone != p) {
      console.warn(`${p} normalized to ${phone}`);
    }

    let user = await prisma.user.findFirst({
      where: {
        phone,
      },
    });

    if (!user) {
      if (status == "child") {
        throw createError({
          statusCode: 404,
          statusMessage: "Parent not found",
        });
      }

      user = await prisma.user.create({
        data: {
          status: "user",
          firstName,
          lastName,
          phone,
        },
      });
    }

    // child registration
    if (status == "child") {
      user = await prisma.user.create({
        data: {
          status,
          firstName,
          lastName,
          parentId: user.id,
        },
      });
    }

    const existing =
      await prisma.eventParticipation.findFirst({
        where: {
          userId: user.id,
          eventId,
        },
      });

    if (existing) {
      const participation =
        await prisma.eventParticipation.update({
          where: {
            eventId_userId: { eventId, userId: user.id },
          },
          data: {
            district,
            band,
            bandBy: event.context.user.id,
          },
        });
      return { user, participation };
    }

    const participation =
      await prisma.eventParticipation.create({
        data: {
          eventId,
          userId: user.id,
          district,
          bike: "unknown",
          band,
          bandBy: event.context.user.id,
        },
      });

    return { user, participation };
  },
);
