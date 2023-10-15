<script setup lang="ts">
import { ref } from 'vue'
import OnBoardItem from './OnBoardItem.vue'

const items = ref(['Empreendedorismo', 'Cultivo', 'Plantio'])
</script>
<template>
  <div class="on-board-c">
    <h4>Clique sobre as glebas para saber informações de:</h4>
    <div class="on-board-item-c">
      <OnBoardItem v-for="(item, index) in items" :key="index" :texto="item" />
    </div>
    <img src="../../assets/slides/glebas_info.svg" alt="" />
  </div>
</template>

<style scoped>
.on-board-c h4 {
  color: #405261;
  padding: 16px;
}

.on-board-item-c {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.on-board-c img {
  width: 500px;
}
</style>
