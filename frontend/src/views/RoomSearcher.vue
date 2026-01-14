<template>
  <div class="room-searcher">
    <div class="search-controls">
      <input v-model="query" placeholder="Rechercher une salle (nom, numéro, abbr)" />
    </div>

    <div class="room-list">
      <RoomCard v-for="r in filtered" :key="r.room" :room="r" />
    </div>
  </div>
</template>

<script>
import RoomCard from '../components/other/RoomCard.vue';
import { setRooms } from '../services/roomStore';
import { fetchAllRooms } from '../services/api';

export default {
  name: 'RoomSearcher',
  components: { RoomCard },
  data() {
    return {
      rooms: [],
      query: '',
      loading: false,
      error: null
    };
  },
  computed: {
    filtered() {
      const q = this.query.trim().toLowerCase();
      if (!q) return this.rooms;
      return this.rooms.filter(r => {
        return (r.room || '').toLowerCase().includes(q);
      });
    }
  },
  async created() {
    await this.loadRooms();
  },
  methods: {
    async loadRooms() {
      this.loading = true;
      this.error = null;
      try {
        this.rooms = await fetchAllRooms();
        console.log(this.rooms);
        try { 
            setRooms(this.rooms); 
        } catch(e) { 
            console.warn('setRooms failed', e); 
        }
      } catch (err) {
        // fallback : mock minimal dataset
        console.warn('get-rooms API not available, using fallback mock data', err);
        this.rooms = [
          { name: 'B100' },
          { name: 'A200' }
        ];
          try { setRooms(this.rooms); } catch(e) {
              console.log(e);
          }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.room-searcher { padding: 18px; }
.search-controls { margin-bottom: 12px; }
.search-controls input { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--default-border-color); }
.room-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }

@media (max-width: 720px) {
  .room-list { grid-template-columns: 1fr; }
}
</style>
