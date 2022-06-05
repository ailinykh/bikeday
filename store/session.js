import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
    state: () => {
        return {
            isVolunteer: false,
            isAdmin: false,
            user: null,
            isLoading: false,
            error: null,
            createdAt: null,
            phone: null
        }
    },
    actions: {
        async create(phone) {
            this.isLoading = true

            const ts = (new Date()).getTime()
            const options = {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                params: { ts },
                body: { phone },
            }
            const res = await useFetch('/api/session/create', options)
            const { data: { value: data } } = res

            this.isLoading = false
            this.error = data.error
            this.createdAt = data.createdAt
            this.phone = data.phone

            //TODO: deprecated
            if (data.error == 'message is denied') {
                this.error = 'К сожалению, ваш оператор не пропускает смс. Мы работаем над устранением проблемы. Пожалуйста, попробуйте позже'
            }
        },

        async validate(code) {
            this.isLoading = true
            this.error = null

            const phone = this.phone
            const options = {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: { code, phone },
            }
            const res = await useFetch('/api/session/validate', options)
            const { data: { value: data } } = res

            this.isLoading = false
            this.error = data.error
            this.user = data.user
            this.isVolunteer = !!data.isVolunteer
            this.isAdmin = !!data.isAdmin

            if (data.user) 
                return navigateTo('/profile')
        },

        async authenticate(session) {
            const options = {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: { token: session },
            }
            const res = await useFetch('/api/session/authenticate', options)
            const { data: { value: data } } = res
            this.user = data.user
            this.isVolunteer = !!data.isVolunteer
            this.isAdmin = !!data.isAdmin
        },

        async destroy() {
            await useFetch('/api/session/destroy')
            this.$reset()
        }
    }
})