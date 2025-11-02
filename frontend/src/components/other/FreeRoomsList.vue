<template>
  <section class="free-rooms-container">
    <header class="free-rooms-header">
      <div>
        <h2>Salles libres</h2>
        <p v-if="lastUpdated" class="muted">Dernière mise à jour : {{ formatDateTime(lastUpdated) }}</p>
      </div>
      <div>
        <button class="btn btn-secondary" @click="refresh">Rafraîchir</button>
      </div>
    </header>

    <div class="cards">
      <article class="card" v-if="hasCurrent">
        <div class="card-header">
          <h3>Créneau actuel</h3>
          <small class="muted">{{ minutesToTime(currentSlot) }} — {{ getDayName(currentDay) }}</small>
        </div>
        <div class="card-body">
          <template v-if="roomsFor(currentSlot).length">
            <span class="room-badge" v-for="r in roomsFor(currentSlot)" :key="r">{{ r }}</span>
          </template>
          <div v-else class="muted">Aucune salle libre pour le créneau actuel.</div>
        </div>
      </article>

      <article class="card" v-if="hasNext">
        <div class="card-header">
          <h3>Créneau suivant</h3>
          <small class="muted">{{ minutesToTime(nextSlot) }} — {{ getDayName(currentDay) }}</small>
        </div>
        <div class="card-body">
          <template v-if="roomsFor(nextSlot).length">
            <span class="room-badge" v-for="room in roomsFor(nextSlot)" :key="room">{{ room }}</span>
          </template>
          <div v-else class="muted">Aucune salle libre pour le créneau suivant.</div>
        </div>
      </article>

      <article class="card" v-if="!hasCurrent && !hasNext">
        <div class="card-header">
          <h3>Pas de créneaux disponibles</h3>
        </div>
        <div class="card-body muted">Il n'y a plus de créneaux libres pour aujourd'hui.</div>
      </article>
    </div>
  </section>
</template>

<script>
import { getWeekNumber, getYearNumber } from '../../services/scheduleService';
import { fetchFreeRooms } from '../../services/api';
import { formatDateTime, minutesToTime, getDayLetter, getDayName } from '../../utils/dateUtils';

export default {
  name: 'FreeRoomsList',
  data() {
    return {
      freeRoomsData: null,
      currentSlot: null,
      nextSlot: null,
      currentDay: null,
      timeSlots: [480, 570, 665, 755, 855, 945, 1040],
      updateInterval: null,
      date: new Date(), 
      lastUpdated: null, 
      loading: false,
      error: null
    };
  },
  async created() {
    await this.loadFreeRooms();
  },
  beforeUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  },
  methods: {
    formatDateTime,
    minutesToTime,
    getDayLetter,
    getDayName,

    /**
     * Met à jour les créneaux horaires courants (currentSlot, nextSlot) et le jour courant (currentDay)
     * en fonction de la date passée en paramètre (ou de la date actuelle si non précisé).
     *
     * @param {Date} [dateToUse] - Date à utiliser pour le calcul (par défaut : maintenant)
     * @returns {void}
     */
    updateCurrentSlotsAndDay(dateToUse) {
      const now = dateToUse || new Date(); 
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      this.currentDay = this.getDayLetter(now);
      let currentFoundSlot = null;
      let nextFoundSlot = null;
      for (let i = 0; i < this.timeSlots.length; i++) {
        if (currentMinutes >= this.timeSlots[i] && (i === this.timeSlots.length - 1 || currentMinutes < this.timeSlots[i + 1])) {
          currentFoundSlot = this.timeSlots[i];
          nextFoundSlot = this.timeSlots[i + 1] || null; // Le dernier n'a pas de suivant
          break;
        } else if (currentMinutes < this.timeSlots[i]) {
          // Si l'heure actuelle est avant le premier créneau, le premier créneau est le créneau suivant
          currentFoundSlot = null;
          nextFoundSlot = this.timeSlots[i];
          break;
        }
      }
      this.currentSlot = currentFoundSlot;
      this.nextSlot = nextFoundSlot;
    },

    async loadFreeRooms() {
      this.loading = true;
      this.error = null;
      try {
        const year = await getYearNumber(this.date);
        const week = await getWeekNumber(this.date);
        const response = await fetchFreeRooms(year, week);
        // réponse attendue : { salles: { 'L': {480: ['A1', ...], ... }}, lastUpdated }
        this.freeRoomsData = response?.salles || {};
        this.lastUpdated = response?.lastUpdated || null;
        this.updateCurrentSlotsAndDay(this.date);
        // option : mettre un intervalle de refresh toutes les 2 minutes
        if (!this.updateInterval) {
          this.updateInterval = setInterval(() => this.loadFreeRooms(), 2 * 60 * 1000);
        }
      } catch (err) {
        console.error('Erreur loadFreeRooms', err);
        this.error = 'Impossible de charger les salles libres.';
      } finally {
        this.loading = false;
      }
    },

    refresh() {
      this.loadFreeRooms();
    },

    roomsFor(slot) {
      if (!slot || !this.currentDay) return [];
      const dayData = this.freeRoomsData?.[this.currentDay] || {};
      const list = Array.isArray(dayData[slot]) ? dayData[slot] : [];
      return list;
    }
  },
  computed: {
    hasCurrent() {
      return this.currentSlot !== null && this.currentSlot < this.timeSlots[this.timeSlots.length -1];
    },
    hasNext() {
      return this.nextSlot !== null && this.nextSlot < this.timeSlots[this.timeSlots.length -1];
    }
  },
};
</script>

<style scoped>
.free-rooms-container {
  margin-top: 24px;
  max-width: 100%;
  background: var(--color-bg-panel);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--default-shadow);
  flex: 1 1 0;
  margin-bottom: 20px;
}


.free-rooms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}


.muted {
  color: var(--text-dim);
  font-size: 0.9rem;
}


.cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 100%;
}


.card {
  display: flex;
  flex: 1 1;
  max-width: 100%;
  flex-direction: column;
  background: var(--color-bg-panel);
  border-radius: 10px;
  box-shadow: var(--box-shadow-strong);
  padding: 12px;
  border: 1px solid var(--default-border-color);
}


.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}


.card-body {
  min-height: 56px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, max-content));
  justify-content: start;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}


.room-badge {
  background: var(--color-primary);
  color: var(--badge-text-color);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  flex-shrink: 0;
}


/* button styles centralized in main.css */


@media (max-width: 900px) {
  .cards {
    flex-direction: column;
  }
}
</style>