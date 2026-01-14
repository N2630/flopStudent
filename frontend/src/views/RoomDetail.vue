<template>
  <div class="room-detail-page">
    <button class="back" @click="goBack" aria-label="Retour à la liste des salles">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="back-text">Retour</span>
    </button>
    <div v-if="loading">Chargement...</div>
    <div v-else-if="!room">Salle non trouvée.</div>
    <div v-else class="room-panel">
        <header class="room-header">
            <div id="inside-div-header">
                <div class="room-abbrev">
                  <h1>{{ room.room }}</h1> 
                </div>

                <div class="name-info">
                    <p><strong>Salle :</strong> {{ room.room }} </p>
                    <p v-if="room.site"><strong>Site :</strong> {{ room.site }} </p>
                </div>
            </div>
        </header>
      
    </div>

    <div class="roomSchedule">
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
        />
      </div>

      <!-- Vue mobile -->
      <MobileSchedule 
        :organizedSchedules="organizedSchedules" 
        :days="days"
        :currentDayIndex="currentDayIndex"
        @update:currentDayIndex="currentDayIndex = $event"
        :initialDate="initialDate" 
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { findRoomByName } from '../services/roomStore';
import { fetchRoomSchedules } from '@/services/api';
import DesktopSchedule from '../components/schedule/DesktopSchedule.vue';
import MobileSchedule from '../components/schedule/MobileSchedule.vue';
import { organizeSchedules, getWeekNumber, getYearNumber } from '../services/scheduleService';

export default {
  name: 'RoomDetail',
  components: {
    DesktopSchedule,
    MobileSchedule
  },
  data() {
    return { 
        room: null, 
        loading: true, 
        error: null, 
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
    };
  },
  async created() {
    const roomName = this.$route.params.room;
    // try local cache first
    let r = findRoomByName(roomName);
    if (r) {
      this.room = r;
      // initialize week and load schedules for this room
      await this.initializeWeek();
      await this.loadSchedules();
      this.currentDayIndex = this.getCurrentDayIndex();
      this.loading = false;
      return;
    }

    try {
      const res = await axios.get(`/api/get-all-rooms`);
      if (res && res.data) {
        const data = res.data;
        if (Array.isArray(data)) {
          this.room = data.find(r => String(r.room).toLowerCase() === String(roomName).toLowerCase()) || data[0] || null;
        } else {
          this.room = data.room || data;
        }
      }
      
      if (this.room) {
        await this.initializeWeek();
        await this.loadSchedules();
        this.currentDayIndex = this.getCurrentDayIndex();
      }
    } catch (err) {
      console.warn('No backend room endpoint or fetch failed', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async loadSchedules() {
      try {
        const response = await fetchRoomSchedules(this.currentYear, this.currentWeek, this.room.room);
        this.schedules = response;
        this.organizedSchedules = organizeSchedules(this.schedules);
      } catch (error) {
        console.error("Erreur lors du chargement des EDT:", error);
        this.schedules = [];
        this.organizedSchedules = {};
        this.schedulesLastUpdated = null;
      }
    },

    getCurrentDayIndex() {
      const today = new Date().getDay();
      if (today === 0 || today === 6) return 0;
      return today - 1;
    },

    async initializeWeek() {
      this.currentYear = await getYearNumber(this.initialDate);
      this.currentWeek = await getWeekNumber(this.initialDate);
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

    goBack() {
        this.$router.push({ name: 'RoomSearcher' });
    }
  }
};
</script>

<style src="../assets/css/scheduleCommon.css"></style>
<style scoped>
/* Layout */
.room-detail-page {
  padding: 18px;
}

#inside-div-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
}

.room-panel {
    background: var(--color-bg-panel);
    padding: 18px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: var(--box-shadow-strong, none);
}

.name-info {
    color: var(--text-default);
}

/* Email copy button */
.room-abbrev { 
    background: var(--card-prof-abbrev-bg); 
    color: var(--badge-text-color); 
    padding: 18px;
    width: fit-content; 
    min-width: 40px;
    height:40px; 
    display:flex; 
    align-items:center; 
    justify-content:center; 
    border-radius:8px; 
    font-weight:700;
}

.room-abbrev h1 {
        margin: 0;
        font-size: 1rem;
}

/* Back button */
.back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 6px 8px;
        border-radius: 6px;
        font-weight: 600;
        margin-bottom: 10px;
}

.back svg {
    display: block;
}

.back:hover {
    background: rgba(0, 0, 0, 0.04);
}

.back-text {
    display: inline-block;
}
</style>