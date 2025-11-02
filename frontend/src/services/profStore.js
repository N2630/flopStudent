let _profs = [];

export function setProfs(list) {
  _profs = Array.isArray(list) ? list : [];
}

export function getProfs() {
  return _profs;
}

export function findProfByUsername(username) {
  if (!username) return null;
  return _profs.find(p => String(p.username).toLowerCase() === String(username).toLowerCase()) || null;
}

export default { setProfs, getProfs, findProfByUsername };
