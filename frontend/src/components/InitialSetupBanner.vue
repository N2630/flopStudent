<template>
  <div v-if="showBanner" class="initial-setup-banner">
    <div class="banner-content">
      <div class="banner-icon">👋</div>
      <div class="banner-message">
        <strong>Bienvenue sur Flop Student !</strong>
        <p>Il semblerait que ce soit votre première visite ou que vos paramètres soient manquants. Veuillez configurer votre département, année et groupe pour commencer.</p>
      </div>
      <button @click="hideBanner" class="banner-close" title="Fermer">
        ✕
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InitialSetupBanner',
  props: {
    showBanner: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    hideBanner() {
      this.$emit('close-banner');
    }
  }
};
</script>

<style scoped>
.initial-setup-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4CAF50, #8BC34A); /* Greenish gradient */
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 15px;
}

.banner-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.banner-message {
  flex: 1;
}

.banner-message strong {
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
}

.banner-message p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
}

.banner-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.banner-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 