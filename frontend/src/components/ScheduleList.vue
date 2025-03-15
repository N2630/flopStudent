<template>
  <div class="schedule-grid">
    <div v-for="(courses, day) in organizedSchedules" :key="day" class="day-column">
      <h3>{{ getDayName(day) }}</h3>
      <div class="time-slot" v-for="time in timeSlots" :key="time">
        <div v-if="getCourseAtTime(courses, time)" class="course-item">
          <p>{{ getCourseAtTime(courses, time).course.name }}</p>
          <p>{{ getCourseAtTime(courses, time).room }}</p>
          <p>{{ minutesToTime(getCourseAtTime(courses, time).start_time) }}</p>
        </div>
        <div v-else class="empty-slot"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchSchedules } from '../services/api';
import { organizeSchedules} from '../services/scheduleService';

export default {
  data() {
    return {
      schedules: [],
      organizedSchedules: {},
      timeSlots: [480, 570, 665, 855, 945, 1030] // Exemple de créneaux horaires en minutes
    };
  },
  async created() {
    this.schedules = await fetchSchedules();
    this.organizedSchedules = organizeSchedules(this.schedules);
  },
  methods: {
    getDayName(day) {
      const days = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
      return days[day];
    },
    getCourseAtTime(courses, time) {
      return courses.find(course => course.start_time === time);
    },
    minutesToTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 colonnes pour les jours de la semaine */
  gap: 10px;
}

.day-column {
  border: 1px solid #ccc;
  padding: 10px;
}

.time-slot {
  border-bottom: 1px solid #ddd;
}

.course-item {
  border: 1px solid #ddd;
  padding: 5px;
  margin: 5px 0;
}

.empty-slot {
  height: 20px; /* Ajustez la hauteur pour représenter un créneau vide */
}
</style>
