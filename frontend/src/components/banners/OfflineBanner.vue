<template>
  <div v-if="connectionStore.showOfflineBanner" class="offline-banner">
    <div class="banner-content">
      <div class="banner-icon">⚠️</div>
      <div class="banner-message">
        <strong>Mode hors ligne</strong>
        <p>Impossible de contacter le serveur. Vous consultez actuellement une copie locale de vos données.</p>
      </div>
      <button @click="hideBanner" class="banner-close" title="Fermer">
        ✕
      </button>
    </div>
  </div>
</template>

<script>
import { connectionStore, hideOfflineBanner } from '../../services/connectionStore';

export default {
  name: 'OfflineBanner',
  data() {
    return {
      connectionStore
    };
  },
  methods: {
    /**
     * Masque la bannière d'information "hors ligne" en mettant à jour l'état global
     * via la fonction utilitaire `hideOfflineBanner` (store réactif).
     *
     * @returns {void}
     */
    hideBanner() {
      hideOfflineBanner();
    }
  }
};
</script>

<style scoped>
.banner-content {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ff4d07, #ff7707); /* Orange gradient */
  padding: 12px 20px;
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
</style> 