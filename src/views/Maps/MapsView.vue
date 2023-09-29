<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed } from 'vue'
import api from '@/services/api'
import { useRoute } from 'vue-router'

const user = ref({nome:""})
const token = ref()
const currPos = computed(() => ({
  lat: -14.235004,
  lng: -51.92528
}))
const otherPos = ref()
const latLngListener = ref()
const avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

onMounted(async () => {
  const route = useRoute()
  token.value = route.meta.token
  initMap()
  var res = await api.get("/auth", {
    headers: { Authorization: `Bearer ${token.value}` }
  })
  user.value = res.data
  console.log(user)
})

onUnmounted(async () => {
  if (latLngListener.value) latLngListener.value.remove()
})

function initMap(): void {
  const mapElement = document.getElementById('map')
  const input = document.getElementById('search') as HTMLInputElement
  const searchBox = new google.maps.places.SearchBox(input)
  let infoWindow: google.maps.InfoWindow

  function get_glebas(lat:number,long:number) {
    api
      .get(`gleba/location?lat=${lat}&long=${long}`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      .then((res) => {
        if (res.data.features.length > 0) {
          map.data.addGeoJson(res.data)
        }
      })
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
    };

    infoWindow = new google.maps.InfoWindow()

    map.data.setStyle(() => {
      return geoJsonStyle
    })

    latLngListener.value = map.addListener(
      'click',
      ({ latLng: { lat, lng } }) => {
        console.log("ok")
        get_glebas(lat(),lng())
      }
    )

    map.data.addListener('click', (event) => {
      const properties = event.feature.h;

      if (infoWindow) {
        infoWindow.close();
      }
      infoWindow = new google.maps.InfoWindow({
        content: `<div>loading...</div>`, // Customize the content as needed
      });
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
      api.get(`operacao/${properties.operacao_id}`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      .then((data)=>{
        if(data.status==200){
          if (infoWindow) {
            infoWindow.close();
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
            content: content,
          });
          infoWindow.setPosition(event.latLng);
          infoWindow.open(map);
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
  <div>
    <div class="location-container">
      <div class="location">
        
      </div>
      <div class="usr-options">
        <div v-if="otherPos">
          <h6>Latitude: {{ otherPos.lat.toFixed(2) }} Longitude: {{ otherPos.lng.toFixed(2) }}</h6>
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="40" :src="avatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>{{ user.nome }}</el-dropdown-item>
              <el-dropdown-item disabled>Ajuda</el-dropdown-item>
              <el-dropdown-item disabled>Configurações</el-dropdown-item>
              <el-dropdown-item @click="$router.push('/')">Sair</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="location-content">
      <input id="search" class="controls" type="text" placeholder="Pesquisar" />
      <div id="map" style="height: 86vh"></div>
    </div>
  </div>
  <footer>
    © 2023
    <img src="../../assets/logos/light_logo.svg" alt="" />
    - All rights reserved
  </footer>
</template>
<style scoped>
.location-content input {
  left: 24px !important;
  width: 300px;
  border-radius: 50px;
  height: 20px;
  padding: 8px 16px;
  border: 1px solid grey;
}
.image {
  width: 120px;
}
.map-view-container {
  display: grid;
  grid-template-columns: 1fr 5fr;
}

.loc-address {
  display: flex;
  align-items: center;
  gap: 16px;
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
  padding: 16px 24px;
  align-items: center;
}

.location h6 {
  margin: 0;
  color: #9fa2a5;
}
.location h4 {
  margin: 0;
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
  position: fixed !important;
  width: 420px;
}

/* .gm-style-iw.gm-style-iw-c {
  background-color: #ef5350;
}
.gm-style-iw.gm-style-iw-c .gm-style-iw-d{
  background-color: #ef5350;
  overflow: hidden !important;
}

.gm-style .gm-style-iw-tc::after {
  background-color: #ef5350;
}

.gm-style-iw-d {
  overflow: hidden;
} */
</style>
