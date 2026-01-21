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
    <DayCourseDisplay :courseInDay="getCoursesForDay(currentDayKey)" :dayKey="currentDayKey"/>
  </div>
</template>

<script>
import { getDate } from '../../utils/dateUtils';
import DayCourseDisplay from './DayCourseDisplay.vue';

export default {
  name: 'MobileSchedule',
  components: {
    DayCourseDisplay
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
    },
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
    shouldInsertLunch(dayKey, courseIndex) {
      const courses = this.getCoursesForDay(dayKey);
      if (courseIndex === 0) return false;
      const prev = courses[courseIndex - 1];
      const curr = courses[courseIndex];
      if (!prev || !curr) return false;
      const prevEnd = prev.start_time + 90;
      const gap = curr.start_time - prevEnd;
      if (gap < 60) return false;
      const lunchStart = 11 * 60 + 30; // 11:30
      const lunchEnd = 14 * 60 + 30;   // 14:30
      // Le créneau de pause [prevEnd, curr.start] chevauche la plage déjeuner ?
      const overlap = Math.max(0, Math.min(curr.start_time, lunchEnd) - Math.max(prevEnd, lunchStart));
      return overlap >= 30; // au moins 30min dans la plage déjeuner
    },

    shouldInsertBlank(dayKey, courseIndex) {
      const courses = this.getCoursesForDay(dayKey);

      if (courseIndex === 0 ) {
        return courses[courseIndex].start_time > 480;

      }
      
      if (courses[courseIndex+1] === undefined ) {
         return false

      } else if (this.getGapBetweenCourses(courses[courseIndex+1], courses[courseIndex]) >= 15 && this.shouldInsertLunch(dayKey,courseIndex)) {
        return true

      }

      return false;
    },

    getGapBetweenCourses(course1, course2) {
      return course1.start_time - (course2.start_time + course2.duration)
    },

    getBlankDuration(dayKey, courseIndex) {
      const courses = this.getCoursesForDay(dayKey);
      const curr = courses[courseIndex];

      // Cas 1 : Vide avant le premier cours de la journée
      if (courseIndex === 0) {
        const startOfDay = 480; // 08:00 en minutes
        return curr.start_time - startOfDay;
      }

      // Cas 2 : Vide entre le cours précédent et l'actuel
      const prev = courses[courseIndex - 1];
      if (prev) {
        const prevEnd = prev.start_time + (prev.duration || 90);
        return curr.start_time - prevEnd;
      }

      return 0;
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
  background: var(--color-primary);
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
  background: var(--color-bg-panel);
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

.blank-card {
  height: calc(var(--duree) * 1.2px);
}
/* mobile-only display helper is centralized in src/assets/css/main.css */
</style>
