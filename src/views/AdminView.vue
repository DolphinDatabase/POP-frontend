<script setup lang="ts">
import { MensagemSucesso, MensagemErro } from '@/components/Notificacao'
import api from '@/services/api'
import Quill from 'quill'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const editorContent = ref<string>('')
const token = ref()
const avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const copyText = ref<string>('')
let quill: any

function cancelText() {
  get_termo()
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

function get_termo() {
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

  get_termo()

  const route = useRoute()
  token.value = route.meta.token
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
    <div class="editor-container">
      <div id="editor"></div>
    </div>
    <div class="adm-btn">
      <el-button round @click="cancelText">Cancelar</el-button>
      <el-button type="primary" round @click="saveText">Salvar</el-button>
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

.editor-container {
  padding: 40px;
  padding-bottom: 0;
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
