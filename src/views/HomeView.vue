<script setup lang="ts">
import PrincipalHome from '@/components/Home/PrincipalHome.vue'
import { ref } from 'vue'
import SolutionsCarousel from '@/components/Home/SolutionsCarousel.vue'
import TeamDetails from '@/components/Home/TeamDetails.vue'

const options = ref(['Início', 'Solução', 'Sobre'])
const chooseOpt = ref('Início')
const loginModal = ref(false)
const cadastroModal = ref(false)

const login = ref({
  email: '',
  senha: ''
})

const cadastro = ref({
  nome: '',
  email: '',
  senha: '',
  termos: false,
  privacidade: false
})

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
            <el-button type="primary" round @click="cadastroModal = true">Cadastrar</el-button>
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
    <div class="terms">
      <a href="/politics">Política de privacidade</a>
      <a href="/terms">Termos de Uso</a>
      <a href="https://github.com/DolphinDatabase/POP/wiki/Development-Team" target="_blank"
        >Suporte e contato</a
      >
    </div>
  </div>
  <footer>
    © 2023
    <img src="../assets/logos/light_logo.svg" alt="" />
    - All rights reserved
  </footer>
  <!-- MODAL -->
  <div class="modal" v-if="loginModal">
    <el-dialog v-model="loginModal">
      <div class="cover">
        <img src="../assets/capa.svg" alt="" />
      </div>
      <div class="modal-info">
        <div>
          <h2>Login</h2>
          <p>Digite as informações necessárias</p>
        </div>
        <div>
          <el-form :model="login" label-width="120px" label-position="top">
            <el-form-item>
              <el-input v-model="login.email" placeholder="Email" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="login.senha" placeholder="Senha" />
            </el-form-item>
          </el-form>
        </div>
        <div class="login-btn">
          <div>
            <el-button type="primary" round>Entrar</el-button>
          </div>
          <div style="display: 'flex'">
            <p>ou</p>
          </div>
          <div>
            <el-button
              round
              @click="
                () => {
                  cadastroModal = true
                  loginModal = false
                }
              "
              >Cadastrar</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
  <div class="modal" v-if="cadastroModal">
    <el-dialog v-model="cadastroModal">
      <div class="cover">
        <img src="../assets/capa.svg" alt="" />
      </div>
      <div class="modal-info">
        <div>
          <h2>Criar conta</h2>
          <p>Digite as informações necessárias</p>
        </div>
        <div>
          <el-form :model="cadastro" label-width="120px" label-position="top">
            <el-form-item>
              <el-input v-model="cadastro.nome" placeholder="Nome completo" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="cadastro.email" placeholder="Email" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="cadastro.senha" placeholder="Senha" />
            </el-form-item>
            <div class="check-terms">
              <el-checkbox
                v-model="cadastro.termos"
                label="Li e aceito os Termos de Uso."
                size="large"
              />
              <el-icon @click="$router.push('/terms')"><Connection /></el-icon>
            </div>
            <div class="check-terms">
              <el-checkbox
                v-model="cadastro.privacidade"
                label="Li e aceito a Política de Privacidade."
                size="large"
              />
              <el-icon @click="$router.push('/politics')"><Connection /></el-icon>
            </div>
          </el-form>
        </div>
        <div class="login-btn">
          <div>
            <el-button type="primary" round>Criar conta</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.terms {
  display: flex;
  gap: 24px;
  flex-direction: column;
  padding: 0 50px 50px 50px;
}

.terms a {
  color: #282a2c;
  text-decoration: none;
}

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

.check-terms {
  display: grid;
  grid-template-columns: 4fr 1fr;
  align-items: center;
}

.check-terms .el-icon{
  color: #2898FF;
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

.modal img {
  height: 500px;
  width: 400px;
  object-fit: cover;
  border-radius: 25px 0px 0px 25px;
}

.modal-info {
  display: flex;
  padding: 0 32px;
  justify-content: center;
  flex-direction: column;
  gap: 24px;
}

.modal-info h2 {
  color: #000000;
}

.login-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

footer {
  background-color: #282a2c;
  color: #ffffff;
  font-weight: 200;
  display: flex;
  justify-content: center;
  padding: 4px 0;
  gap: 8px;
}

footer img {
  width: 60px;
}
</style>

<style>
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #282a2c !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #282a2c !important;
  border-color: #282a2c !important;
  color: #ffffff;
}

.login-btn .el-button.is-round {
  width: 20vw !important;
}

.el-input__wrapper {
  box-shadow: none !important;
  border-bottom: solid 1px #d7d9dd;
}

.el-dialog {
  border-radius: 25px !important;
}

.el-dialog__header {
  padding: 0 !important;
  padding-bottom: 0 !important;
}

.el-dialog__body {
  padding: 0 !important;
  height: 500px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

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
