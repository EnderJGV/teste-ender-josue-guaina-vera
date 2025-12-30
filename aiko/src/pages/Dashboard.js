import { useState } from "react";

import MapView from "../components/MapView/MapView.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import { loadData } from "../services/dataServices";
import { getLatestByDate, getCurrentState } from "../utils/equipmentUtils";

function Dashboard() {
  const { equipment, positionHistory, stateHistory, equipmentState } =
    loadData();
  const [selectedEquipment, setSelectedEquipment] = useState(null);

      function handleSelectEquipment(eq) {
        setSelectedEquipment((current) => (current?.id === eq.id ? null : eq));
      }

  const equipmentStateMap = {};
  equipmentState.forEach((state) => {
    equipmentStateMap[state.id] = state;
  });

  // Monta os equipamentos com a última posição
  const equipmentsWithPosition = equipment.map((eq) => {
    const positions =
      positionHistory.find((p) => p.equipmentId === eq.id)?.positions || [];

    const currentState = getCurrentState(
      eq.id,
      stateHistory,
      equipmentStateMap
    );


    return {
      ...eq,
      position: getLatestByDate(positions),
      state: currentState,
    };
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        equipments={equipmentsWithPosition}
        selectedEquipment={selectedEquipment}
        onSelect={handleSelectEquipment}
      />

      <MapView
        equipments={equipmentsWithPosition}
        selectedEquipment={selectedEquipment}
        onMapClick={() => setSelectedEquipment(null)}
      />
    </div>
  );
}

export default Dashboard;
