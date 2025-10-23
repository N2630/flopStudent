<template>
  <!-- Navigation jour (mobile) -->
  <div class="day-navigation mobile-only">
    <button 
      v-for="(d, i) in days" 
      :key="d.key" 
      class="day-tab" 
      :class="{ active: currentDayIndex === i }"
      @click="$emit('update:currentDayIndex', i)">
      {{ d.name.substring(0,3) }}
    </button>
  </div>

  <!-- Liste des cours (mobile) -->
  <div class="courses-list mobile-only">
    <template v-for="(course, idx) in getCoursesForCurrentDay()" :key="course.id">
      <!-- Insérer un bloc repas si écart >= 60min et chevauche la plage déjeuner -->
      <div v-if="shouldInsertLunch(currentDayKey, idx)" class="lunch-card">Repas</div>

      <CourseCard :course="course" />
    </template>
  </div>
</template>

<script>
import CourseCard from './CourseCard.vue';

export default {
  name: 'MobileSchedule',
  components: {
    CourseCard
  },
  props: {
    organizedSchedules: {
      type: Object,
      required: true
    },
    days: {
      type: Array,
      required: true
    },
    currentDayIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    currentDayKey() {
      return this.days[this.currentDayIndex]?.key || 'm';
    }
  },
  methods: {
    getCoursesForDay(dayKey) {
      return this.organizedSchedules[dayKey] || [];
    },

    getCoursesForCurrentDay() {
      return this.getCoursesForDay(this.currentDayKey);
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
/* Responsive - Caché par défaut sur desktop */
.mobile-only {
  display: none !important;
}

/* Tabs jours (mobile) */
.day-navigation.mobile-only {
  gap: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
}

.day-tab {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.day-tab.active {
  background: #e3f2fd;
  color: #1976d2;
  border-color: #bbdefb;
  font-weight: 600;
}

/* Liste des cours (mobile) */
.courses-list {
  flex-direction: column;
  background: rgb(255, 255, 255);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1 1 0;
  margin-bottom: 20px;
}

.courses-list .course-card {
  border-top: none;
  margin-bottom: 10px;
  border-left: 4px solid #ddd;
}

/* Afficher sur mobile */
@media (max-width: 768px) {
  .mobile-only {
    display: flex !important;
  }
}
</style>
