import { defineStore } from "pinia";
import { IParticipation } from "~/types";

type Participation = IParticipation & {
  initialized: boolean;
  loading: boolean;
};

export const useParticipation = defineStore(
  "participation",
  {
    state: (): Participation => {
      return {
        band: null,
        bandBy: null,
        district: "",
        bike: "",
        initialized: false,
        loading: false,
      };
    },
    actions: {
      async initialize(eventId: number) {
        if (this.initialized) {
          return;
        }
        this.initialized = true;
        const { data } = await useFetch<IParticipation>(
          `/api/event/${eventId}/participation`,
        );
        if (data.value) {
          this.band = data.value.band;
          this.bandBy = data.value.bandBy;
          this.district = data.value.district;
          this.bike = data.value.bike;
        }
      },

      async create({
        eventId,
        district,
        bike,
      }: {
        eventId: number;
        district: string;
        bike: string;
      }) {
        this.loading = true;

        const { data } = await useFetch<IParticipation>(
          `/api/event/${eventId}/participation`,
          {
            method: "POST",
            body: {
              bike,
              district,
            },
          },
        );

        this.loading = false;

        if (data.value) {
          this.band = data.value.band;
          this.bandBy = data.value.bandBy;
          this.district = data.value.district;
          this.bike = data.value.bike;
        }
      },
    },
  },
);
