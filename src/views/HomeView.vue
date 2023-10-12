<script setup lang="ts">
import PrincipalHome from '@/components/Home/PrincipalHome.vue'
import { ref, reactive, onMounted } from 'vue'
import SolutionsCarousel from '@/components/Home/SolutionsCarousel.vue'
import TeamDetails from '@/components/Home/TeamDetails.vue'
import api from '@/services/api'
import router from '@/router'
import { useAuthStore } from '@/store/auth'
import type { FormInstance, FormRules } from 'element-plus'
import { MensagemErro, MensagemSucesso } from '@/components/Notificacao'
import { useRoute } from 'vue-router'

interface CadastroForm {
  nome: string
  email: string
  senha: string
  proprietario: boolean
  doc: string
  termos: boolean
  privacidade: boolean
}

const cadastroFormRef = ref<FormInstance>()

const authStore = useAuthStore()
const options = ref(['Início', 'Solução', 'Sobre'])
const chooseOpt = ref('Início')
const loginModal = ref(false)
const cadastroModal = ref(false)
const token = ref()
const storeToken = (token: string, expiration: number) => {
  authStore.setToken(token, expiration)
}

const login = ref({
  username: '',
  password: ''
})

const cadastroForm = reactive<CadastroForm>({
  nome: '',
  email: '',
  senha: '',
  proprietario: false,
  doc: '',
  termos: false,
  privacidade: false
})

const rules = reactive<FormRules<CadastroForm>>({
  nome: [{ required: true, message: 'Por favor insira um nome.', trigger: 'blur' }],
  email: [{ required: true, message: 'Por favor insira um email.', trigger: 'blur' }],
  senha: [{ required: true, message: 'Por favor insira uma senha.', trigger: 'blur' }],
  proprietario: [{ required: false }],
  doc: [{ required: true, message: 'Por favor insira um CPF.', trigger: 'blur' }],
  termos: [{ required: true, message: 'Por favor aceite o termo de uso.', trigger: 'blur' }],
  privacidade: [{ required: true, message: 'Por favor aceite a política.', trigger: 'blur' }]
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

async function handleRegister(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      api
        .post('usuario', {
          nome: cadastroForm.nome,
          doc: cadastroForm.proprietario ? cadastroForm.doc : '',
          email: cadastroForm.email,
          proprietario: cadastroForm.proprietario,
          senha: cadastroForm.senha
        })
        .then(() => {
          setTimeout(() => {
            MensagemSucesso('Cadastro feito com sucesso!')
          }, 1000)
          loginModal.value = true
          cadastroModal.value = false
          formEl.resetFields()
        })
        .catch((err) => {
          console.log(err)
          setTimeout(() => {
            MensagemErro('Houve um erro ao concluir o cadastro!')
          }, 1000)
        })
    } else {
      console.log('error submit', fields)
    }
  })
}

function handleLogin() {
  const formData = new FormData()

  formData.append('username', login.value.username)
  formData.append('password', login.value.password)

  api
    .post('auth', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      if (response.status == 200) {
        getUser(response.data.access_token)
        return response.data
      }
    })
    .then((data) => {
      storeToken(data.access_token, data.expire)
    })
    .catch((error) => {
      setTimeout(() => {
        MensagemErro('Dados incorretos! Tente novamente!')
      }, 1000)
      console.error(error)
    })
}

function getUser(token: string) {
  api
    .get('/auth', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if(res.data.adm == false) {
        router.push('/maps')
      } else {
        router.push('/admin')
      }
      
    })
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
    <img src="../assets/logos/light_logo.svg" alt="" />
    © 2023 - Todos os direitos reservados
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
              <el-input v-model="login.username" placeholder="Email" />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="login.password"
                placeholder="Senha"
                type="password"
                show-password
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="login-btn">
          <div>
            <el-button type="primary" round @click="handleLogin()">Entrar</el-button>
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
      <div class="modal-register">
        <div class="modal-title">
          <h2>Criar conta</h2>
          <p>Digite as informações necessárias</p>
        </div>
        <div>
          <el-form
            :model="cadastroForm"
            :rules="rules"
            class="demo-ruleForm"
            label-width="120px"
            label-position="top"
            status-icon
            ref="cadastroFormRef"
            size="default"
          >
            <el-form-item prop="nome">
              <el-input v-model="cadastroForm.nome" placeholder="Nome completo" />
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="cadastroForm.email" placeholder="Email" />
            </el-form-item>
            <el-form-item prop="senha">
              <el-input
                v-model="cadastroForm.senha"
                placeholder="Senha"
                type="password"
                show-password
              />
            </el-form-item>
            <div class="checks">
              <el-checkbox
                v-model="cadastroForm.proprietario"
                label="É proprietário?"
                size="large"
                prop="proprietario"
              />
              <el-form-item v-if="cadastroForm.proprietario" prop="doc">
                <el-input v-model="cadastroForm.doc" placeholder="CPF" />
              </el-form-item>
              <div class="all-terms">
                <div class="check-terms">
                  <el-form-item prop="termos">
                    <el-checkbox
                      v-model="cadastroForm.termos"
                      label="Li e aceito os Termos de Uso."
                      size="large"
                    />
                    <el-icon @click="$router.push('/terms')"><Connection /></el-icon>
                  </el-form-item>
                </div>
                <div class="check-terms">
                  <el-form-item prop="privacidade">
                    <el-checkbox
                      v-model="cadastroForm.privacidade"
                      label="Li e aceito a Política de Privacidade."
                      size="large"
                    />
                    <el-icon @click="$router.push('/politics')"><Connection /></el-icon>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div class="login-btn">
          <div>
            <el-button type="primary" round @click="handleRegister(cadastroFormRef)"
              >Criar conta</el-button
            >
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

.modal-title p {
  margin: 8px 0;
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
  align-items: center;
}

.check-terms .el-icon {
  color: #2898ff;
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
  padding: 8px 32px;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
}

.modal-register {
  display: flex;
  padding: 20px 32px;
  flex-direction: column;
  gap: 16px;
}

.all-terms {
  display: grid;
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

.modal-register .modal-info .el-input__wrapper {
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

.modal .el-dialog__body {
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

.modal-register .el-form-item {
  margin-bottom: 16px;
}

.all-terms .el-form-item {
  margin-bottom: 0;
}

.checks .el-form-item {
  margin-bottom: 4px;
}
</style>
