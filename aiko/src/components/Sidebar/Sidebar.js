import { useEffect, useRef } from "react";
import "./Sidebar.css";

function Sidebar({ equipments, selectedEquipment, onSelect }) {

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

      <ul>
        {equipments.map((eq) => (
          <li
            key={eq.id}
            ref={(el) => (itemRefs.current[eq.id] = el)}
            className={`equipment-card ${
              selectedEquipment?.id === eq.id ? "active" : ""
            }`}
            style={{ "--status-color": eq.state?.color || "#ccc"}}
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
