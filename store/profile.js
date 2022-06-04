import { defineStore } from "pinia";

import { useSessionStore } from '~/store/session'

export const useProfileStore = defineStore("profile", {
    state: () => {
        return {
            error: null,
            isLoading: false,
        }
    },
    actions: {
        async update(body) {
            this.isLoading = true
            const ts = (new Date()).getTime()
            const options = {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                params: { ts },
                body
            }
            const res = await useFetch('/api/profile/update', options)
            const { data: { value: data } } = res

            this.isLoading = false
            this.error = data.error

            if (data.user) {
                const session = useSessionStore()
                session.$patch({ user: data.user })
            }
        }
    }
})