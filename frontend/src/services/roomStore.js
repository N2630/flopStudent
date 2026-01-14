let _rooms = [];

export function setRooms(list) {
  _rooms = Array.isArray(list) ? list : [];
}

export function getRooms() {
  return _rooms;
}

export function findRoomByName(name) {
  if (!name) return null;
  return _rooms.find(r => String(r.room).toLowerCase() === String(name).toLowerCase()) || null;
}

export default { setRooms, getRooms, findRoomByName };