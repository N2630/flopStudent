<template>
    <div class="free-rooms-container">
      <h2>Salles libres</h2>
      
      <div class="free-rooms-display">
        <div class="slot-column">
          <h3>Créneau actuel: {{ minutesToTime(currentSlot) }} - {{ getDayName(currentDay) }}</h3>
          <div v-if="freeRoomsData && freeRoomsData[currentDay] && freeRoomsData[currentDay][currentSlot]">
            <div class="dept-rooms">
              <p><strong>Salles :</strong> {{ Array.isArray(freeRoomsData[currentDay][currentSlot]) && freeRoomsData[currentDay][currentSlot].length > 0 ? freeRoomsData[currentDay][currentSlot].join(', ') : 'Aucune salle libre' }}</p>
            </div>
          </div>
          <div v-else>
            <p>Chargement ou aucune salle libre pour ce créneau.</p>
          </div>
        </div>

        <div class="slot-column">
          <h3>Créneau suivant: {{ minutesToTime(nextSlot) }} - {{ getDayName(currentDay) }}</h3>
          <div v-if="freeRoomsData && freeRoomsData[currentDay] && freeRoomsData[currentDay][nextSlot]">
            <div class="dept-rooms">
              <p><strong>Salles :</strong> {{ Array.isArray(freeRoomsData[currentDay][nextSlot]) && freeRoomsData[currentDay][nextSlot].length > 0 ? freeRoomsData[currentDay][nextSlot].join(', ') : 'Aucune salle libre' }}</p>
            </div>
          </div>
          <div v-else>
            <p>Chargement ou aucune salle libre pour ce créneau suivant.</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { getWeekNumber, getYearNumber } from '../services/scheduleService';
import { fetchFreeRooms } from '../services/api';

export default {
  name: 'FreeRoomsList',
  data() {
    return {
      freeRoomsData: null,
      currentSlot: null,
      nextSlot: null,
      currentDay: null,
      timeSlots: [480, 570, 665, 755, 855, 945, 1030],
      updateInterval: null,
      testDate: new Date(), // Date de test fixée
    };
  },
  async created() {
    // Utiliser la testDate pour l'initialisation
    const year = await getYearNumber(this.testDate);
    const week = await getWeekNumber(this.testDate);
    this.freeRoomsData = await fetchFreeRooms(year, week);
    this.updateCurrentSlotsAndDay(this.testDate); // Passer la date de test
    // Pas d'intervalle de rafraîchissement automatique pour les tests
    // this.updateInterval = setInterval(() => this.updateCurrentSlotsAndDay(this.testDate), 60 * 1000);
  },
  beforeUnmount() {
    // clearInterval(this.updateInterval);
  },
  methods: {
    updateCurrentSlotsAndDay(dateToUse) {
      const now = dateToUse || new Date(); // Utiliser la date passée ou la date actuelle
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
    minutesToTime(minutes) {
      if (minutes === null) return 'N/A';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    },
    getDayLetter(date) {
      const dayOfWeek = date.getDay(); // 0 pour Dimanche, 1 pour Lundi, ..., 6 pour Samedi
      const daysMap = {
        1: 'm',
        2: 'tu',
        3: 'w',
        4: 'th',
        5: 'f',
      };
      return daysMap[dayOfWeek] || 'N/A'; // Retourne N/A pour le weekend ou jour inconnu
    },
    getDayName(dayLetter) {
      const days = {
        "m": "Lundi",
        "tu": "Mardi",
        "w": "Mercredi",
        "th": "Jeudi",
        "f": "Vendredi"
      };
      return days[dayLetter] || "Jour inconnu";
    }
  },
};
</script>

<style src="../assets/css/freeRooms.css"></style>