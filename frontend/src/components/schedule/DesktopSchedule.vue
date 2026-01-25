<template>
    <!-- Grille hebdomadaire (desktop) -->
    <div v-for="day in days" :key="day.key" class="day-column">
        <div class="day-header">{{ getDayAndDate(day)}}</div>
        <div class="courses-container">
          <DayCourseDisplay 
            :courseInDay="getCoursesForDay(day.key)" 
            :day="day"
            @open-course-info="$emit('open-course-info', $event)"
          />
        </div>
    </div>
</template>

<script>
import { getDate } from '../../utils/dateUtils';
import DayCourseDisplay from './DayCourseDisplay.vue';

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
    },
    initialDate: {
      // optional; parent can pass the reference date (Date or ISO string)
      type: [String, Object],
      required: false
    }
  },
  components: {
    DayCourseDisplay
  },
  data() {
    return {};
  },
  methods: {
    getDayAndDate(day) {
      // If parent provides an initialDate prop, use it as reference (week selection)
      const ref = this.initialDate || undefined;
      return `${day.name} ${getDate(day.key, ref)}`;
    },
    getCoursesForDay(dayKey) {
      console.log(this.organizedSchedules[dayKey])
      return this.organizedSchedules[dayKey];
    },

  }
};
</script>

<style src="../../assets/css/scheduleCommon.css"></style>