import { beforeEach, describe, expect, it } from "vitest";
import { setup, $fetch, fetch } from "@nuxt/test-utils";
import prisma from "~~/server/libs/prisma";
import { createToken } from "~~/server/libs/session";

describe("user profile", async () => {
  await setup();

  describe("GET /profile", async () => {
    beforeEach(async () => {
      await Promise.all([
        prisma.oneTimePassword.deleteMany(),
        prisma.oneTimePasswordLog.deleteMany(),
        prisma.user.deleteMany(),
        prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1;`,
      ]);
    });

    it("prevents unauthorized access", async () => {
      expect($fetch("/api/user/1")).rejects.toThrow(
        "401 Unauthorized",
      );
    });

    it("returns profile for logged in user", async () => {
      const user = await prisma.user.create({
        data: {
          phone: "79998887777",
          status: "user",
          firstName: "",
          lastName: "",
        },
      });

      expect(
        $fetch(`/api/user/1`, {
          method: "GET",
          headers: {
            cookie: `__session=${createToken(user)}`,
          },
        }),
      ).resolves.toMatchObject(
        (({
          id,
          firstName,
          lastName,
          gender,
          birthday,
        }) => ({
          id,
          firstName,
          lastName,
          gender,
          birthday,
        }))(user),
      );
    });

    it("prevents another user profile access for logged in user", async () => {
      const user = await prisma.user.create({
        data: {
          phone: "79998887777",
          status: "user",
          firstName: "",
          lastName: "",
        },
      });

      expect(
        $fetch(`/api/user/2`, {
          method: "GET",
          headers: {
            cookie: `__session=${createToken(user)}`,
          },
        }),
      ).rejects.toThrow("403 Forbidden");
    });
  });
});
