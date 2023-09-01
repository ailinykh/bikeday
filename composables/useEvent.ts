import { Event } from "@prisma/client";

export default async () => {
  const { data, error } =
    await useFetch<Event>(`/api/event`);

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch actual event`,
    });
  }

  return data.value as Event;
};
