<template>
  <div class="prof-detail-page">
    <button class="back" @click="goBack" aria-label="Retour à la liste des profs">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="back-text">Retour</span>
    </button>
    <div v-if="loading">Chargement...</div>
    <div v-else-if="!prof">Professeur non trouvé.</div>
    <div v-else class="prof-panel">
        <header class="prof-header">
            <div>
                <div class="abbrev">
                  <h1>{{ prof.username }}</h1> 
                </div>

                <div class="name-info">
                    <p><strong>Nom de famille :</strong> {{ prof.last_name }} </p>
                    <p><strong>Prénom :</strong> {{ prof.first_name }} </p>
                </div>
                <p v-if="prof.email" class="email">
                    <strong>Email:</strong>
                    <button class="email-copy" @click.stop.prevent="copyEmail(prof.email)" :aria-label="`Copier ${prof.email}`">
                        <span v-if="!copied" class="copi-txt">
                        <span class="email-txt">{{ prof.email }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="copy-icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                        </svg>
                        </span>
                        <span v-else class="copied">Copié ✓</span>
                    </button>
                </p>
                <p v-if="prof.departments && prof.departments.length"><strong>Départements:</strong> {{ prof.departments.join(', ') }}</p>
            </div>
        </header>
      
    </div>

    <div class="profSchedule">
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
import { findProfByUsername } from '../services/profStore';
import { fetchProfSchedules } from '@/services/api';
import DesktopSchedule from '../components/schedule/DesktopSchedule.vue';
import MobileSchedule from '../components/schedule/MobileSchedule.vue';
import { organizeSchedules, getWeekNumber, getYearNumber } from '../services/scheduleService';

export default {
  name: 'ProfDetail',
  components: {
    DesktopSchedule,
    MobileSchedule
  },
  data() {
    return { 
        prof: null, 
        loading: true, 
        error: null, 
        copied: false,
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
    const username = this.$route.params.username;
    // try local cache first
    let p = findProfByUsername(username);
    if (p) {
      this.prof = p;
      // initialize week and load schedules for this prof
      await this.initializeWeek();
      await this.loadSchedules();
      this.currentDayIndex = this.getCurrentDayIndex();
      this.loading = false;
      return;
    }

    try {
      const res = await axios.get(`/api/get-all-profs?username=${encodeURIComponent(username)}`);
      if (res && res.data) {
        const data = res.data;
        if (Array.isArray(data)) {
          this.prof = data.find(p => String(p.username).toLowerCase() === String(username).toLowerCase()) || data[0] || null;
        } else {
          this.prof = data.prof || data;
        }
      }
      
      if (this.prof) {
        await this.initializeWeek();
        await this.loadSchedules();
        this.currentDayIndex = this.getCurrentDayIndex();
      }
    } catch (err) {
      console.warn('No backend prof endpoint or fetch failed', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async loadSchedules() {
      try {
        const response = await fetchProfSchedules(this.currentYear, this.currentWeek, this.prof.username);
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
      this.$router.push({ name: 'ProfSearcher' });
    }
    ,
    async copyEmail(email) {
      if (!email) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 1500);
      } catch (e) {
        console.warn('copy failed', e);
      }
    }
  }
};
</script>

<style src="../assets/css/scheduleCommon.css"></style>
<style scoped>
/* Layout */
.prof-detail-page {
  padding: 18px;
}

.prof-panel {
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
.abbrev { 
  background: var(--card-prof-abbrev-bg);
  color: var(--badge-text-color); 
  padding: 18px;
  width:40px; 
  height:40px; 
  display:flex; 
  align-items:center; 
  justify-content:center; 
  border-radius:8px; 
  font-weight:700;
}

.abbrev h1 {
    margin: 0;
    font-size: 1rem;
}

.email {
    gap: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.email-copy {
  background-color: var(--color-bg-panel);
  border:2px solid var(--default-border-color);
  color: var(--text-default);
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.copi-txt {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.copy-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  color: var(--text-color);
}

.copied {
  color: var(--color-success, #2a9d8f);
  font-weight: 700;
}

/* Actions */
.prof-actions {
  margin-top: 12px;
}

.prof-actions button {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.prof-more {
  margin-top: 18px;
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