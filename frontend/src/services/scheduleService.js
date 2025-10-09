/**
 * Organise un tableau de cours par jour de la semaine.
 *
 * @param {Array<Object>} schedules - Liste des cours à organiser.
 *   Chaque cours doit avoir une propriété `date.day` ("m", "tu", "w", "th", "f")
 *   et une propriété `start_time` (en minutes depuis minuit).
 * @returns {Object} - Un objet avec les jours de la semaine comme clés et les cours triés par heure de début.
 *   Exemple : { m: [cours1, ...], tu: [...], w: [...], th: [...], f: [...] }
 */
export const organizeSchedules = (schedules) => {
    // Initialiser l'objet avec tous les jours de la semaine
    const organized = {
        m: [], // Lundi
        tu: [], // Mardi
        w: [], // Mercredi
        th: [], // Jeudi
        f: [] // Vendredi
    };

    if (!Array.isArray(schedules)) {
        console.error("organizeSchedules a reçu des données qui ne sont pas un tableau :", schedules);
        return organized; // Retourne un objet vide ou l'objet initialisé
    }

    schedules.forEach(course => {
        const day = course.date.day;
        if (organized[day] !== undefined) {
            organized[day].push(course);
        }
    });

    // Trier les cours par heure de début pour chaque jour
    for (const day in organized) {
        organized[day].sort((a, b) => a.start_time - b.start_time);
    }

    return organized;
};

/**
 * Calcule le numéro de la semaine (ISO) pour une date donnée.
 *
 * @param {Date|string|number} [dateToGetWeek] - Date à utiliser (par défaut : aujourd'hui).
 * @returns {Promise<string>} - Numéro de la semaine sur 2 chiffres (ex : "03", "17").
 */
export async function getWeekNumber(dateToGetWeek) {
    const date = dateToGetWeek ? new Date(dateToGetWeek) : new Date();
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week = new Date(date.getFullYear(), 0,4);
    return ('0' + (1 + Math.round(((date.getTime() - week.getTime()) / 86400000 - 3 + (week.getDay() + 6) % 7) / 7))).slice(-2);

}
  
/**
 * Retourne l'année (sur 4 chiffres) pour une date donnée.
 *
 * @param {Date} date - Date à utiliser.
 * @returns {Promise<number>} - Année (ex : 2024)
 */
export async function getYearNumber(date) {
    return date.getFullYear(); // retourne l'année
}