<template>
  <div>
    <div v-if="isDataEmpty" class="loader-container">
      <div class="loader"></div>
        <p>
        Chargement ...
      </p>
    </div>

    <!-- Grille hebdomadaire (desktop) -->
    <div v-if="!isDataEmpty" class="schedule-grid desktop-only">
      <div v-for="day in days" :key="day.key" class="day-column">
          <div class="day-header">{{ getDayAndDate(day)}}</div>
          <div class="courses-container">
            <DayCourseDisplay 
              :courseInDay="getCoursesForDay(day.key)" 
              :day="day"
              @open-course-info="$emit('open-course-info', $event)"
              @course-loaded="changeLoadingstatus()"
            />
          </div>
      </div>
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
    },
  },
  components: {
    DayCourseDisplay
  },
  data() {
    return {
      isLoading: true
    };
  },
  computed: {
    isDataEmpty() {
      return !this.organizedSchedules || Object.keys(this.organizedSchedules).length === 0;
    }
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

    changeLoadingstatus() {
      this.isLoading = false
    }

  }
};
</script>

<style src="../../assets/css/scheduleCommon.css"></style>