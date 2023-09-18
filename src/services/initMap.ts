import { computed, onUnmounted, ref } from 'vue'
import useGeolocation from './useGeolocation'

export function initMap(): void {
  const { coords } = useGeolocation()
  const currPos = computed(() => ({
    lat: coords.value.latitude,
    lng: coords.value.longitude
  }))
  const otherPos = ref()
  const clickListener = ref()
  const mapElement = document.getElementById('map')
  const input = document.getElementById('pac-input') as HTMLInputElement
  const searchBox = new google.maps.places.SearchBox(input)
  onUnmounted(async () => {
    if (clickListener.value) clickListener.value.remove()
  })
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
