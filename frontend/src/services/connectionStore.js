import { reactive } from 'vue';

/**
 * Store réactif global pour l'état de connexion au backend.
 * 
 * @property {boolean} isBackendConnected - true si le backend est joignable, false sinon
 * @property {boolean} showOfflineBanner - true pour afficher la bannière "hors ligne"
 * @property {any} lastError - Dernière erreur de connexion rencontrée (ou null)
 */
export const connectionStore = reactive({
  isBackendConnected: true,
  showOfflineBanner: false,
  lastError: null
});

/**
 * Détermine si une erreur donnée est une erreur de connexion réseau.
 *
 * @param {any} error - Objet erreur à tester (Axios, fetch, etc.)
 * @returns {boolean} - true si l'erreur est liée à la connexion, false sinon
 */
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

/**
 * Met à jour l'état de connexion global en fonction d'une éventuelle erreur.
 * Affiche la bannière "hors ligne" si une erreur de connexion est détectée.
 *
 * @param {any} [error=null] - Erreur à analyser (optionnelle)
 * @returns {void}
 */
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

/**
 * Masque la bannière "hors ligne" (sans modifier l'état de connexion).
 *
 * @returns {void}
 */
export const hideOfflineBanner = () => {
  connectionStore.showOfflineBanner = false;
}; 