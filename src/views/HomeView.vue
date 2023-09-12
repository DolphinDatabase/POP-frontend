<script setup lang="ts">
import NavBar from '@/components/Home/NavBar.vue'
import PrincipalHome from '@/components/Home/PrincipalHome.vue'
import { ref } from 'vue'
import SolutionsCarousel from '@/components/Home/SolutionsCarousel.vue'
import TeamDetails from '@/components/Home/TeamDetails.vue'
import LoginModal from '@/components/Modal/ModalLogin.vue'

const options = ref(['Início', 'Solução', 'Sobre'])
const chooseOpt = ref('Início')
const loginModal = ref(false)

function scrollToElement(option: string) {
  let elementId = ''
  switch (option) {
    case 'Início':
      elementId = 'home'
      break
    case 'Solução':
      elementId = 'solution'
      break
    case 'Sobre':
      elementId = 'about'
      break
    default:
      break
  }
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

</script>

<template>
  <div class="container">
    <div class="navigation">
      <div class="nav">
        <div>
          <img src="../assets/logos/black_logo.svg" alt="" />
        </div>
        <div class="container-btn">
          <div class="theme-btn">
            <img src="../assets/themes/light_theme.svg" alt="" />
          </div>
          <div class="login">
            <el-button round @click="loginModal = true">Entrar</el-button>
          </div>
          <div>
            <el-button type="primary" round>Cadastrar</el-button>
          </div>
        </div>
      </div>
      <div class="radio-container">
        <div>
          <el-radio-group v-model="chooseOpt">
            <el-radio
              v-for="(option, index) in options"
              :key="index"
              :label="option"
              border
              @click="scrollToElement(option)"
            >
              {{ option }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="home-container" id="home">
      <principal-home />
    </div>
    <div class="carousel" id="solution">
      <solutions-carousel />
    </div>
    <div class="team" id="about">
      <team-details />
    </div>
  </div>
  <div class="modal" v-if="loginModal">
    <el-dialog v-model="loginModal" title="Shipping address">
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="loginModal = false">Cancel</el-button>
        <el-button type="primary" @click="loginModal = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
  <footer>© All rights reserved.</footer>
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

.container {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  background-color: #ffffff;
}

.radio-container {
  display: flex;
  justify-content: center;
  height: 54px;
}

footer {
  background-color: #282a2c;
  color: #ffffff;
  font-weight: 200;
  display: flex;
  justify-content: center;
  padding: 4px 0;
}
</style>

<style>
.el-radio.is-bordered.is-checked {
  border-color: #53b137 !important;
  border-radius: 50px !important;
  font-weight: 700;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #53b137 !important;
}

.el-radio.is-bordered {
  border-color: #282a2c !important;
  border-radius: 50px !important;
  color: #282a2c !important;
  width: 105px;
  display: flex;
  justify-content: center;
}

.el-radio__inner {
  display: none !important;
}

.el-button.is-round {
  width: 160px;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.el-button.is-round:hover {
  font-weight: 700;
  background-color: transparent !important;
  color: #282a2c !important;
}

.el-button.el-button--primary.is-round {
  background-color: #282a2c !important;
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
