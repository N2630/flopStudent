<template>
  <div class="prof-searcher">
    <div class="search-controls">
      <input v-model="query" placeholder="Rechercher un professeur (nom, prénom, abbr)" />
    </div>

    <div class="prof-list">
      <ProfCard v-for="p in filtered" :key="p.username || p._id || p.last_name+''+p.first_name" :prof="p" />
    </div>
  </div>
</template>

<script>
import ProfCard from '../components/other/ProfCard.vue';
import { setProfs } from '../services/profStore';
import { fetchProfsDetails } from '../services/api';
import { getDept } from '../utils/storageUtils';

export default {
  name: 'ProfSearcher',
  components: { ProfCard },
  data() {
    return {
      profs: [],
      query: '',
      loading: false,
      error: null
    };
  },
  computed: {
    filtered() {
      const q = this.query.trim().toLowerCase();
      if (!q) return this.profs;
      return this.profs.filter(p => {
        return (p.lastname || '').toLowerCase().includes(q)
          || (p.firstname || '').toLowerCase().includes(q)
          || (p.username || '').toLowerCase().includes(q)
          || (p.email || '').toLowerCase().includes(q);
      });
    }
  },
  async created() {
    await this.loadProfs();
  },
  methods: {
    async loadProfs() {
      this.loading = true;
      this.error = null;
      try {
        const dept = getDept();
        this.profs = await fetchProfsDetails(dept);
        try { setProfs(this.profs); } catch(e) { console.warn('setProfs failed', e); }
      } catch (err) {
        // fallback : mock minimal dataset
        console.warn('get-profs API not available, using fallback mock data', err);
        this.profs = [
          { username: 'JDOE', firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', departments: ['INFO'] },
          { username: 'ASMITH', firstname: 'Alice', lastname: 'Smith', email: 'alice.smith@example.com', departments: ['CS','GIM'] }
        ];
          try { setProfs(this.profs); } catch(e) {
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
.prof-searcher { padding: 18px; }
.search-controls { margin-bottom: 12px; }
.search-controls input { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--default-border-color); }
.prof-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }

@media (max-width: 720px) {
  .prof-list { grid-template-columns: 1fr; }
}
</style>
