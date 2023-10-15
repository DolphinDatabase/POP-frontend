<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed } from 'vue'
import api from '@/services/api'
import { useRoute } from 'vue-router'
import { MensagemErro, MensagemSucesso } from '@/components/Notificacao'
import router from '@/router'
import OnBoard from '@/components/OnBoard/OnBoard.vue'

const user = ref({ id: 0, nome: '', doc: '', email: '', proprietario: false })
const savedInfo = ref({ id: 0, nome: '', doc: '', email: '', proprietario: false })
const token = ref()
const currPos = computed(() => ({
  lat: -14.235004,
  lng: -51.92528
}))
const otherPos = ref()
const latLngListener = ref()
const avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const userInfo = ref(false)
const continueLoad = ref(false)
const onBoardState = ref(true)

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

function fecharOnBoard() {
  onBoardState.value = false
}

function deleteUser(id: number) {
  api
    .delete(`usuario/${id}`)
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

function updateUser(id: number) {
  api
    .put(`usuario/${id}`, {
      nome: user.value.nome,
      doc: user.value.doc,
      email: user.value.email
    })
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
    })
}

function openTermsInNewTab() {
  window.open('/terms', '_blank')
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
  let infoWindow: google.maps.InfoWindow
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
      strokeWeight: 2
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

    infoWindow = new google.maps.InfoWindow()

    map.data.setStyle(() => {
      return geoJsonStyle
    })

    map.data.addListener('click', (event) => {
      const properties = event.feature.h

      if (infoWindow) {
        infoWindow.close()
      }
      infoWindow = new google.maps.InfoWindow({
        content: `<div>loading...</div>`
      })
      infoWindow.setPosition(event.latLng)
      infoWindow.open(map)
      api
        .get(`operacao/${properties.operacao_id}`, {
          headers: { Authorization: `Bearer ${token.value}` }
        })
        .then((data) => {
          if (data.status == 200) {
            if (infoWindow) {
              infoWindow.close()
            }
            let op = data.data
            let content = `<div style='display:grid;grid-template-columns: 1fr 1fr;gap:15px'>`
            content += `<div>`
            content += `<p><b>Início plantio:</b> ${op.inicio_plantio}</br>`
            content += `<b>Fim plantio:</b> ${op.fim_plantio}</br>`
            content += `<b>Início colheita:</b> ${op.inicio_colheita}</br>`
            content += `<b>Fim colheita:</b> ${op.fim_colheita}</br>`
            content += `<b>Estado:</b> ${op.estado.descricao}</br>`
            content += `<b>Município:</b> ${op.municipio.descricao}</br>`
            content += `</br><b>Sistema de produção Agrícola:</b></br>`
            content += `<b>Tipo Solo:</b> ${op.solo.descricao}</br>`
            content += `<b>Irrigação:</b> ${op.irrigacao.descricao}</br>`
            content += `<b>Tipo cultivo:</b> ${op.cultivo.descricao}</br>`
            content += `<b>Grão/Semente:</b> ${op.grao_semente.descricao}</br>`
            content += `<b>Ciclo do cultivar:</b> ${op.ciclo.descricao}</p>`
            content += `</div>`
            content += `<div>`
            content += `<p><b>Empreendimento:</b></br>`
            content += `<b>Cesta: </b>${op.empreendimento.cesta}</br>`
            content += `<b>Zoneamento: </b>${op.empreendimento.zoneamento}</br>`
            content += `<b>Variedade: </b>${op.empreendimento.variedade}</br>`
            content += `<b>Produto: </b>${op.empreendimento.produto}</br>`
            content += `<b>Modalidade: </b>${op.empreendimento.modalidade}</br>`
            content += `<b>Atividade: </b>${op.empreendimento.atividade}</br>`
            content += `<b>Finalidade: </b>${op.empreendimento.finalidade}</p>`
            content += `</div>`
            content += `</div>`
            infoWindow = new google.maps.InfoWindow({
              content: content
            })
            infoWindow.setPosition(event.latLng)
            infoWindow.open(map)
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
      })
      map.fitBounds(bounds)
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
          <div v-if="otherPos">
            <h6>
              Latitude: {{ otherPos.lat.toFixed(2) }} Longitude: {{ otherPos.lng.toFixed(2) }}
            </h6>
          </div>
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
                  <el-dropdown-item @click="openTermsInNewTab" target="_blank"
                    ><el-icon><Management /></el-icon>Termos e condições<el-icon
                      ><TopRight /></el-icon
                  ></el-dropdown-item>
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
              <div v-if="user.proprietario">
                <p>CPF</p>
                <el-form-item>
                  <el-input v-model="user.doc" disabled />
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="del-user" @click="deleteUser(user.id)">
            <h4>Excluir conta</h4>
          </div>
          <div class="upd-btn">
            <div>
              <el-button round @click="cancelUpdate">Cancelar</el-button>
            </div>
            <div>
              <el-button type="primary" round @click="updateUser(user.id)">Salvar</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
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
.image {
  width: 120px;
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
</style>
