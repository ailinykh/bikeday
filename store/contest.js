import { defineStore } from "pinia";

export const useContestStore = defineStore("contest", {
    state: () => {
        return {
            contests: [],
            opened: [],
            contest: null,
            participations: [],
            error: null,
            isLoading: false,
        }
    },
    actions: {
        async add(id, user) {
            this.isLoading = true
            const { data: { value: data }} = await useFetch('/api/contest/add', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: { id, user },
            })

            this.isLoading = false

            if (data.participation) {
                const p = [...this.participations, data.participation]
                this.$patch({
                    participations: p
                })
            }
            
        },

        async load() {
            this.isLoading = true
            const ts = (new Date()).getTime()
            const { data: { value: data }} = await useFetch('/api/contest/all', { 
                params: { ts }
            })
            
            this.isLoading = false

            if (!data) {return}
            this.contests = data.contests || []
            this.opened = data.opened || []
            this.participations = data.participations || []
            this.error = data.error
        },

        async getContest(id) {

        },

        async update(id, update) {
            const { data: { value: data }} = await useFetch('/api/contest/update', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: { id, update },
            })
            this.$patch({
                contests: this.contests.map(c => c.id == id ? data.contest : c),
                contest: data.contest
            })
        },

        async cancel(id) {
            const { data: { value: data }} = await useFetch('/api/contest/cancel', { 
                params: { id }
            })

            this.$patch({
                participations: this.participations.filter(p => p.id != id)
            })
        }
    }
})