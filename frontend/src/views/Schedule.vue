<template>
  <div class="schedule-page">
    <!-- Navigation semaine -->
    <div class="week-navigation">
      <button @click="goToPreviousWeek" class="nav-button">‹</button>
      <span class="week-text">Semaine du {{ weekStart }} au {{ weekEnd }} 2025</span>
      <button @click="goToNextWeek" class="nav-button">›</button>
    </div>

    <!-- Navigation jour (mobile) -->
    <div class="day-navigation mobile-only">
      <button 
        v-for="(d, i) in days" 
        :key="d.key" 
        class="day-tab" 
        :class="{ active: currentDayIndex === i }"
        @click="currentDayIndex = i">
        {{ d.name.substring(0,3) }}
      </button>
    </div>

    <!-- Grille hebdomadaire (desktop) -->
    <div class="schedule-grid desktop-only">
      <div v-for="day in days" :key="day.key" class="day-column">
        <div class="day-header">{{ day.name }}</div>
        <div class="courses-container">
          <template v-for="(course, idx) in getCoursesForDay(day.key)" :key="course.id">
            <!-- Insérer un bloc repas si écart >= 60min avec le précédent et si créneau chevauche midi -->
            <div v-if="shouldInsertLunch(day.key, idx)" class="lunch-card">Repas</div>

            <div 
              class="course-card" 
              :style="{ borderLeftColor: course.display.color_bg }">
              <div class="course-title" :style="{ fontWeight: course.course.is_graded ? 'bold' : 'normal' }">
                {{ course.course.name }}
              </div>
              <div class="course-time">{{ formatTime(course.start_time) }} - {{ formatTime(course.start_time + 90) }}</div>
              <div class="course-duration">Durée: {{ getDuration(course.start_time, course.start_time + 90) }}</div>
              <div class="course-detail">{{ course.course.type }} - {{ course.room }}{{ course.prof ? ' - ' + course.prof : '' }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Liste des cours (mobile) -->
    <div class="courses-list mobile-only">
      <template v-for="(course, idx) in getCoursesForCurrentDay()" :key="course.id">
        <!-- Insérer un bloc repas si écart >= 60min et chevauche la plage déjeuner -->
        <div v-if="shouldInsertLunch(currentDayKey, idx)" class="lunch-card">Repas</div>

        <div 
          class="course-card" 
          :style="{ borderLeftColor: course.display.color_bg }">
          <div class="course-title" :style="{ fontWeight: course.course.is_graded ? 'bold' : 'normal' }">
            {{ course.course.name }}
          </div>
          <div class="course-time">{{ formatTime(course.start_time) }} - {{ formatTime(course.start_time + 90) }}</div>
          <div class="course-duration">Durée: {{ getDuration(course.start_time, course.start_time + 90) }}</div>
          <div class="course-detail">{{ course.course.type }} - {{ course.room }}{{ course.prof ? ' - ' + course.prof : '' }}</div>
        </div>
      </template>
    </div>

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

export default {
  name: 'SchedulePage',
  components: {
    FreeRoomsList
  },
  data() {
    return {
      schedules: [],
      organizedSchedules: {},
      currentWeek: null,
      currentYear: null,
      initialDate: new Date(),
      currentDayIndex: 0,
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
    currentDayName() {
      return this.days[this.currentDayIndex]?.name || 'Lundi';
    },
    currentDayKey() {
      return this.days[this.currentDayIndex]?.key || 'm';
    }
  },
  async created() {
    await this.initializeWeek();
    await this.loadSchedules();
  },
  methods: {
    formatDateTime,
    minutesToTime,
    
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

    goToPreviousDay() {
      this.currentDayIndex = this.currentDayIndex > 0 ? this.currentDayIndex - 1 : 4;
    },

    goToNextDay() {
      this.currentDayIndex = this.currentDayIndex < 4 ? this.currentDayIndex + 1 : 0;
    },

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
    },

    formatTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    },

    getDuration(startMinutes, endMinutes) {
      const duration = endMinutes - startMinutes;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (hours > 0 && minutes > 0) {
        return `${hours}h${minutes}`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${minutes}min`;
      }
    }
  }
};
</script>

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

/* Tabs jours (mobile) */
.day-navigation.mobile-only {
  gap: 8px;
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

/* Grille hebdomadaire (desktop) */
.schedule-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  max-width: 100%;
  gap: 16px;
  margin-bottom: 20px;
}

.day-column {
  background: rgb(255, 255, 255);
  border-radius: 12px;
  padding: 16px;
  width: 20%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1 1 0;
}

.day-header {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.courses-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lunch-card {
  background: #f8eacc;
  color: #8a6d3b;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-weight: 600;
  text-align: center;
}

/* Cartes de cours */
.course-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.425);
  border-left: 4px solid #ddd;
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.course-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.course-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.course-duration {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.course-detail {
  font-size: 12px;
  color: #888;
  line-height: 1.3;
}

/* Liste des cours (mobile) */
.courses-list {
  display: flex;
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

/* Responsive */
.mobile-only {
  display: none;
}



@media (max-width: 768px) {
  .schedule-page {
    padding: 16px;
  }
  
  .lunch-card {
    margin-bottom: 10px;
  }
  
  .mobile-only {
    display: flex;
  }
  
  .desktop-only {
    display: none;
  }
  
  .schedule-grid {
    display: none;
  }
  
  .week-navigation, .day-navigation {
    padding: 10px 16px;
    margin-bottom: 16px;
  }
  
  .week-text, .day-text {
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
  
  .week-navigation, .day-navigation {
    padding: 8px 12px;
    gap: 12px;
  }
  
  .week-text, .day-text {
    font-size: 13px;
  }
}
</style>