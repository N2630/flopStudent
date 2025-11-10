<template>
  <!-- Navigation jour (mobile) -->
  <div class="day-navigation mobile-only">
    <button 
      v-for="(day, i) in days" 
      :key="day.key" 
      class="day-tab" 
      :class="{ active: currentDayIndex === i }"
      @click="$emit('update:currentDayIndex', i)">
      {{ day.name.substring(0,3) }}
    </button>
    
  </div>

  <!-- Liste des cours (mobile) -->
  <div class="courses-list mobile-only">
    <div class="day-header">{{ getDayAndDate(currentDayKey)}}</div>
    <template v-for="(course, idx) in getCoursesForCurrentDay()" :key="course.id">
      <!-- Insérer un bloc repas si écart >= 60min et chevauche la plage déjeuner -->
      <div v-if="shouldInsertLunch(currentDayKey, idx)" class="lunch-card">Repas</div>

      <CourseCard :course="course" />
    </template>
  </div>
</template>

<script>
import { getDate } from '../../utils/dateUtils';
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
    ,
    initialDate: {
      type: [String, Object],
      required: false
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

    getDayAndDate(dayKey) {
      const day = this.days.find(d => d.key === dayKey);
      if (!day) return '';
      const ref = this.initialDate || undefined;
      return `${day.name} ${getDate(day.key, ref)}`;
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

<style src="../../assets/css/scheduleCommon.css"></style>

<style scoped>
/* mobile-only display helper is centralized in src/assets/css/main.css */

/* Tabs jours (mobile) */
.day-navigation.mobile-only {
  gap: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  background: var(--color-bg-panel);
  border-radius: 12px;
  box-shadow: var(--default-shadow);
  padding: 12px 20px;
}

.day-tab {
  background: var(--color-primary);
  border: 1px solid var(--default-border-color);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-default);
}

.day-tab.active {
  background: var(--mobile-dayBtn-bg);
  color: var(--mobile-dayBtn-color);
  border-color: var(--mobile-dayBtn-border);
  font-weight: 600;
}

/* Liste des cours (mobile) */
.courses-list {
  flex-direction: column;
  background: var(--color-primary);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--default-shadow);
  flex: 1 1 0;
  margin-bottom: 20px;
}

.courses-list .course-card {
  border-top: none;
  margin-bottom: 10px;
}

/* mobile-only display helper is centralized in src/assets/css/main.css */
</style>
