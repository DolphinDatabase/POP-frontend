<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed, reactive } from 'vue'
import api from '@/services/api'
import { useRoute } from 'vue-router'
import { MensagemErro, MensagemSucesso } from '@/components/Notificacao'
import router from '@/router'
import OnBoard from '@/components/OnBoard/OnBoard.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface TermsForm {
  termos: boolean
  privacidade: boolean
  condicoes: [
    {
      id: number
      texto: string
      aceite: boolean
      servico: string
    }
  ]
}

interface chartData {
  [key: string]: null | number
}

const user = ref({ id: 0, nome: '', doc: '', email: '', grupo: '' })
const savedInfo = ref({ id: 0, nome: '', doc: '', email: '', grupo: '' })
const token = ref()
const currPos = computed(() => ({
  lat: -14.235004,
  lng: -51.92528
}))
const op_id = ref()
const gl_id = ref()
const otherPos = ref()
const latLngListener = ref()
const avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const userInfo = ref(false)
const continueLoad = ref(false)
const onBoardState = ref(true)
const drawer = ref(false)
const op = ref()
const terms = ref(false)
const pdfContent = ref(null)
const termos = ref({
  id: 0,
  grupo: '',
  data: '',
  texto: '',
  aceite: false,
  condicoes: [
    {
      id: 0,
      texto: '',
      aceite: false,
      servico: ''
    }
  ]
})

const timeSeriesExist = ref(false)
const timeSeriesData = ref<(number | null)[]>([])
const timeSeriesPredict = ref<(number | null)[]>([])

const cadastroTerms = reactive<TermsForm>({
  termos: false,
  privacidade: false,
  condicoes: [
    {
      id: 0,
      texto: '',
      aceite: false,
      servico: ''
    }
  ]
})

const chartOptions = {
  chart: {
    type: 'area'
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    categories: []
  }
}

const chartSeries = [
  {
    name: 'Data',
    data: timeSeriesData
  },
  {
    name: 'Predict',
    data: timeSeriesPredict
  }
]

function setPrimeiroAcesso() {
  try {
    window.localStorage.setItem('first_access', 'true')
  } catch {
    return false
  }
}

function getPrimeiroAcesso() {
  try {
    return localStorage.getItem('first_access')
  } catch {
    return false
  }
}

async function generatePDF(op: any) {
  const pdf = new jsPDF()

  pdf.setFontSize(10)

  pdf.text(`Id operação: ${op_id.value}`, 10, 10)
  pdf.text(`Id da gleba: ${gl_id.value}`, 10, 20)

  pdf.text('Plantio', 10, 40)
  pdf.text(`Início plantio: ${op.inicio_plantio}`, 10, 50)
  pdf.text(`Fim plantio: ${op.fim_plantio}`, 10, 60)
  pdf.text(`Início colheita: ${op.inicio_colheita}`, 10, 70)
  pdf.text(`Fim colheita: ${op.fim_colheita}`, 10, 80)
  pdf.text(`Estado: ${op.estado.descricao}`, 10, 90)
  pdf.text(`Município: ${op.municipio.descricao}`, 10, 100)

  pdf.text('Sistema de produção Agrícola', 10, 120)
  pdf.text(`Tipo Solo: ${op.solo.descricao}`, 10, 130)
  pdf.text(`Irrigação: ${op.irrigacao.descricao}`, 10, 140)
  pdf.text(`Tipo cultivo: ${op.cultivo.descricao}`, 10, 150)
  pdf.text(`Grão/Semente: ${op.grao_semente.descricao}`, 10, 160)
  pdf.text(`Ciclo do cultivar: ${op.ciclo.descricao}`, 10, 170)

  pdf.text('Empreendimento', 10, 190)
  pdf.text(`Cesta: ${op.empreendimento.cesta}`, 10, 200)
  pdf.text(`Zoneamento: ${op.empreendimento.zoneamento}`, 10, 210)
  pdf.text(`Variedade: ${op.empreendimento.variedade}`, 10, 220)
  pdf.text(`Produto: ${op.empreendimento.produto}`, 10, 230)
  pdf.text(`Modalidade: ${op.empreendimento.modalidade}`, 10, 240)
  pdf.text(`Atividade: ${op.empreendimento.atividade}`, 10, 250)
  pdf.text(`Finalidade: ${op.empreendimento.finalidade}`, 10, 260)

  if (timeSeriesExist.value) {
    const el = document.getElementById('chartContainer')

    const options = {
      type: 'dataURL'
    }

    const printCanvas = await html2canvas(el!, options)
    let img = printCanvas.toDataURL('image/png').replace('image/png', 'image/time-series')

    pdf.addPage()

    pdf.text('Predição', 10, 10)

    const imgData = img
    const imgWidth = 100
    const imgHeight = 80

    pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight)
  }

  pdf.save('document.pdf')
}

function fecharOnBoard() {
  onBoardState.value = false
}

function deleteUser() {
  api
    .delete('usuario/', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    .then(() => {
      setTimeout(() => {
        MensagemSucesso('A conta foi deletada com sucesso!')
      }, 1000)
      router.push('/')
    })
    .catch((err) => {
      console.log(err)
      setTimeout(() => {
        MensagemErro('Não foi possível excluir sua conta!')
      }, 1000)
    })
}

function updateUser() {
  api
    .put(
      'usuario',
      {
        id: user.value.id,
        nome: user.value.nome,
        doc: user.value.doc,
        email: user.value.email,
        grupo: user.value.grupo
      },
      {
        headers: { Authorization: `Bearer ${token.value}` }
      }
    )
    .then(() => {
      getUser()
      setTimeout(() => {
        MensagemSucesso('As alterações foram salvas com sucesso!')
      }, 1000)
    })
    .catch((err) => {
      console.log(err)
      setTimeout(() => {
        MensagemErro()
      }, 1000)
    })
  userInfo.value = false
}

function cancelUpdate() {
  getUser()
  user.value = savedInfo.value
  userInfo.value = false
  setTimeout(() => {
    MensagemSucesso('As alterações foram canceladas com sucesso!')
  }, 1000)
}

function getUser() {
  api
    .get('/auth', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    .then((res) => {
      user.value = { ...res.data }
      savedInfo.value = res.data
      getTermo()
    })
}

function getTermo() {
  api
    .get('termo', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    .then((res) => {
      termos.value = res.data
      if (res.data.grupo == 'proprietario') {
        cadastroTerms.condicoes = res.data.condicoes
      } else {
        cadastroTerms.condicoes = res.data.condicoes
      }
    })
}

async function handleTerms() {
  if (termos.value.aceite) {
    api
      .put(
        'termo',
        {
          id: termos.value.id,
          grupo: termos.value.grupo,
          data: termos.value.data,
          texto: termos.value.texto,
          aceite: termos.value.aceite,
          condicoes: cadastroTerms.condicoes
        },
        {
          headers: { Authorization: `Bearer ${token.value}` }
        }
      )
      .then(() => {
        terms.value = false
        setTimeout(() => {
          MensagemSucesso('Alteração feita com sucesso!')
        }, 1000)
      })
      .catch((err) => {
        console.log(err)
        setTimeout(() => {
          MensagemErro('Houve um erro ao concluir o aceite!')
        }, 1000)
      })
  } else {
    setTimeout(() => {
      MensagemErro('Aceite os termos de uso, por favor!')
    }, 1000)
  }
}

onMounted(() => {
  if (getPrimeiroAcesso() == null) {
    onBoardState.value = true
    setPrimeiroAcesso()
  } else {
    onBoardState.value = false
  }
  const route = useRoute()
  token.value = route.meta.token
  initMap()
  getUser()
})

onUnmounted(async () => {
  if (latLngListener.value) latLngListener.value.remove()
})

function initMap(): void {
  const mapElement = document.getElementById('map')
  const input = document.getElementById('search') as HTMLInputElement
  const searchBox = new google.maps.places.SearchBox(input)
  let initialCircleRadius = 100000

  async function get_glebas(lat: number, long: number, radius: number, page: number = 1) {
    const step = 100
    const limit = page * step
    const init = limit - step

    try {
      const res = await api.get(
        `gleba/location?lat=${lat}&long=${long}&size=${radius}&skip=${init}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token.value}` }
        }
      )

      if (res.data.features.length > 0) {
        if (continueLoad.value) {
          map.data.addGeoJson(res.data)
          await get_glebas(lat, long, radius, page + 1)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  if (mapElement) {
    var map = new google.maps.Map(mapElement, {
      center: currPos.value,
      zoom: 5,
      mapTypeId: 'hybrid',
      minZoom: 6,
      maxZoom: 18
    })

    const geoJsonStyle = {
      fillColor: 'white',
      strokeColor: 'white',
      strokeWeight: 2,
      zIndex: 1
    }

    const circleOptions = {
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillOpacity: 0,
      map: map,
      center: currPos.value,
      radius: initialCircleRadius,
      draggable: true,
      zIndex: 0
    }

    const circle = new google.maps.Circle(circleOptions)

    document.getElementById('zoom-in-control')!.addEventListener('click', () => {
      initialCircleRadius *= 2
      circle.setRadius(initialCircleRadius)
    })

    document.getElementById('zoom-out-control')!.addEventListener('click', () => {
      initialCircleRadius /= 2
      circle.setRadius(initialCircleRadius)
    })

    google.maps.event.addListener(circle, 'drag', () => {
      continueLoad.value = false
      map.data.forEach((feature) => {
        map.data.remove(feature)
      })
    })
    google.maps.event.addListener(circle, 'dragend', () => {
      const newCenter = circle.getCenter()
      const newRadius = circle.getRadius()
      continueLoad.value = true

      if (otherPos.value) {
        otherPos.value.lat = newCenter.lat()
        otherPos.value.lng = newCenter.lng()
      }

      get_glebas(newCenter.lat(), newCenter.lng(), newRadius)
    })

    var currMarker = new google.maps.Marker({
      position: map.getCenter(),
      draggable: true,
      icon: {
        url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png',
        size: new google.maps.Size(7, 7),
        anchor: new google.maps.Point(4, 4)
      },
      map: map
    })
    circle.bindTo('center', currMarker, 'position')

    map.data.setStyle(() => {
      return geoJsonStyle
    })

    map.data.addListener('click', (event) => {
      const properties = event.feature.h

      const plotCoordinates = event.latLng

      const newZoomLevel = 16
      const newPosition = plotCoordinates

      const sidePanel = document.getElementById('side-panel')

      map.setZoom(newZoomLevel)
      map.setCenter(newPosition)

      api
        .get(`operacao/${properties.operacao_id}`, {
          headers: { Authorization: `Bearer ${token.value}` }
        })
        .then((data) => {
          if (data.status == 200) {
            op_id.value = properties.operacao_id
            gl_id.value = properties.gleba_id
            drawer.value = true
            op.value = data.data
            var inicio = new Date(op.value.fim_plantio)
            inicio.setDate(inicio.getDate() - 60)
            var inicio_format = `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(
              2,
              '0'
            )}-${String(inicio.getDate()).padStart(2, '0')}`
            var fim = new Date(op.value.fim_colheita)
            fim.setDate(fim.getDate() + 60)
            var fim_format = `${fim.getFullYear()}-${String(fim.getMonth() + 1).padStart(
              2,
              '0'
            )}-${String(fim.getDate()).padStart(2, '0')}`
            api
              .get(
                `time_series?gleba=${properties.gleba_id}&inicio=${inicio_format}&fim=${fim_format}`
              )
              .then((ts) => {
                if (ts.status == 200) {
                  timeSeriesExist.value = true
                  var data: chartData = {}
                  var data_predict: chartData = {}
                  for (let i in ts.data.data) {
                    var d = new Date(parseInt(i, 10))
                    var formatted_data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                      2,
                      '0'
                    )}-${String(d.getDate()).padStart(2, '0')}`
                    data_predict[formatted_data] = null
                    data[formatted_data] = ts.data.data[i]
                  }
                  for (let i in ts.data.predict) {
                    var d = new Date(parseInt(i, 10))
                    var formatted_data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                      2,
                      '0'
                    )}-${String(d.getDate()).padStart(2, '0')}`
                    data_predict[formatted_data] = ts.data.predict[i]
                  }
                  timeSeriesData.value = Object.values(data)
                  timeSeriesPredict.value = Object.values(data_predict)
                }
              })
              .catch((err) => {
                timeSeriesExist.value = false
              })
          }
        })
    })

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(input)

    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds)
    })

    let markers: google.maps.Marker[] = []

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces()

      if (places.length == 0) {
        return
      }

      markers.forEach((marker) => {
        marker.setMap(null)
      })
      markers = []

      const bounds = new google.maps.LatLngBounds()

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry')
          return
        }

        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        }

        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location
          })
        )

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport)
        } else {
          bounds.extend(place.geometry.location)
        }

        circle.setCenter(place.geometry.location)
      })
      const maxZoom = 5
      map.fitBounds(bounds)

      if (map.getZoom() > maxZoom) {
        map.setZoom(maxZoom)
      }
    })
  }
}
</script>

<template>
  <div :style="onBoardState ? 'display:block' : 'display:none'">
    <OnBoard :fechar-on-board="fecharOnBoard" />
  </div>

  <div :style="onBoardState ? 'display:none' : 'display:block'">
    <div>
      <div class="location-container">
        <div class="location">
          <img src="../../assets/logos/black_logo.svg" alt="" />
        </div>
        <div class="usr-options">
          <div class="usr-options">
            <h5>{{ savedInfo.nome }}</h5>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-avatar :size="40" :src="avatar" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled
                    ><el-icon><UserFilled /></el-icon>{{ user.nome }}</el-dropdown-item
                  >
                  <el-dropdown-item @click="onBoardState = true"
                    ><el-icon><QuestionFilled /></el-icon>Ajuda</el-dropdown-item
                  >
                  <el-dropdown-item @click="userInfo = true"
                    ><el-icon><Tools /></el-icon>Configurações</el-dropdown-item
                  >
                  <el-dropdown-item @click="terms = true" target="_blank"
                    ><el-icon><Management /></el-icon>Termos e condições
                  </el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/')"
                    ><el-icon><SwitchButton /></el-icon>Sair</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="location-content">
        <input id="search" class="controls" type="text" placeholder="Pesquisar" />
        <div id="map" style="height: 86vh"></div>
        <div id="zoom-controls">
          <div id="zoom-in-control" class="custom-control">+</div>
          <div id="zoom-out-control" class="custom-control">-</div>
        </div>
      </div>
    </div>
    <footer>
      <img src="../../assets/logos/light_logo.svg" alt="" />
      © 2023 | Mapa de Glebas distribuído por Google
    </footer>
    <!-- MODAL -->
    <div class="user-modal" v-if="userInfo">
      <el-dialog v-model="userInfo">
        <div class="user-info">
          <div>
            <h2>Configurações</h2>
          </div>
          <div class="info-content">
            <h3>Editar perfil</h3>
            <el-form :model="user" label-width="120px" label-position="top">
              <p>Nome</p>
              <el-form-item>
                <el-input v-model="user.nome" />
              </el-form-item>
              <p v-if="user.nome === ''" style="color: #ef5350">Por favor preencha o nome!</p>
              <p>Email</p>
              <el-form-item>
                <el-input v-model="user.email" />
              </el-form-item>
              <p v-if="user.email === ''" style="color: #ef5350">Por favor preencha o email!</p>
              <div v-if="user.grupo === 'proprietario'">
                <p>CPF</p>
                <el-form-item>
                  <el-input v-model="user.doc" disabled />
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="del-user" @click="deleteUser()">
            <h4>Excluir conta</h4>
          </div>
          <div class="upd-btn">
            <div>
              <el-button round @click="cancelUpdate">Cancelar</el-button>
            </div>
            <div>
              <el-button type="primary" round @click="updateUser()">Salvar</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="terms-modal" v-if="terms">
      <el-dialog v-model="terms">
        <h3>Termos e condições</h3>
        <div class="all-terms">
          <el-form
            :model="cadastroTerms"
            class="demo-ruleForm"
            label-width="120px"
            label-position="top"
            status-icon
            size="default"
          >
            <div class="check-terms" v-for="condicao in cadastroTerms.condicoes" :key="condicao.id">
              <el-form-item prop="condicoes">
                <el-checkbox
                  v-model="condicao.aceite"
                  :label="condicao.texto"
                  size="large"
                  :class="cadastroTerms.condicoes.length > 1 ? 'break-text' : 'break-text-only'"
                />
              </el-form-item>
            </div>
            <div class="check-terms">
              <el-form-item prop="termos">
                <el-checkbox
                  v-model="termos.aceite"
                  label="Li e aceito os Termos de Uso e Política de Privacidade."
                  size="large"
                />
                <el-icon v-if="user.grupo != 'proprietario'" @click="$router.push('/terms')"
                  ><Connection
                /></el-icon>
                <el-icon v-else @click="$router.push('/terms-owner')"><Connection /></el-icon>
              </el-form-item>
            </div>
            <div class="term-btn">
              <div>
                <el-button type="primary" round @click="handleTerms()">Ok</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <el-drawer v-model="drawer" :with-header="false" class="drawer">
      <div class="download-pdf">
        <el-tooltip content="Download PDF" placement="left">
          <el-icon @click="generatePDF(op)"><Download /></el-icon>
        </el-tooltip>
      </div>
      <div class="drawer-details" ref="pdfContent">
        <div>
          <h6>Plantio</h6>
          <p>Início plantio: {{ op.inicio_plantio }}</p>
          <p>Fim plantio: {{ op.fim_plantio }}</p>
          <p>Início colheita: {{ op.inicio_colheita }}</p>
          <p>Fim colheita: {{ op.fim_colheita }}</p>
          <p>Estado: {{ op.estado.descricao }}</p>
          <p>Município: {{ op.municipio.descricao }}</p>
        </div>
        <div class="drawer-content">
          <h6>Sistema de produção Agrícola</h6>
          <p>Tipo Solo: {{ op.solo.descricao }}</p>
          <p>Irrigação: {{ op.irrigacao.descricao }}</p>
          <p>Tipo cultivo: {{ op.cultivo.descricao }}</p>
          <p>Grão/Semente: {{ op.grao_semente.descricao }}</p>
          <p>Ciclo do cultivar: {{ op.ciclo.descricao }}</p>
        </div>
        <div>
          <h6>Empreendimento</h6>
          <p>Cesta: {{ op.empreendimento.cesta }}</p>
          <p>Zoneamento: {{ op.empreendimento.zoneamento }}</p>
          <p>Variedade: {{ op.empreendimento.variedade }}</p>
          <p>Produto: {{ op.empreendimento.produto }}</p>
          <p>Modalidade: {{ op.empreendimento.modalidade }}</p>
          <p>Atividade: {{ op.empreendimento.atividade }}</p>
          <p>Finalidade: {{ op.empreendimento.finalidade }}</p>
        </div>
      </div>
      <div>
        <h6>Predição</h6>
        <div id="chartContainer" v-if="timeSeriesExist">
          <apexchart
            width="100%"
            type="line"
            :options="chartOptions"
            :series="chartSeries"
          ></apexchart>
        </div>
        <h5 v-else>Nenhuma série temporal</h5>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.location-content input {
  left: 34% !important;
  width: 300px;
  border-radius: 50px;
  height: 20px;
  padding: 8px 16px;
  border: 1px solid grey;
}

.download-pdf {
  display: flex;
  flex-direction: row-reverse;
  cursor: pointer;
}

.drawer p {
  font-size: 12px;
}

.drawer h6 {
  margin-bottom: 0;
}

.drawer-details {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  word-break: break-word;
  gap: 4px;
  justify-content: center;
}

.term-btn {
  display: flex;
  justify-content: flex-end;
  padding: 32px 0 0;
}

.drawer-content {
  border-left: 1px solid #282a2c;
  border-right: 1px solid #282a2c;
  padding: 0 16px;
  margin: 0 8px;
}

footer {
  background-color: #282a2c;
  color: #ffffff;
  font-weight: 200;
  display: flex;
  justify-content: center;
  padding: 4px 0;
  gap: 8px;
  position: fixed;
  width: 100vw;
}

footer img {
  width: 60px;
}

.map-filter {
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  row-gap: 24px;
  column-gap: 8px;
}

.location-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: end;
  padding: 8px 24px;
  align-items: center;
}

.location h6 {
  margin: 0;
  color: #9fa2a5;
}
.location h4 {
  margin: 0;
}

.usr-options {
  display: flex;
  gap: 16px;
  align-items: center;
}

.info-content {
  padding: 0 16px;
}

.upd-btn {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.del-user h4 {
  color: #ef5350;
  cursor: pointer;
  text-align: center;
  padding: 16px;
}

.custom-control {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  bottom: 16px;
  transform: translateY(-50%);
}

#zoom-in-control {
  right: 45%;
}

#zoom-out-control {
  left: 45%;
}

.check-terms {
  display: grid;
  align-items: center;
}

.check-terms .el-icon {
  color: #2898ff;
  cursor: pointer;
}
</style>

<style>
.location .el-icon {
  color: #ef5350;
}

.gmnoprint {
  display: none;
}

#search {
  width: 400px;
}

.user-modal .el-dialog__body {
  padding-top: 6px !important;
}

.user-modal .el-dialog {
  width: 450px;
}

.el-drawer.ltr,
.el-drawer.rtl {
  width: 45% !important;
}
</style>
