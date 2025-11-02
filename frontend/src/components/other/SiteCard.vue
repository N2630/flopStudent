<template>
  <div :class="['site-card', { 'site-inaccessible': !status.isReachable, 'site-reachable': status.isReachable }]">
    <a :href="site.url" target="_blank" rel="noopener noreferrer">
      <h2>{{ site.name }}</h2>
      <p v-if="status.isReachable">Accessible - Délai : {{ status.delay }} ms</p>
      <p v-else>Inaccessible</p>
    </a>
  </div>
</template>

<script>
export default {
  name: 'SiteCard',
  props: {
    site: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      status: {
        isReachable: false,
        delay: 0
      }
    };
  },
  mounted() {
    // Lance le ping lorsque le composant est monté
    this.pingOnLoad();
  },
  methods: {
    ping(url) {
      const start = performance.now();
      // Utilise fetch en no-cors : la réponse sera opaque mais on peut mesurer le temps si la requête passe
      return fetch(url, { mode: 'no-cors' })
        .then(() => Math.round(performance.now() - start))
        .catch(() => null);
    },

    pingOnLoad() {
      if (!this.site || !this.site.url) return;
      this.ping(this.site.url).then((delay) => {
        if (delay !== null) {
          this.status.isReachable = true;
          this.status.delay = delay;
        } else {
          this.status.isReachable = false;
          this.status.delay = 0;
        }
      });
    }
  }
};
</script>

<style scoped>
.site-card {
  background: var(--color-bg-panel, #fff);
  border: 1px solid var(--default-border-color, #e0e0e0);
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  box-shadow: var(--default-shadow, none);
}

.site-card a {
  color: inherit;
  text-decoration: none;
  display: block;
}

.site-card h2 {
  font-size: 16px;
  margin-bottom: 6px;
}

.site-card p {
  font-size: 14px;
  color: var(--text-subtitle-default, #666);
}

.site-inaccessible {
  /* bordure inférieure rouge pour indiquer inaccessibilité */
  border-bottom: 3px solid var(--color-error, #e53935);
}

.site-reachable {
  /* bordure inférieure verte pour indiquer accessibilité */
  border-bottom: 3px solid var(--color-success, #43a047);
}

.site-card {
  transition: border-bottom-color 200ms ease-in-out, box-shadow 150ms ease-in-out;
}
</style>
