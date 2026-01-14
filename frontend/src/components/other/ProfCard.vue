<template>
  <article :class="['prof-card', { expanded: isOpen }]" @click="toggle">
    <div class="prof-head">
      <div class="abbrev">{{ prof.username || abbrev }}</div>
      <div class="name">{{ prof.last_name }} {{ prof.first_name }}</div>
    </div>

  </article>
</template>

<script>
export default {
  name: 'ProfCard',
  props: {
    prof: {
      type: Object,
      required: true
    }
  },
  data() {
    return { isOpen: false };
  },
  computed: {
    abbrev() {
      // try to compute abbreviation from names (ex: J.DOE -> JD)
      const f = this.prof.firstname ? this.prof.firstname.charAt(0) : '';
      const l = this.prof.lastname ? this.prof.lastname.charAt(0) : '';
      return (f + l).toUpperCase();
    }
  },
  methods: {
    toggle() {
      // navigate to professor detail page instead of expanding inline
      const username = this.prof.username || this.abbrev || '';
      if (username) {
        this.$router.push({ name: 'ProfDetail', params: { username } });
        return;
      }
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style scoped>
.prof-card {
  background: var(--color-bg-panel);
  border: 1px solid var(--card-border-color, #e0e0e0);
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  box-shadow: var(--box-shadow-strong, none);
  transition: transform 120ms ease, box-shadow 150ms ease;
}

.prof-card:hover { 
  transform: translateY(-4px); 
}

.prof-head { 
  display:flex; 
  align-items:center; 
  gap:12px; 
}

.abbrev { 
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

.name { 
  font-weight:600; 
  color:var(--text-default); 
}

.prof-details { 
  margin-top:10px; 
  color:var(--text-default); 
  font-size:0.95rem; 
}

.prof-card.expanded { 
  box-shadow: var(--box-shadow-strong); 
}

.fade-enter-active, .fade-leave-active { 
  transition: opacity .18s; 
}

.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>
