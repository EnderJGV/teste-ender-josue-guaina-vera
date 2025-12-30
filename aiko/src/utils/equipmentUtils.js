//Entrega o ultimo item da lista baseado na data
export function getLatestByDate(list) {
  if (!list || list.length === 0) return null;

  return list.reduce((latest, current) =>
    new Date(current.date) > new Date(latest.date) ? current : latest
  );
}

//Entrega o estado atual do equipamento baseado no histórico de estados
export function getCurrentState(equipmentId, stateHistory, equipmentStateMap) {
  const history = stateHistory.find(
    (item) => item.equipmentId === equipmentId
  );

  if (!history || history.states.length === 0) return null;

  const lastState = history.states.at(-1);

  return equipmentStateMap[lastState.equipmentStateId] || null;
}


