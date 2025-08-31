<template>
  <div class="schedule-container">
    <div class="week-navigation">
      <button @click="goToPreviousWeek">&#60;</button>
      <h2>Semaine {{ currentWeek }} - {{ currentYear }}</h2>
      <button @click="goToNextWeek">></button>
    </div>
    <p v-if="schedulesLastUpdated">Dernière mise à jour : {{ formatDateTime(schedulesLastUpdated) }}</p>

    <div class="schedule-grid-container">
      <div class="schedule-grid">
        <div v-for="(courses, day) in organizedSchedules" :key="day" class="day-column">
          <h3>{{ getDayAndDate(day) }}</h3>
          <template v-for="time in timeSlots" :key="time">
            <div class="time-slot">
              <template v-for="course in [getCourseAtTime(courses, time)]" :key="course ? course.id : 'no-course'">
                <div v-if="course" class="course-item" :style="{ backgroundColor: course.display.color_bg, color: course.display.color_txt }">
                  <p>{{ course.course.name }}</p>
                  <p>{{ course.room }}{{ course.prof ? ' - ' + course.prof : '' }}</p>
                  <p>{{ minutesToTime(course.start_time) }}</p>
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
import { fetchSchedules } from '../services/api';
import { organizeSchedules, getWeekNumber, getYearNumber } from '../services/scheduleService';

export default {
  data() {
    return {
      schedules: [],
      organizedSchedules: {},
      timeSlots: [480, 570, 665, 755, 855, 945, 1040], 
      currentWeek: null,
      currentYear: null,
      initialDate: new Date(), 
      schedulesLastUpdated: JSON.parse(localStorage.getItem('lastSchedulesUpdate')) || null, // Nouvelle propriété pour stocker le timestamp
    };
  },
  async created() {
    await this.initializeWeek();
    await this.loadSchedules();
  },
  methods: {
    async initializeWeek() {
      this.currentYear = await getYearNumber(this.initialDate);
      this.currentWeek = await getWeekNumber(this.initialDate);
    },
    async loadSchedules() {
      try {
        const response = await fetchSchedules(this.currentYear, this.currentWeek); // Récupérer la réponse complète
        this.schedules = response; // Assigner les emplois du temps
        this.organizedSchedules = organizeSchedules(this.schedules);
      } catch (error) {
        console.error("Erreur lors du chargement des EDT:", error);
        this.schedules = [];
        this.organizedSchedules = {};
        this.schedulesLastUpdated = null;
      }
    },
    async goToPreviousWeek() {
      let date = new Date(this.initialDate);
      date.setDate(date.getDate() - 7); // Reculer d'une semaine
      this.initialDate = date;
      await this.initializeWeek();
      await this.loadSchedules();
    },
    async goToNextWeek() {
      let date = new Date(this.initialDate);
      date.setDate(date.getDate() + 7); // Avancer d'une semaine
      this.initialDate = date;
      await this.initializeWeek();
      await this.loadSchedules();
    },
    getDayName(dayLetter) {
      const days = {
        "m": "Lun.",
        "tu": "Mar.",
        "w": "Mer.",
        "th": "Jeu.",
        "f": "Ven."
      };
      return days[dayLetter] || "Jour inconnu";
    },
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

    getCourseAtTime(courses, time) {
      return courses.find(course => course.start_time === time);
    },

    // Nouvelle méthode pour formater la date et l'heure
    formatDateTime(timestamp) {
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
    },
    minutesToTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style src="../assets/css/scheduleList.css"></style>
