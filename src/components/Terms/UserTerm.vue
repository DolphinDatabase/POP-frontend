<script setup lang="ts">
import { MensagemSucesso, MensagemErro } from '@/components/Notificacao'
import api from '@/services/api'
import Quill from 'quill'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const editorContent = ref<string>('')
const token = ref()
const copyText = ref<string>('')
let quill: any
const next = ref(true)

const terms = ref([{ param: '' }])

const addTerm = () => {
  terms.value.push({ param: '' })
}

const removeTerm = (index: number) => {
  if (index !== -1) {
    terms.value.splice(index, 1)
  }
}

function cancelText() {
  getTermo()
  const savedText = copyText.value
  quill.root.innerHTML = savedText
  setTimeout(() => {
    MensagemSucesso('As alterações foram canceladas com sucesso!')
  }, 1000)
}

function saveText() {
  api
    .post(
      'termo',
      {
        text: editorContent.value,
        proprietario: false
      },
      {
        headers: { Authorization: `Bearer ${token.value}` }
      }
    )
    .then(() => {
      setTimeout(() => {
        MensagemSucesso()
      }, 1000)
    })
    .catch((err) => {
      console.log(err)
      setTimeout(() => {
        MensagemErro()
      }, 1000)
    })
}

function getTermo() {
  api
    .get('termo/last?proprietario=false', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    .then((res) => {
      editorContent.value = res.data.text
      quill.root.innerHTML = res.data.text
      copyText.value = res.data.text
    })
}
onMounted(() => {
  quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Digite os termos de uso.'
  })

  quill.on('text-change', () => {
    editorContent.value = quill.root.innerHTML
  })

  getTermo()

  const route = useRoute()
  token.value = route.meta.token
})
</script>

<template>
  <div class="editor-container">
    <h3>Termos do usuário</h3>
    <div :style="next ? '' : 'display:none'">
      <div id="editor"></div>
    </div>
    <div :style="next ? 'display:none' : ''">
      <p>Adicione parâmetros para os termos do usuário provedor de dados</p>
      <div v-for="(term, index) in terms" :key="index">
        <div class="row">
          <div class="col s2">
            <div class="param-label">
              <label>Parâmetro {{ index + 1 }}</label>
              <el-icon v-if="index != 0" @click="removeTerm(index)"><Close /></el-icon>
            </div>
            <el-input
              v-model="term.param"
              placeholder="Escreva um parâmetro de aceite"
              style="margin-bottom: 16px"
            />
          </div>
        </div>
      </div>
      <el-button @click="addTerm" class="btn waves-effect waves-light"
        ><el-icon><Plus /></el-icon
      ></el-button>
    </div>
  </div>
  <div class="adm-btn">
    <div v-if="next">
      <el-button round @click="cancelText">Cancelar</el-button>
      <el-button type="primary" round @click="next = false">Continuar</el-button>
    </div>
    <div v-else>
      <el-button round @click="cancelText">Cancelar</el-button>
      <el-button round @click="next = true">Voltar</el-button>
      <el-button type="primary" round @click="saveText">Salvar</el-button>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  padding: 8px 40px;
  padding-bottom: 0;
  width: 85vw;
}

#editor {
  height: 65vh;
}

.param-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.adm-btn {
  position: absolute;
  bottom: 0;
  background: white;
  width: 100%;
  text-align: right;
}
</style>

<style>
.adm-btn .el-button.el-button {
  margin: 16px 36px;
}

.param-label .el-icon {
  cursor: pointer;
}

.param-label .el-icon:hover {
  color: red;
}
</style>
