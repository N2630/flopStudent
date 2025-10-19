<template>
  <div class="schedule-container">
    <div class="week-navigation">
      <button @click="goToPreviousWeek">&#60;</button>
      <h2>Semaine {{ currentWeek }} - {{ currentYear }}</h2>
      <button @click="goToNextWeek">></button>
    </div>
    <p v-if="group_name_view === 'true'">Emplois du temps actuel: {{ group }} ({{ dept + ' ' + train_prog }})</p>
    <p v-if="schedulesLastUpdated">Dernière mise à jour : {{ formatDateTime(schedulesLastUpdated) }}</p>

    <div class="schedule-grid-container">
      <div class="schedule-grid">
        <div v-for="(courses, day) in organizedSchedules" :key="day" class="day-column">
          <h3>{{ getDayAndDate(day) }}</h3>
          <template v-for="time in timeSlots" :key="time">
            <div class="time-slot">
              <template v-for="course in [getCourseAtTime(courses, time)]" :key="course ? course.id : 'no-course'">
                <div v-if="course" class="course-item" :style="{ backgroundColor: course.display.color_bg, color: course.display.color_txt, fontWeight: course.course.is_graded ? 'bold' : 'normal' }">
                  <p>{{ course.course.name }}</p>
                  <p>{{ course.course.type + ' -  ' + course.room }}{{ course.prof ? ' - ' + course.prof : '' }}</p>
                  <p>{{ minutesToTime(course.start_time) +' à ' + minutesToTime(course.start_time+90)}}</p>
                </div>
                <div v-else class="empty-slot">&nbsp;</div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { fetchSchedules, fetchProfSchedules } from '../services/api';
import { organizeSchedules, getWeekNumber, getYearNumber } from '../services/scheduleService';
import { getLastSchedulesUpdate, getGroupNameView, getDept, getTrainProg, getGroup } from '../utils/storageUtils';
import { formatDateTime, minutesToTime, getDayName } from '../utils/dateUtils';

export default {
  props: {
    sourceType: {
      type: String,
      default: 'student'
    },
    profDet: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      schedules: [],
      organizedSchedules: {},
      timeSlots: [480, 570, 665, 755, 855, 945, 1040], 
      currentWeek: null,
      currentYear: null,
      initialDate: new Date(), 
      schedulesLastUpdated: getLastSchedulesUpdate() || null, 
      group_name_view: getGroupNameView() ? 'true' : 'false',
      dept: getDept() || '',
      train_prog: getTrainProg() || '',
      group: getGroup() || '',
    };
  },
  async created() {
    await this.initializeWeek();
    await this.loadSchedules();
  },
  methods: {
    formatDateTime,
    minutesToTime,
    
    /**
     * Calcule et met à jour l'année et le numéro de la semaine courante
     * à partir de la date initiale du composant.
     *
     * @returns {Promise<void>}
     */
    async initializeWeek() {
      this.currentYear = await getYearNumber(this.initialDate);
      this.currentWeek = await getWeekNumber(this.initialDate);
    },

    /**
     * Charge les emplois du temps pour la semaine et l'année courantes,
     * puis organise les données pour l'affichage.
     *
     * @returns {Promise<void>}
     */
    async loadSchedules() {
      try {
        const response = this.sourceType === 'prof' ? await fetchProfSchedules(this.currentYear, this.currentWeek, this.profDet) : await fetchSchedules(this.currentYear, this.currentWeek,);
        this.schedules = response; // Assigner les emplois du temps
        this.organizedSchedules = organizeSchedules(this.schedules);
      } catch (error) {
        console.error("Erreur lors du chargement des EDT:", error);
        this.schedules = [];
        this.organizedSchedules = {};
        this.schedulesLastUpdated = null;
      }
    },

    /**
     * Passe à la semaine précédente (en reculant de 7 jours la date initiale),
     * puis recharge les emplois du temps pour cette nouvelle semaine.
     *
     * @returns {Promise<void>}
     */
    async goToPreviousWeek() {
      let date = new Date(this.initialDate);
      date.setDate(date.getDate() - 7); // Reculer d'une semaine
      this.initialDate = date;
      await this.initializeWeek();
      await this.loadSchedules();
    },

    /**
     * Passe à la semaine suivante (en avançant de 7 jours la date initiale),
     * puis recharge les emplois du temps pour cette nouvelle semaine.
     *
     * @returns {Promise<void>}
     */
    async goToNextWeek() {
      let date = new Date(this.initialDate);
      date.setDate(date.getDate() + 7); // Avancer d'une semaine
      this.initialDate = date;
      await this.initializeWeek();
      await this.loadSchedules();
    },

    /**
     * Retourne le nom du jour (ex : "Lun.") à partir de la lettre du jour.
     *
     * @param {string} dayLetter - Lettre du jour ("m", "tu", "w", "th", "f")
     * @returns {string} - Exemple : "Lun."
     */
    getDayName(dayLetter) {
      return getDayName(dayLetter, true);
    },

    /**
     * Retourne le nom du jour (ex : "Lun.") suivi de la date correspondante (ex : "16/09")
     * pour un jour donné de la semaine courante affichée dans l'emploi du temps.
     *
     * @param {string} dayLetter - Lettre du jour ("m", "tu", "w", "th", "f")
     * @returns {string} - Exemple : "Lun. 16/09"
     */
    getDayAndDate(dayLetter) {
      const daysOfWeek = ["m", "tu", "w", "th", "f"];
      const dayIndex = daysOfWeek.indexOf(dayLetter);
      if (dayIndex === -1) return this.getDayName(dayLetter);
      let date = new Date(this.initialDate);
      // Trouver le début de la semaine (lundi) de initialDate
      const day = date.getDay(); 
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
      date.setDate(diff);
      // Ajouter le décalage pour le jour actuel de la semaine (0 pour Lun, 1 pour Mar...)
      date.setDate(date.getDate() + dayIndex);
      const dayNum = String(date.getDate()).padStart(2, '0');
      const monthNum = String(date.getMonth() + 1).padStart(2, '0'); // Mois est de 0 à 11
      return `${this.getDayName(dayLetter)} ${dayNum}/${monthNum}`;
    },

    /**
     * Retourne le cours qui commence à l'heure donnée dans la liste des cours d'un jour.
     *
     * @param {Array<Object>} courses - Liste des cours du jour
     * @param {number} time - Heure de début du créneau (en minutes depuis minuit)
     * @returns {Object|undefined} - Le cours correspondant ou undefined s'il n'y en a pas
     */
    getCourseAtTime(courses, time) {
      return courses.find(course => course.start_time === time);
    },
  }
};
</script>
<style src="../assets/css/ScheduleList.css"></style>
