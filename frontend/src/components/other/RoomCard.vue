<template>
  <article :class="['room-card', { expanded: isOpen }]" @click="toggle">
    <div class="room-head">
      <div class="abbrev">{{ room.room }}</div>
      <div class="name">Salle {{ room.room }}</div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'RoomCard',
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  data() {
    return { isOpen: false };
  },
  methods: {
    toggle() {
      const roomName = this.room.room;
      if (roomName) {
        // Redirige vers la page de détail de la salle
        //this.$router.push({ name: 'RoomDetail', params: { room: roomName } });
      }
    }
  }
};
</script>

<style scoped>
/* J'ai renommé les classes ici pour qu'elles matchent le template */
.room-card {
  background: var(--color-bg-panel, #ffffff);
  border: 1px solid var(--card-border-color, #e0e0e0);
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 150ms ease;
}

.room-card:hover { 
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.room-head { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.abbrev { 
  background: var(--card-prof-abrrev-bg, #f0f0f0); 
  color: var(--badge-text-color, #333); 
  width: 60px; /* Un peu plus large pour les noms de salle */
  height: 40px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border-radius: 8px; 
  font-weight: 700; 
}

.name { 
  font-weight: 600; 
  color: var(--text-default); 
}
</style>