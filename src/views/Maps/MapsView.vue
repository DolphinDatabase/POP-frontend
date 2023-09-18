<template>
  <div>
    <h4>Your position</h4>
    Latitude: {{ currPos.lat.toFixed(2) }} Longitude: {{ currPos.lng.toFixed(2) }}
    <input id="pac-input" class="controls" type="text" placeholder="Search Box" />
    <div v-if="otherPos">
      <h4>clicked position</h4>
      <span>Latitude: {{ otherPos.lat.toFixed(2) }} Longitude: {{ otherPos.lng.toFixed(2) }} </span>
    </div>
    <div id="map" style="height: 100vh"></div>
  </div>
</template>

<script setup lang="ts">
import useGeolocation from '@/services/useGeolocation'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const { coords } = useGeolocation()
const currPos = computed(() => ({
  lat: coords.value.latitude,
  lng: coords.value.longitude
}))
const otherPos = ref()
const clickListener = ref()
const addressInput = ref(null)
onMounted(async () => {
  initMap()
})

onUnmounted(async () => {
  if (clickListener.value) clickListener.value.remove()
})

function initMap(): void {
  const mapElement = document.getElementById('map')
  const input = document.getElementById('pac-input') as HTMLInputElement
  const searchBox = new google.maps.places.SearchBox(input)

  if (mapElement) {
    const map = new google.maps.Map(mapElement, {
      center: currPos.value,
      zoom: 8,
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
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds)
    })

    let markers: google.maps.Marker[] = []

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces()

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
<style scoped>
#pac-input {
  background-color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 400px;
}

#pac-input:focus {
  border-color: #4d90fe;
}
</style>
