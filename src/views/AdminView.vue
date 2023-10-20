<script setup lang="ts">
import { onMounted } from 'vue'
import UserTerm from '@/components/Terms/UserTerm.vue'
import OwnerTerm from '@/components/Terms/OwnerTerm.vue'

const avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

onMounted(() => {
  UserTerm
  OwnerTerm
})
</script>

<template>
  <div class="adm-view">
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
              <el-dropdown-item disabled>Administrador</el-dropdown-item>
              <el-dropdown-item @click="$router.push('/')">Sair</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-tabs tab-position="left" style="position: absolute" class="demo-tabs">
      <el-tab-pane label="Usuário"><user-term /></el-tab-pane>
      <el-tab-pane label="Proprietário"><owner-term /></el-tab-pane>
    </el-tabs>
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

.editor-container {
  padding: 8px 40px;
  padding-bottom: 0;
}

#editor {
  height: 65vh;
}

.adm-btn {
  position: relative;
  bottom: 0;
  background: white;
  width: 100%;
  text-align: right;
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
</style>
