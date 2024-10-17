import { beforeEach, describe, expect, it } from "vitest";
import { setup, $fetch, fetch } from "@nuxt/test-utils/e2e";
import prisma from "../server/libs/prisma";
import { createToken } from "../server/libs/session";

const createData = (createdAt?: Date) => ({
  context: "79998887777",
  password: "123456",
  provider: "phone",
  ipAddress: "127.0.0.1",
  userAgent: "node",
  createdAt: createdAt,
});

await setup({
  env: {
    DATABASE_URL: "file:./dev.db",
  },
});

describe("user authorization and authentication", async () => {
  describe("GET /api/session", async () => {
    it.only("prevents unauthorized access", async () => {
      expect($fetch("/api/session")).rejects.toThrow(
        "401 Unauthorized",
      );
    });
  });

  describe("POST /api/session", async () => {
    beforeEach(async () => {
      await Promise.all([
        prisma.oneTimePassword.deleteMany(),
        prisma.oneTimePasswordLog.deleteMany(),
      ]);
    });

    it("requires phone number", async () => {
      expect(
        $fetch("/api/session", {
          method: "POST",
          body: {},
        }),
      ).rejects.toThrow("400 Phone not specified");
    });

    it("requires correct phone number", async () => {
      expect(
        $fetch("/api/session", {
          method: "POST",
          body: { phone: "invalid phone number" },
        }),
      ).rejects.toThrow("400 Insufficient digits");
    });

    it("creates user login intent", async () => {
      await expect(
        $fetch("/api/session", {
          method: "POST",
          body: { phone: "+79998887777" },
        }),
      ).resolves.toMatchObject({
        context: "79998887777",
        provider: "phone",
      });

      expect(await prisma.oneTimePassword.count()).toBe(1);

      expect(
        await prisma.oneTimePassword.findFirstOrThrow(),
      ).toMatchObject({
        context: "79998887777",
        provider: "phone",
      });
    });

    it("prevents multiple login attempts in short period of time", async () => {
      await prisma.oneTimePassword.create({
        data: createData(),
      });

      expect(
        $fetch("/api/session", {
          method: "POST",
          body: { phone: "+79998887777" },
        }),
      ).rejects.toThrow("429 Phone request limit exceeded");
    });

    it("accepts multiple login attempts after timeout", async () => {
      await prisma.oneTimePassword.create({
        data: createData(
          new Date(new Date().getTime() - 2 * 60_000),
        ),
      });

      await expect(
        $fetch("/api/session", {
          method: "POST",
          body: { phone: "+79998887777" },
        }),
      ).resolves.toMatchObject({
        context: "79998887777",
        provider: "phone",
      });

      expect(await prisma.oneTimePassword.count()).toBe(2);
    });

    it("prevents authorization spam", async () => {
      const nums = Array.from(
        { length: 10 },
        (_, i) => i + 10,
      );
      for (const num of nums) {
        await expect(
          $fetch("/api/session", {
            method: "POST",
            body: { phone: `799988877${num}` },
          }),
        ).resolves.not.toBeNull();
      }

      expect(
        $fetch("/api/session", {
          method: "POST",
          body: { phone: "+79998887788" },
        }),
      ).rejects.toThrow("429 Too Many Requests");
    });
  });

  describe("PUT /api/session", async () => {
    beforeEach(async () => {
      await Promise.all([
        prisma.oneTimePassword.deleteMany(),
        prisma.oneTimePasswordLog.deleteMany(),
        prisma.user.deleteMany(),
        prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1;`,
      ]);
    });

    it("prevents multiple login attempts in short period of time", async () => {
      const nums = Array.from(
        { length: 15 },
        (_, i) => i + 15,
      );
      for (const num of nums) {
        await expect(
          $fetch("/api/session", {
            method: "PUT",
            body: {
              phone: "79998887777",
              code: `1234${num}`,
            },
          }),
        ).rejects.toThrow("403 Code invalid or expired");
      }
      expect(
        $fetch("/api/session", {
          method: "PUT",
          body: { phone: "+79998887788", code: "123456" },
        }),
      ).rejects.toThrow("429 Too Many Requests");
    });

    it("prevents expired otp login", async () => {
      await prisma.oneTimePassword.create({
        data: createData(
          new Date(new Date().getTime() - 6 * 60_000),
        ),
      });

      expect(
        $fetch("/api/session", {
          method: "PUT",
          body: {
            phone: "79998887777",
            code: "123456",
          },
        }),
      ).rejects.toThrow("403 Code invalid or expired");
    });

    it("accepts valid credentials", async () => {
      await prisma.oneTimePassword.create({
        data: createData(),
      });

      const res = await fetch("/api/session", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: "79998887777",
          code: "123456",
        }),
      });

      expect(res.json()).resolves.toMatchObject({
        id: 1,
        status: "user",
        phone: "79998887777",
      });
      expect(res.headers.has("set-cookie")).toBe(true);
      expect(res.headers.get("set-cookie")).toContain(
        "__session=",
      );
    });

    it("redirects valid session", async () => {
      const [_event, _intent, user] = await Promise.all([
        prisma.event.create({
          data: {
            title: "Annual Bikeday Event 2049",
            date: new Date(2049, 4, 31),
          },
        }),
        prisma.oneTimePassword.create({
          data: createData(),
        }),
        prisma.user.create({
          data: {
            phone: "79998887777",
            status: "user",
            firstName: "",
            lastName: "",
          },
        }),
      ]);

      const html = await $fetch("/api/session", {
        method: "PUT",
        body: {
          phone: "79998887777",
          code: "123456",
        },
        headers: {
          cookie: `__session=${createToken(user)}`,
        },
      });

      expect(html).toContain("Annual Bikeday Event 2049");
    });
  });
});
