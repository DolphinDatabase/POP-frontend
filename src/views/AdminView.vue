<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserTerm from '@/components/Terms/UserTerm.vue'
import OwnerTerm from '@/components/Terms/OwnerTerm.vue'
import OnBoardAdmin from '@/components/OnBoardAdmin/OnBoardAdmin.vue'

const avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const onBoardState = ref(true)

function setPrimeiroAcesso() {
  try {
    window.localStorage.setItem('first_adm_access', 'true')
  } catch {
    return false
  }
}

function getPrimeiroAcesso() {
  try {
    return localStorage.getItem('first_adm_access')
  } catch {
    return false
  }
}

function fecharOnBoard() {
  onBoardState.value = false
}

onMounted(() => {
  UserTerm
  OwnerTerm
  if (getPrimeiroAcesso() == null) {
    onBoardState.value = true
    setPrimeiroAcesso()
  } else {
    onBoardState.value = false
  }
})
</script>

<template>
  <div :style="onBoardState ? 'display:block' : 'display:none'">
    <OnBoardAdmin :fechar-on-board="fecharOnBoard" />
  </div>

  <div class="adm-view" :style="onBoardState ? 'display:none' : 'display:block'">
    <div class="navigation-adm">
      <div class="icon">
        <img src="../assets/logos/black_logo.svg" alt="" />
      </div>
      <div class="usr-options">
        <h5>Administrador</h5>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="40" :src="avatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled
                ><el-icon><UserFilled /></el-icon>Administrador</el-dropdown-item
              >
              <el-dropdown-item @click="onBoardState = true"
                ><el-icon><QuestionFilled /></el-icon>Ajuda</el-dropdown-item
              >
              <el-dropdown-item @click="$router.push('/')"
                ><el-icon><SwitchButton /></el-icon>Sair</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="tabs">
      <el-tabs tab-position="left" class="demo-tabs">
        <el-tab-pane label="Usuário"><user-term /></el-tab-pane>
        <el-tab-pane label="Proprietário"><owner-term /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.navigation-adm {
  display: grid;
  padding: 8px 32px;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  grid-template-columns: 1fr 1fr;
  justify-items: end;
}

.adm-view {
  height: 100%;
}

.usr-options {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>

<style>
.adm-btn .el-button.el-button {
  margin: 16px 36px;
}

.tabs .el-tab-pane {
  width: 85vw;
}

.tabs .el-tabs__content {
  height: calc(100vh - 79px);
}
</style>
