import { useState } from "react";

import MapView from "../components/MapView/MapView.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import { loadData } from "../services/dataServices";
import {
  getLatestByDate,
  getCurrentState,
  filterHistoryByDate,
} from "../utils/equipmentUtils";

function Dashboard() {
  const { equipment, positionHistory, stateHistory, equipmentState } =
    loadData();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showHistory, setShowHistory] = useState(true);
  const [dateFilter, setDateFilter] = useState({
    start: "",
    end: "",
  });



  function handleSelectEquipment(eq) {
    setSelectedEquipment((current) => (current?.id === eq.id ? null : eq));
  }

  const equipmentStateMap = {};
  equipmentState.forEach((state) => {
    equipmentStateMap[state.id] = state;
  });

  // Monta os equipamentos com a última posição
const equipmentsWithPosition = equipment.map((eq) => {
  const positionsEntry = positionHistory.find((p) => p.equipmentId === eq.id);

  const positions = positionsEntry?.positions || [];

  const currentState = getCurrentState(eq.id, stateHistory, equipmentStateMap);

  return {
    ...eq,
    position: getLatestByDate(positions),
    state: currentState,
    history: positions,
  };
});

  const filteredEquipment =
    statusFilter === "ALL"
      ? equipmentsWithPosition
      : equipmentsWithPosition.filter((eq) => eq.state?.name === statusFilter);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        equipments={filteredEquipment}
        selectedEquipment={selectedEquipment}
        onSelect={handleSelectEquipment}
        statusFilter={statusFilter}
        onChangeFilter={setStatusFilter}
        showHistory={showHistory}
        onToggleHistory={setShowHistory}
      />

      <MapView
        equipments={filteredEquipment}
        selectedEquipment={selectedEquipment}
        onMapClick={() => setSelectedEquipment(null)}
        showHistory={showHistory}
      />
    </div>
  );
}

export default Dashboard;
