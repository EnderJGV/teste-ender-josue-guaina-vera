import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "./MapView.css";
import { getTruckIcon } from "../../utils/mapIcons";
import MapLegend from "../MapLegend/MapLegend";

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

function MapView({ equipments, selectedEquipment, onMapClick, showHistory }) {
  const markerRefs = useRef({});

  // Abre / fecha popup automaticamente
  useEffect(() => {
    Object.values(markerRefs.current).forEach((marker) => {
      marker?.closePopup?.();
    });

    if (selectedEquipment) {
      markerRefs.current[selectedEquipment.id]?.openPopup?.();
    }
  }, [selectedEquipment]);

  return (
    <MapContainer center={[-19.126536, -45.947756]} zoom={10} className="map">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Centraliza no equipamento selecionado */}
      <MapController selectedEquipment={selectedEquipment} />

      {/* Clique no mapa limpa seleção */}
      <MapClickHandler onMapClick={onMapClick} />

      {/* HISTÓRICO (Polyline) — CONTROLADO PELO TOGGLE */}
      {showHistory && selectedEquipment?.history?.length > 1 && (
        <Polyline
          positions={selectedEquipment.history.map((pos) => [pos.lat, pos.lon])}
          pathOptions={{
            color: selectedEquipment.state?.color || "#3498db",
            weight: 4,
            opacity: 0.8,
          }}
        />
      )}

      {/* MARKERS — SEMPRE VISÍVEIS */}
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

      {/* LEGENDA */}
      <MapLegend />
    </MapContainer>
  );
}

export default MapView;
