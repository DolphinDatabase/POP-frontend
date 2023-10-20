<script setup lang="ts">
const props = defineProps({
  fecharOnBoard: {
    required: true,
    type: Function
  }
})
</script>
<template>
  <div class="on-board-d">
    <h2>Acesse essa tela <span>a qualquer momento</span>, clicando em ajuda</h2>
    <img src="../../assets/slides/adm_help.svg" alt="" />
    <el-button type="primary" round @click="props.fecharOnBoard">Ir para a aplicação</el-button>
  </div>
</template>

<style scoped>
.on-board-d {
  display: grid;
  gap: 32px;
  justify-items: center;
  align-items: center;
}
.on-board-d h2 {
  color: #405261;
  padding: 16px;
}

.on-board-d span {
  color: #60bb45;
}
</style>

<style>
.on-board-d .el-button.el-button--primary.is-round {
  width: 300px;
}
</style>
