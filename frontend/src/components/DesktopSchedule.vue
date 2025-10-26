<template>
    <!-- Grille hebdomadaire (desktop) -->
    <div v-for="day in days" :key="day.key" class="day-column">
        <div class="day-header">{{ getDayAndDate(day)}}</div>
        <div class="courses-container">
          <template v-for="(course, idx) in getCoursesForDay(day.key)" :key="course.id">
            <!-- Insérer un bloc repas si écart >= 60min avec le précédent et si créneau chevauche midi -->
            <div v-if="shouldInsertLunch(day.key, idx)" class="lunch-card">Repas</div>

            <CourseCard :course="course" />
          </template>
        </div>
    </div>
</template>

<script>
import { getDate } from '../utils/dateUtils';
import CourseCard from './CourseCard.vue';

export default {
  name: 'DesktopSchedule',
  props: {
    organizedSchedules: {
      type: Object,
      required: true
    },
    days: {
      type: Array,
      required: true
    }
  },
  components: {
    CourseCard
  },
  data() {
    return {};
  },
  methods: {
    getCoursesForDay(dayKey) {
      return this.organizedSchedules[dayKey] || [];
    },

    getDayAndDate(day) {
      return `${day.name} ${getDate(day.key)}`;
    },

    /**
     * Décide si on insère un bloc repas avant le cours à l'index donné.
     * Règle: il existe un cours précédent et l'écart entre la fin de ce précédent
     * et le début du cours courant est >= 60 min et recouvre la tranche 11:30-14:30.
     */
    shouldInsertLunch(dayKey, idx) {
      const courses = this.getCoursesForDay(dayKey);
      if (idx === 0) return false;
      const prev = courses[idx - 1];
      const curr = courses[idx];
      if (!prev || !curr) return false;
      const prevEnd = prev.start_time + 90;
      const gap = curr.start_time - prevEnd;
      if (gap < 60) return false;
      const lunchStart = 11 * 60 + 30; // 11:30
      const lunchEnd = 14 * 60 + 30;   // 14:30
      // Le créneau de pause [prevEnd, curr.start] chevauche la plage déjeuner ?
      const overlap = Math.max(0, Math.min(curr.start_time, lunchEnd) - Math.max(prevEnd, lunchStart));
      return overlap >= 30; // au moins 30min dans la plage déjeuner
    }
  }
};
</script>

<style src="../assets/css/scheduleCommon.css"></style>

<style scoped>
/* desktop-only helper is centralized in src/assets/css/main.css */
</style>