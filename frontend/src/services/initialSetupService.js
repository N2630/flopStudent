import { getDept, getTrainProg, getGroup } from '../utils/storageUtils';

/**
 * Indique si la configuration initiale est nécessaire.
 * Vérifie l'existence de dept, train_prog et group dans le stockage local.
 *
 * @returns {boolean} - true si au moins un paramètre est manquant, false sinon
 */
export function isInitialSetupNeeded() {
  return !getDept() || !getTrainProg() || !getGroup();
}
