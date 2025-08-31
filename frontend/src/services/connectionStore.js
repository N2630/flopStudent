import { reactive } from 'vue';

// Store réactif pour gérer l'état de connexion
export const connectionStore = reactive({
  isBackendConnected: true,
  showOfflineBanner: false,
  lastError: null
});

// Fonction pour détecter si une erreur est liée à la connexion
export const isConnectionError = (error) => {
  return (
    !error.response || // Pas de réponse du serveur
    error.code === 'ECONNREFUSED' || // Connexion refusée
    error.code === 'ENOTFOUND' || // Serveur non trouvé
    error.code === 'NETWORK_ERROR' || // Erreur réseau
    error.message?.includes('Network Error') || // Erreur réseau Axios
    error.message?.includes('timeout') // Timeout
  );
};

// Fonction pour mettre à jour l'état de connexion
export const updateConnectionStatus = (error = null) => {
  if (error && isConnectionError(error)) {
    connectionStore.isBackendConnected = false;
    connectionStore.showOfflineBanner = true;
    connectionStore.lastError = error;
  } else {
    connectionStore.isBackendConnected = true;
    connectionStore.showOfflineBanner = false;
    connectionStore.lastError = null;
  }
};

// Fonction pour masquer le bandeau
export const hideOfflineBanner = () => {
  connectionStore.showOfflineBanner = false;
}; 