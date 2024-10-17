import { beforeAll, describe, expect, it } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";
import prisma from "~~/server/libs/prisma";

describe("event start page", async () => {
  await setup();

  beforeAll(async () => {
    await prisma.event.deleteMany();
  });

  it("Renders event title and date", async () => {
    await prisma.event.create({
      data: {
        title: "Annual Bikeday Event 2049",
        date: new Date(2049, 4, 31),
      },
    });

    const html = await $fetch("/");

    expect(html).toMatch(
      "<title>Annual Bikeday Event 2049</title>",
    );
    expect(html).toMatch("Annual Bikeday Event");
    expect(html).toMatch("31 мая");
  });
});
