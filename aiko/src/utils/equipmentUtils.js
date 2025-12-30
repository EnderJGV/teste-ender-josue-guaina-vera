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

export function filterHistoryByDate(history, start, end) {
  if (!start && !end) return history;

  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  return history.filter((pos) => {
    const current = new Date(pos.date);

    if (startDate && current < startDate) return false;
    if (endDate && current > endDate) return false;

    return true;
  });
}
