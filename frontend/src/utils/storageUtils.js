// Utilitaires pour accéder à localStorage concernant les paramètres utilisateur

export function getDept() {
  return localStorage.getItem('dept');
}

export function getTrainProg() {
  return localStorage.getItem('train_prog');
}

export function getGroup() {
  return localStorage.getItem('group');
}

export function setDept(value) {
  localStorage.setItem('dept', value);
}

export function setTrainProg(value) {
  localStorage.setItem('train_prog', value);
}

export function setGroup(value) {
  localStorage.setItem('group', value);
}

export function getGroupNameView() {
  return localStorage.getItem('group_name_view') === 'true';
}

export function setGroupNameView(value) {
  localStorage.setItem('group_name_view', value);
}

export function getLastSchedulesUpdate() {
  const val = localStorage.getItem('lastSchedulesUpdate');
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

export function setLastSchedulesUpdate(value) {
  localStorage.setItem('lastSchedulesUpdate', JSON.stringify(value));
}

export function getSchedule() {
  const val = localStorage.getItem('schedule');
  try {
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function setSchedule(value) {
  localStorage.setItem('schedule', JSON.stringify(value));
}

export function addFollowedSchedule(grpFollowSchedule) {
  const followedSchedules = getFollowedSchedules() || [];
  const lastInsertedId = followedSchedules.length > 0 
    ? followedSchedules[followedSchedules.length - 1].id 
    : 0;
  grpFollowSchedule.id = lastInsertedId + 1;
  followedSchedules.push(grpFollowSchedule);
  localStorage.setItem('followedSchedules', JSON.stringify(followedSchedules));
}

export function getFollowedSchedules() {
  const val = localStorage.getItem('followedSchedules');
  try {
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function removeFollowedSchedule(id) {
  let followedSchedules = getFollowedSchedules() || [];
  followedSchedules = followedSchedules.filter(schedule => schedule.id !== id);
  
  // Réindexer les IDs après suppression
  followedSchedules.forEach(grp => {
    if (grp.id > id) {
      grp.id = grp.id - 1;
    }
  });
  
  localStorage.setItem('followedSchedules', JSON.stringify(followedSchedules));
}