import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    tokenExpiration: 0,
  }),
  actions: {
    setToken(token: string, expiration: number) {
      this.token = token;
      this.tokenExpiration = expiration;
    },
  },
});
