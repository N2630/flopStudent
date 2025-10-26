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
        :days="days" />
    </div>

    <!-- Vue mobile -->
    <MobileSchedule 
      :organizedSchedules="organizedSchedules" 
      :days="days"
      :currentDayIndex="currentDayIndex"
      @update:currentDayIndex="currentDayIndex = $event" />

    <!-- Salles libres -->
    <FreeRoomsList />
  </div>
</template>

<script>
import { fetchSchedules } from '../services/api';
import { organizeSchedules, getWeekNumber, getYearNumber } from '../services/scheduleService';
import { getLastSchedulesUpdate, getGroupNameView, getDept, getTrainProg, getGroup } from '../utils/storageUtils';
import { formatDateTime, minutesToTime } from '../utils/dateUtils';
import FreeRoomsList from '../components/FreeRoomsList.vue';
import DesktopSchedule from '../components/DesktopSchedule.vue';
import MobileSchedule from '../components/MobileSchedule.vue';

export default {
  name: 'SchedulePage',
  components: {
    FreeRoomsList,
    DesktopSchedule,
    MobileSchedule
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

<style scoped>
.schedule-page {
  padding: 20px;
  max-width: 95%;
  margin: 0 auto;
}

/* Navigation */
.week-navigation, .day-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-button {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: all 0.2s;
}

.nav-button:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.week-text, .day-text {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .schedule-page {
    padding: 16px;
  }
  
  /* desktop-only helper is centralized in src/assets/css/main.css */
  
  .week-navigation {
    padding: 10px 16px;
    margin-bottom: 16px;
  }
  
  .week-text {
    font-size: 14px;
  }
  
  .nav-button {
    padding: 6px 10px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .schedule-page {
    padding: 12px;
  }
  
  .week-navigation {
    padding: 8px 12px;
    gap: 12px;
  }
  
  .week-text {
    font-size: 13px;
  }
}
</style>