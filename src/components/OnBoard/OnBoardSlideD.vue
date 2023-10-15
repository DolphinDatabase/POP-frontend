<script setup lang="ts"></script>
<template>
  <div class="on-board-d">
    <h4>Acesse seus dados</h4>
    <div class="config">
      <h6>Vá em configurações:</h6>
      <img src="../../assets/slides/configure.svg" alt="" />
    </div>
    <div class="account">
      <img src="../../assets/slides/account.svg" alt="" />
      <h6>Edite e exclua seus dados com facilidade.</h6>
    </div>
  </div>
</template>

<style scoped>
.on-board-d h4 {
  color: #405261;
  padding: 16px;
}

.on-board-item-d {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 16px;
}

.config img {
  width: 150px;
}

.config h6 {
  color: #748494;
  font-weight: 200;
  font-size: 14px;
}
.account {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 16px;
}

.account img {
  width: 200px;
  border-radius: 10px;
}

.account h6 {
  color: #748494;
  font-weight: 200;
  font-size: 14px;
}
</style>
