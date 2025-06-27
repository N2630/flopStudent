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


  
/*  
const getDayInitials = (date) => {
    const days = [
        { ref: "m", name: "Lun." }, // lundi
        { ref: "tu", name: "Mar." }, // mardi
        { ref: "w", name: "Mer." }, // mercredi
        { ref: "th", name: "Jeu." }, // jeudi
        { ref: "f", name: "Ven." }, // vendredi
        { ref: "s", name: "Sam." }, // samedi
        { ref: "su", name: "Dim." } // dimanche
    ];

    const daysToReturn = days[date.getDay() - 1]
    //console.log(daysToReturn)
    return daysToReturn; // `getDay()` renvoie un numéro de 0 (dimanche) à 6 (samedi)

}
*/
export async function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
  
export async function getYearNumber(date) {
    return date.getFullYear(); // retourne l'année
}

/*
function getCurrentTimeInMinutes() {
    const now = new Date(); // Obtenir la date et l'heure actuelles
    const hours = now.getHours(); // Obtenir les heures (0-23)
    const minutes = now.getMinutes(); // Obtenir les minutes (0-59)

    return hours * 60 + minutes; // Convertir en minutes depuis minuit
}

function getMin(coursTime, curruentTime){
    let min = 1030

    for (const cour of coursTime) {
        if(cour.minTime < curruentTime ){
            min = cour
        }
    }
    return min
}

/*export async function getFreeRoom(date) {
    const weekNumber = await getWeekNumber(date);
    const yearNumber = await getYearNumber(date);
    const response = await axios.get(
        `https://flopedt.iut-blagnac.fr/fr/api/fetch/scheduledcourses/?week=${weekNumber}&year=${yearNumber}&dept=INFO`
    );

    const dayInitial = getDayInitials(date);

    const rooms = [
        { ref: "24", id: 24, name: "B101" },
        { ref: "25", id: 25, name: "B102" },
        { ref: "26", id: 26, name: "B103" },
        { ref: "27", id: 27, name: "B104" },
        { ref: "28", id: 28, name: "B105" },
        { ref: "29", id: 29, name: "B106" },
        { ref: "30", id: 30, name: "B004" },
        { ref: "32", id: 32, name: "B007" },
        { ref: "33", id: 33, name: "B008" },
        { ref: "34", id: 34, name: "B009" },
        { ref: "37", id: 37, name: "B219" },
 
    ];

    const coursTime = [
        { id: 1, heure: "8h00", minTime: 480 },
        { id: 2, heure: "9h30", minTime: 570 },
        { id: 3, heure: "11h05", minTime: 665 },
        { id: 4, heure: "14h15", minTime: 855 },
        { id: 5, heure: "15h45", minTime: 945 },
        { id: 6, heure: "17h10", minTime: 1030 },

    ];

    const curruentTime = getCurrentTimeInMinutes();

    // Trouver le cours en cours et le prochain
    const currentCours = getMin(coursTime, curruentTime)
    const nextCours = coursTime.find(cours => cours.minTime >= curruentTime);


    let timeToFocus = 0;

    if (nextCours && (nextCours.minTime - curruentTime) > 15) {
        timeToFocus = currentCours.minTime;
        
    } else if (nextCours) {
        timeToFocus = nextCours.minTime;
    } else {
        return
    }

    let freeRoom = [];

    for (const room of rooms) {
        // Vérifie si la salle est utilisée dans les données de l'API
        const isOccupied = response.data.some(
            (course) => course.room && course.room.id === room.id && course.start_time === timeToFocus && course.day === dayInitial.ref
        );

        if (!isOccupied) {
            freeRoom.push(room.name);
        }
    }

    /*if (freeRoom.length === 0) {
        console.log("Aucune salle libre trouvée.");
    } else {
        console.log("Salles libres : ", freeRoom);
    }*/
    
//    return freeRoom;
//}