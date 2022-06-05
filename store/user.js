import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            users: [], // in case of 4-digits search
            user: null,
            error: null,
            isLoading: false,
        }
    },
    actions: {
        async findByBand(band) {
            this.isLoading = true
            const options = {
                params: { band },
            }
            const res = await useFetch('/api/user/find', options)
            const { data: { value: data } } = res
            this.isLoading = false
            this.error = data.error
            this.user = data.user
        },

        async findByPhone(phone) {
            this.isLoading = true
            const options = {
                params: { phone },
            }
            const res = await useFetch('/api/user/find', options)
            const { data: { value: data } } = res
            
            this.isLoading = false
            this.error = data.error
            this.user = data.user
            this.users = data.users || []
        },

        async band(id, band) {
            this.isLoading = true
            const options = {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: { id, band },
            }
            const res = await useFetch('/api/user/band', options)
            const { data: { value: data } } = res
            
            this.isLoading = false
            this.error = data.error
            this.user = data.user
            this.users = data.users || []
        },

        async register(body) {
            this.isLoading = true
            const options = {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body,
            }
            const res = await useFetch('/api/user/register', options)
            const { data: { value: data } } = res
            
            this.isLoading = false
            this.error = data.error
            this.user = data.user
            this.users = data.users || []
        }
    }
})