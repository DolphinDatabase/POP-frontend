<script setup lang="ts">
import api from '@/services/api'
import {onMounted, ref} from 'vue'

const termo = ref({texto:""})

onMounted(() => {
  api
    .get('termo/proprietario')
    .then((res) => {
      termo.value.texto = res.data.texto
    })
    .catch((error) => {
      console.error('erro:', error)
    })
})
</script>

<template>
  <div class="nav">
    <img class="arrow" @click="$router.push('/')" src="../../assets/arrow.svg" alt="" />
    <img src="../../assets/logos/light_logo.svg" alt="" />
  </div>
  <div class="terms-page" v-html="termo.texto">
  </div>
</template>

<style scoped>
.nav {
  padding: 36px 40px;
  display: grid;
  grid-template-columns: 3fr 4fr;
  align-items: center;
  background-color: #151718;
}

.terms-page {
  padding: 4px 240px;
  text-align: justify;
}

.arrow {
    width: 20px;
    cursor: pointer
}

button {
  appearance: none;
}
</style>
