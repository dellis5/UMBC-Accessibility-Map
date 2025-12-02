import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Radius in meters for how close a click must be to a location point to be selected
const CLICK_TOLERANCE_METERS = 30; 

function MapClickHandler({ 
  isSelectionMode, 
  locationToSet, 
  selectableLocations, 
  onLocationSelect, 
  onSelectionEnd 
}) {
  const map = useMapEvents({
    click(e) {
      if (!isSelectionMode) return;

      const clickedLatlng = e.latlng;
      let closestLocation = null;
      let minDistance = Infinity;

      // Find the closest valid location within the tolerance
      selectableLocations.forEach(loc => {
        if (loc.coords && loc.coords.length === 2) {
          const locLatlng = L.latLng(loc.coords[0], loc.coords[1]);
          const distance = clickedLatlng.distanceTo(locLatlng);

          if (distance <= CLICK_TOLERANCE_METERS && distance < minDistance) {
            minDistance = distance;
            closestLocation = loc;
          }
        }
      });

      if (closestLocation) {
        onLocationSelect(closestLocation, locationToSet);
        onSelectionEnd(closestLocation.name); 
      } else {
        alert("Click was too far from a selectable location. Try clicking closer to a building or floor node.");
        onSelectionEnd(null); 
      }
    },
    // Change cursor style when in selection mode
    mousemove: (e) => {
        if (map && map._container) {
            map._container.style.cursor = isSelectionMode ? 'crosshair' : 'grab';
        }
    }
  });

  return null;
}

export default MapClickHandler;