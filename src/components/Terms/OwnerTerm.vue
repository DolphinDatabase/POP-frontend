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

const terms = ref([{ condicao: '' }])

// {
//   "id": 1,
//   "texto": "çldjaidas",
//   "grupo": "proprietario",
//   "aceite": true,
//   "condicoes": [
//     {
//       "texto": "condicao 1 ashduasdh",
//       "servico": 1,
//       "id": 1,
//       "aceite": false
//     },
//     {
//       "texto": "QUero receber spam maluco",
//       "servico": 2
//     }
//   ]
// }


const addTerm = () => {
  terms.value.push({ condicao: '' })
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
        grupo: 'proprietario',
        condicoes: terms.value
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
    .get('termo/?proprietario=true', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    .then((res) => {
      editorContent.value = res.data.text
      quill.root.innerHTML = res.data.text
      copyText.value = res.data.text
    })
}
onMounted(() => {
  quill = new Quill('#editor-prop', {
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
    <h3>Termos do Proprietário</h3>
    <div :style="next ? '' : 'display:none'">
      <div id="editor-prop"></div>
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
              v-model="term.condicao"
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

#editor-prop {
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
