import type { Event } from "@prisma/client";
import type { IEvent } from "~/types";

export default async (): Promise<IEvent> => {
  const { data, error } =
    await useFetch<Event>(`/api/event`);

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch actual event`,
    });
  }

  return data.value as IEvent;
};
