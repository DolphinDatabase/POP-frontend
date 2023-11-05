<script setup lang="ts">
import { ref } from 'vue'
import OnBoardItem from '@/components/OnBoard/OnBoardItem.vue'

const items = ref(['Adicionar', 'Editar', 'Excluir parâmetros'])
</script>
<template>
  <div class="on-board-d">
    <h4>Clicando em "continuar" você consegue:</h4>
    <div class="on-board-item-d">
      <OnBoardItem v-for="(item, index) in items" :key="index" :texto="item" />
    </div>
    <h6>Que serão utilizados para facilitar a transparência e proteção ao usuário.</h6>
    <img src="../../assets/slides/param.svg" alt="" style="width: 700px;"/>
  </div>
</template>

<style scoped>
.on-board-d h4 {
  color: #405261;
  padding: 16px;
}

.on-board-d h6 {
  color: #748494;
  text-align: left;
  font-weight: 200;
  font-size: medium;
}

.on-board-item-d {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}
</style>
