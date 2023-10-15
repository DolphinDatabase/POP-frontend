<script setup lang="ts">
const props = defineProps({
  fecharOnBoard: {
    required: true,
    type: Function
  }
})
</script>
<template>
  <div class="on-board-e">
    <h2>Acesse essa tela <span>a qualquer momento</span>, clicando em ajuda</h2>
    <img src="../../assets/slides/help.svg" alt="" />
    <el-button type="primary" round @click="fecharOnBoard">Ir para a aplicação</el-button>
  </div>
</template>

<style scoped>
.on-board-e {
  display: grid;
  gap: 32px;
  justify-items: center;
  align-items: center;
}
.on-board-e h2 {
  color: #405261;
  padding: 16px;
}

.on-board-e span {
  color: #60bb45;
}
</style>

<style>
.on-board-e .el-button.el-button--primary.is-round {
  width: 300px;
}
</style>
