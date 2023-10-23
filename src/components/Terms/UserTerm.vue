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
    <div id="editor"></div>
  </div>
  <div class="adm-btn">
    <el-button round @click="cancelText">Cancelar</el-button>
    <el-button type="primary" round @click="saveText">Salvar</el-button>
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
</style>
