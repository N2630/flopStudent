<template>
  <div class="grp-schedule-div">
    <div class="week-navigation">
      <button @click="goToPreviousWeek" class="nav-button">‹</button>
      <span class="week-text">Semaine {{ currentWeek }} - {{ currentYear }} </span>
      <button @click="goToNextWeek" class="nav-button">›</button>
    </div>
    <div class="schedule-page schedule-group-container">
      
      <div class="schedule-group-header">
          <h3>{{ scheduleGrp.dept }} - {{ scheduleGrp.trainProg }} - Groupe {{ scheduleGrp.group }} - {{ scheduleGrp.id }}</h3>
          <button class="btn-secondary btn-del" @click="removeSchedule(scheduleGrp.id)">
              Retirer ce groupe
          </button>
      </div>

      <DesktopSchedule 
        :organizedSchedules="organizedSchedules" 
        :days="days"
        :initialDate="initialDate" 
        @open-course-info="selectedCourse = $event"
        class="desktop-schedule-vue"
      />

      <!-- Vue mobile -->
      <MobileSchedule 
        :organizedSchedules="organizedSchedules" 
        :days="days"
        :currentDayIndex="currentDayIndex"
        @update:currentDayIndex="currentDayIndex = $event"
        :initialDate="initialDate" 
        @open-course-info="selectedCourse = $event"
        class="mobile-schedule-vue"
      />

      <CourseInfo 
        v-if="selectedCourse"
        :course="selectedCourse" 
        @close="selectedCourse = null"
      />
    </div>
  </div>
  
</template>

<script>
import { fetchGroupSchedules } from '../../services/api';
import { organizeSchedules, getWeekNumber, getYearNumber } from '../../services/scheduleService';
import { getLastSchedulesUpdate, getGroupNameView, removeFollowedSchedule } from '../../utils/storageUtils';
import { formatDateTime, minutesToTime } from '../../utils/dateUtils';
import DesktopSchedule from '../schedule/DesktopSchedule.vue';
import MobileSchedule from '../schedule/MobileSchedule.vue';
import CourseInfo from '../schedule/CourseInfo.vue';
export default {
  name: 'GroupSchedule',
  components: {
    DesktopSchedule,
    MobileSchedule,
    CourseInfo
  },
  props: {
    scheduleGrp: {
      type: Object,
      required: true
    }
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
      selectedCourse: null
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
        const response = await fetchGroupSchedules(this.currentYear, this.currentWeek, this.scheduleGrp.dept, this.scheduleGrp.trainProg, this.scheduleGrp.group);
        this.schedules = response;
        this.organizedSchedules = organizeSchedules(this.schedules);
      } catch (error) {
        console.error("Erreur lors du chargement des EDT:", error);
        this.schedules = [];
        this.organizedSchedules = {};
        this.schedulesLastUpdated = null;
      }
    },

    async removeSchedule(scheduleId) {
        await removeFollowedSchedule(scheduleId);
        this.$emit('modify-schedule', this.scheduleGrp);
    },
    
    async goToPreviousWeek() {
      let date = new Date(this.initialDate);
      date.setDate(date.getDate() - 7);
      this.initialDate = date;
      //await this.initializeWeek();
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

<style scoped>
  .schedule-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    gap: 20%;
  }

  .schedule-group-container {
    background-color: var(--color-bg-panel) !important;
    width: 100% !important;
    border-radius: 12px;
  }

  .week-navigation {
    width: 95% !important;
    align-self: center;
  }

  .grp-schedule-div {
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;

  }

  @media (max-width: 768px) {
    .btn-del {
      padding: 1px !important;
    }
  }
  
</style>
