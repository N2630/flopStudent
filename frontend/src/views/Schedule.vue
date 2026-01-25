<template>
  <div class="schedule-page">
    <!-- Navigation semaine -->
    <div class="week-navigation">
      <button @click="goToPreviousWeek" class="nav-button">‹</button>
      <span class="week-text">Semaine {{ currentWeek }} - {{ currentYear }} </span>
      <button @click="goToNextWeek" class="nav-button">›</button>
    </div>

    <!-- Grille hebdomadaire (desktop) -->
    <div class="schedule-grid desktop-only">
      <DesktopSchedule 
        :organizedSchedules="organizedSchedules" 
        :days="days"
        :initialDate="initialDate"
        @open-course-info="selectedCourse = $event"
      />
    </div>

    <!-- Vue mobile -->
    <MobileSchedule 
      :organizedSchedules="organizedSchedules" 
      :days="days"
      :currentDayIndex="currentDayIndex"
      @update:currentDayIndex="currentDayIndex = $event"
      :initialDate="initialDate"
      @open-course-info="selectedCourse = $event"
    />

    <!-- Salles libres -->
    <FreeRoomsList />

    <CourseInfo 
      v-if="selectedCourse"
      :course="selectedCourse" 
      @close="selectedCourse = null"
    />
  </div>
</template>

<script>
import { fetchSchedules } from '../services/api';
import { organizeSchedules, getWeekNumber, getYearNumber } from '../services/scheduleService';
import { getLastSchedulesUpdate, getGroupNameView, getDept, getTrainProg, getGroup } from '../utils/storageUtils';
import { formatDateTime, minutesToTime } from '../utils/dateUtils';
import FreeRoomsList from '../components/other/FreeRoomsList.vue';
import DesktopSchedule from '../components/schedule/DesktopSchedule.vue';
import MobileSchedule from '../components/schedule/MobileSchedule.vue';
import CourseInfo from '../components/schedule/CourseInfo.vue';

export default {
  name: 'SchedulePage',
  components: {
    FreeRoomsList,
    DesktopSchedule,
    MobileSchedule,
    CourseInfo
  },
  data() {
    return {
      schedules: [],
      organizedSchedules: {},
      currentWeek: null,
      currentYear: null,
      initialDate: new Date(),
      currentDayIndex: this.getCurrentDayIndex(),
      days: [
        { key: 'm', name: 'Lundi' },
        { key: 'tu', name: 'Mardi' },
        { key: 'w', name: 'Mercredi' },
        { key: 'th', name: 'Jeudi' },
        { key: 'f', name: 'Vendredi' }
      ],
      schedulesLastUpdated: getLastSchedulesUpdate() || null,
      group_name_view: getGroupNameView() ? 'true' : 'false',
      dept: getDept() || '',
      train_prog: getTrainProg() || '',
      group: getGroup() || '',
      selectedCourse: null,
    };
  },
  computed: {
    weekStart() {
      if (!this.initialDate) return '';
      const startOfWeek = new Date(this.initialDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      return startOfWeek.getDate();
    },
    weekEnd() {
      if (!this.initialDate) return '';
      const endOfWeek = new Date(this.initialDate);
      const day = endOfWeek.getDay();
      const diff = endOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      endOfWeek.setDate(diff + 4);
      return endOfWeek.getDate();
    },

  },
  async created() {
    await this.initializeWeek();
    await this.loadSchedules();
  },
  methods: {
    formatDateTime,
    minutesToTime,

    getCurrentDayIndex() {
      const today = new Date().getDay();
      if (today === 0 || today === 6) return 0;
      return today - 1;
    },

    async initializeWeek() {
      this.currentYear = await getYearNumber(this.initialDate);
      this.currentWeek = await getWeekNumber(this.initialDate);
    },

    async loadSchedules() {
      try {
        const response = await fetchSchedules(this.currentYear, this.currentWeek);
        this.schedules = response;
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
      date.setDate(date.getDate() - 7);
      this.initialDate = date;
      await this.initializeWeek();
      await this.loadSchedules();
    },

    async goToNextWeek() {
      let date = new Date(this.initialDate);
      date.setDate(date.getDate() + 7);
      this.initialDate = date;
      await this.initializeWeek();
      await this.loadSchedules();
    },


  }
};
</script>

<style src="../assets/css/scheduleCommon.css"></style>
