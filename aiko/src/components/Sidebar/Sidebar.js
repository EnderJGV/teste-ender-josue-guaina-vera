import { useEffect, useRef } from "react";
import "./Sidebar.css";

function Sidebar({ equipments, selectedEquipment, onSelect, statusFilter, onChangeFilter, showHistory, onToggleHistory }) {

  const itemRefs = useRef({});

  useEffect(() => {
    if(selectedEquipment){
      const el = itemRefs.current[selectedEquipment.id];
      if(el){
        el.scrollIntoView({
          behavior: "smooth",
          block : "center",
        })
      }
    }
  }, [selectedEquipment]);

  return (
    <aside className="sidebar">
      <h3>Equipamentos</h3>

      <div className="filter">
        {["ALL", "Operando", "Parado", "Manutenção"].map((status) => (
          <button
            key={status}
            className={`filter-btn ${statusFilter === status ? "active" : ""}`}
            style={{
              "--status-color":
                status === "Operando"
                  ? "#2ecc71"
                  : status === "Parado"
                  ? "#f1c40f"
                  : status === "Manutenção"
                  ? "#e74c3c"
                  : "#3498db",
            }}
            onClick={() => onChangeFilter(status)}
          >
            {status === "ALL" ? "Todos" : status}
          </button>
        ))}
      </div>

      <div className="history-toggle">
        <label>
          <input
            type="checkbox"
            checked={showHistory}
            onChange={(e) => onToggleHistory(e.target.checked)}
          />
          Mostrar histórico
        </label>
      </div>

      <ul>
        {equipments.map((eq) => (
          <li
            key={eq.id}
            ref={(el) => (itemRefs.current[eq.id] = el)}
            className={`equipment-card ${
              selectedEquipment?.id === eq.id ? "active" : ""
            }`}
            style={{ "--status-color": eq.state?.color || "#ccc" }}
            onClick={() => onSelect(eq)}
          >
            <div className="equipment-name">{eq.name}</div>
            <div className="equipment-status">
              {eq.state?.name || "Desconhecido"}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
