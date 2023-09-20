<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed } from 'vue'
import beatriz from '@/assets/team/beatriz.jpg'

const placeDetail = ref()
const currPos = computed(() => ({
  lat: -14.235004,
  lng: -51.92528
}))
const otherPos = ref()
const clickListener = ref()
onMounted(async () => {
  initMap()
})

onUnmounted(async () => {
  if (clickListener.value) clickListener.value.remove()
})

function initMap(): void {
  const mapElement = document.getElementById('map')
  const input = document.getElementById('search') as HTMLInputElement
  const searchBox = new google.maps.places.SearchBox(input)

  if (mapElement) {
    const map = new google.maps.Map(mapElement, {
      center: currPos.value,
      zoom: 5,
      mapTypeId: 'hybrid'
    })
    map.data.setStyle((feature) => {
      return {
        title: feature.getProperty('name'),
        optimized: false
      }
    })
    clickListener.value = map.addListener(
      'click',
      ({ latLng: { lat, lng } }) => (otherPos.value = { lat: lat(), lng: lng() })
    )
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(input)

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds)
    })

    let markers: google.maps.Marker[] = []

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces()

      places.forEach((p) => {
        placeDetail.value = p.formatted_address
      })

      if (places.length == 0) {
        return
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null)
      })
      markers = []

      // For each place, get the icon, name and location.
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

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location
          })
        )

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
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
        <div class="loc-address">
          <el-icon><LocationFilled /></el-icon>
          <h4>{{ placeDetail }}</h4>
        </div>
        <div v-if="otherPos">
          <h6>Latitude: {{ otherPos.lat.toFixed(2) }} Longitude: {{ otherPos.lng.toFixed(2) }}</h6>
        </div>
      </div>
      <div class="usr-options">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="40" :src="beatriz" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>Beatriz Medeiros</el-dropdown-item>
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
</style>
