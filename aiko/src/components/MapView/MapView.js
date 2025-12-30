import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapView.css";
import { getTruckIcon } from "../../utils/mapIcons";

import L from "leaflet";

function MapView({ equipments, selectedEquipment, onMapClick }) {
  const markerRefs = useRef({});

  function MapController({ selectedEquipment }) {
    const map = useMap();

    useEffect(() => {
      if (selectedEquipment?.position) {
        map.setView(
          [selectedEquipment.position.lat, selectedEquipment.position.lon],
          13
        );
      }
    }, [selectedEquipment, map]);

    return null;
  }

  function MapClickHandler({ onMapClick }) {
    useMapEvents({
      click() {
        if (typeof onMapClick === "function") {
          onMapClick();
        }
      },
    });

    return null;
  }

  useEffect(() => {
    // Fecha todos os popups
    Object.values(markerRefs.current).forEach((marker) => {
      if (marker?.closePopup) {
        marker.closePopup();
      }
    });

    // Abre o popup do selecionado
    if (selectedEquipment) {
      const marker = markerRefs.current[selectedEquipment.id];
      if (marker?.openPopup) {
        marker.openPopup();
      }
    }
  }, [selectedEquipment]);

  return (
    <MapContainer center={[-19.126536, -45.947756]} zoom={10} className="map">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapController selectedEquipment={selectedEquipment} />
      <MapClickHandler onMapClick={onMapClick} />

      {equipments.map(
        (eq) =>
          eq.position && (
            <Marker
              key={eq.id}
              position={[eq.position.lat, eq.position.lon]}
              icon={getTruckIcon(
                eq.state?.color,
                selectedEquipment?.id === eq.id
              )}
              ref={(ref) => {
                if (ref) markerRefs.current[eq.id] = ref;
              }}
              zIndexOffset={selectedEquipment?.id === eq.id ? 1000 : 0}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                },
              }}
            >
              <Popup>
                <strong>{eq.name}</strong>
                <br />
                Estado:{" "}
                <span style={{ color: eq.state?.color }}>
                  {eq.state?.name || "Desconhecido"}
                </span>
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}

export default MapView;
