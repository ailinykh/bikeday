import { defineStore } from "pinia";

export const useEventStore = defineStore("event", {
    state: () => {
        return {
            participation: null,
            error: null,
            isLoading: false,
        }
    },
    actions: {
        async create(body) {
            this.isLoading = true
            const ts = (new Date()).getTime()
            const options = {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                params: { ts },
                body
            }
            const res = await useFetch('/api/event/create', options)
            const { data: { value: data } } = res
            this.isLoading = false
            this.participation = data.participation
            this.error = data.error
        },

        async load() {
            const ts = (new Date()).getTime()
            const res = await useFetch('/api/event/load', { 
                params: { ts }
            })
            const { data: { value: data } } = res
            if (!data) { return } //TODO: event.js:35 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'participation')
            this.participation = data.participation
            this.error = data.error
        }
    }
})