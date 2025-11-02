// Fonctions utilitaires de date et d'affichage horaire

/**
 * Formate un timestamp en une date et heure lisible en français.
 *
 * @param {string|number|Date} timestamp - Timestamp à formater
 * @returns {string} - Exemple : "16/09/2024, 08:00:00"
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Convertit un nombre de minutes en une chaîne au format "HH:MM".
 *
 * @param {number} minutes - Nombre de minutes depuis minuit
 * @returns {string} - Exemple : "08:00"
 */
export function minutesToTime(minutes) {
  if (minutes === null) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Retourne la lettre du jour correspondant à une date JS.
 *
 * @param {Date} date - Objet Date JS
 * @returns {string} - "m", "tu", "w", "th", "f" ou "N/A"
 */
export function getDayLetter(date) {
  const dayOfWeek = date.getDay(); // 0 pour Dimanche, 1 pour Lundi, ..., 6 pour Samedi
  const daysMap = {
    1: 'm',
    2: 'tu',
    3: 'w',
    4: 'th',
    5: 'f',
  };
  return daysMap[dayOfWeek] || 'N/A'; // Retourne N/A pour le weekend ou jour inconnu
}

/**
 * Retourne le nom du jour (ex : "Lundi" ou "Lun.") à partir de la lettre du jour.
 *
 * @param {string} dayLetter - Lettre du jour ("m", "tu", "w", "th", "f")
 * @param {boolean} [short=false] - true pour la version courte ("Lun."), false pour la version longue ("Lundi")
 * @returns {string}
 */
export function getDayName(dayLetter, short = false) {
  const days = short
    ? { m: 'Lun.', tu: 'Mar.', w: 'Mer.', th: 'Jeu.', f: 'Ven.' }
    : { m: 'Lundi', tu: 'Mardi', w: 'Mercredi', th: 'Jeudi', f: 'Vendredi' };
  return days[dayLetter] || (short ? 'Jour inconnu' : 'Jour inconnu');
}

/**
 * Retourne la date (jj/mm) du jour de la semaine correspondant à dayLetter,
 * en se basant sur la semaine courante (référence = aujourd'hui).
 *
 * Réutilise getDayLetter et formatDateTime pour éviter les duplications.
 *
 * @param {string} dayLetter - Lettre du jour ("m", "tu", "w", "th", "f")
 * @returns {string} - Exemple : "16/09" ou '' si non trouvé
 */
export function getDate(dayLetter) {
  if (!dayLetter) return '';

  const dayMap = { m: 1, tu: 2, w: 3, th: 4, f: 5 }; // 1 = lundi ...
  const targetDayIndex = dayMap[dayLetter];
  if (!targetDayIndex) return '';

  const now = new Date();
  const currentDay = now.getDay(); // 0 = dim, 1 = lun, ...
  const daysSinceMonday = (currentDay + 6) % 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - daysSinceMonday);

  const candidate = new Date(monday);
  candidate.setDate(monday.getDate() + (targetDayIndex - 1));

  // Vérification de cohérence via getDayLetter
  if (getDayLetter(candidate) !== dayLetter) return '';

  const full = formatDateTime(candidate); // ex: "16/09/2024, 00:00:00"
  const datePart = full.split(',')[0]; // "16/09/2024"
  const [dd, mm] = datePart.split('/');
  return `${dd}/${mm}`;
}