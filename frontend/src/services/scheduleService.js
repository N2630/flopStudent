// services/scheduleService.js

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

export async function getWeekNumber(dateToGetWeek) {
    const date = dateToGetWeek ? new Date(dateToGetWeek) : new Date();
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week = new Date(date.getFullYear(), 0,4);
    return ('0' + (1 + Math.round(((date.getTime() - week.getTime()) / 86400000 - 3 + (week.getDay() + 6) % 7) / 7))).slice(-2);

}
  
export async function getYearNumber(date) {
    return date.getFullYear(); // retourne l'année
}