<script setup lang="ts">

</script>
<template>
  <div class="nav">
    <div>
      <img src="../../assets/logos/black_logo.svg" alt="" />
    </div>
    <div class="container-btn">
      <div class="theme-btn">
        <img src="../../assets/themes/light_theme.svg" alt="" />
      </div>
      <div class="login">
        <el-button round>Entrar</el-button>
      </div>
      <div>
        <el-button type="primary" round>Cadastrar</el-button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.nav {
  padding: 36px 40px;
  display: grid;
  grid-template-columns: 12fr 1fr;
  align-items: center;
}


.container-btn {
  display: flex;
  gap: 24px;
  align-items: flex-end;
}

.theme-btn button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>
<style>
.el-button.is-round {
  width: 160px;
  transition: background-color 0.3s, color 0.3s;
}
.el-button.is-round:hover {
  font-weight: 700;
  background-color: transparent !important;
  color: #282A2C !important;
}

.el-button.el-button--primary.is-round {
  background-color: #282A2C !important;
  border: none;
}
.el-button.el-button--primary.is-round:hover {
  font-weight: 700;
  border: none; 
  color: #ffffff !important;
}

.login .el-button.is-round {
  border-color: #282a2c !important;
  color: #282a2c !important;
}
</style>
