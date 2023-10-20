<script setup lang="ts">
import { ref } from 'vue'
import OnBoardItem from '@/components/OnBoard/OnBoardItem.vue'

const items = ref(['Termos de usuário', 'Termos de proprietário'])
</script>
<template>
  <div class="on-board-b">
    <h4>Você como usuário adm terá acesso a:</h4>
    <div class="on-board-item-b">
      <OnBoardItem v-for="(item, index) in items" :key="index" :texto="item" />
    </div>
    <h6>Você poderá acessar cada um desses tópicos na barra lateral esquerda:</h6>
    <img src="../../assets/slides/tabs.svg" alt="" />
  </div>
</template>

<style scoped>
.on-board-b h4 {
  color: #405261;
  padding: 16px;
}

.on-board-b h6 {
  color: #748494;
  text-align: left;
  font-weight: 200;
  font-size: medium;
}

.on-board-item-b {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}
</style>
