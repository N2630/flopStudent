<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Paramètres</h2>
        <button @click="closeModal" class="close-button">×</button>
      </div>
      
      <div class="modal-content">
        <p class="modal-description">
          Configurez votre département, année et groupe pour afficher votre emploi du temps personnalisé.
        </p>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label for="department">Département</label>
            <select id="department" v-model="formData.department" class="form-select" :disabled="loading.departments">
              <option value="">Sélectionner un département</option>
              <option v-for="dept in departments" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
            <div v-if="loading.departments" class="loading-text">Chargement...</div>
          </div>
          
          <div class="form-group">
            <label for="year">Année</label>
            <select id="year" v-model="formData.year" class="form-select" :disabled="!formData.department || loading.trainProgs">
              <option value="">Sélectionner une année</option>
              <option v-for="trainProg in trainProgs" :key="trainProg" :value="trainProg">
                {{ trainProg }}
              </option>
            </select>
            <div v-if="loading.trainProgs" class="loading-text">Chargement...</div>
          </div>
          
          <div class="form-group">
            <label for="group">Groupe</label>
            <select id="group" v-model="formData.group" class="form-select" :disabled="!formData.year || loading.groups">
              <option value="">Sélectionner un groupe</option>
              <option v-for="group in groups" :key="group" :value="group">
                Groupe {{ group }}
              </option>
            </select>
            <div v-if="loading.groups" class="loading-text">Chargement...</div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getDept, getTrainProg, getGroup, setDept, setTrainProg, setGroup } from '../../utils/storageUtils';
import { fetchDepartments, fetchTrainProgs, fetchGroups } from '../../services/api';

export default {
  name: 'SettingsParams',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        department: getDept() || '',
        year: getTrainProg() || '',
        group: getGroup() || ''
      },
      departments: [],
      trainProgs: [],
      groups: [],
      loading: {
        departments: false,
        trainProgs: false,
        groups: false
      }
      ,
      // drapeau pour empêcher les watchers de réagir lors de l'initialisation
      isInitializing: false
    };
  },
  computed: {
    isFormValid() {
      return this.formData.department && this.formData.year && this.formData.group;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // initialisation propre : charger d'abord les listes, puis pré-remplir
        this.initSettingsModal();
      }
    },
    'formData.department'(newDept) {
      // Ne pas réagir si on est en phase d'initialisation (pré-remplissage)
      if (this.isInitializing) return;
      if (newDept) {
        this.loadTrainProgs(newDept);
        // Reset les autres champs quand l'utilisateur change le département
        this.formData.year = '';
        this.formData.group = '';
        this.trainProgs = [];
        this.groups = [];
      }
    },
    'formData.year'(newYear) {
      if (this.isInitializing) return;
      if (newYear && this.formData.department) {
        this.loadGroups(this.formData.department, newYear);
        // Reset le groupe quand l'utilisateur change l'année
        this.formData.group = '';
        this.groups = [];
      }
    }
  },
  mounted() {
    if (this.show) {
      this.initSettingsModal();
    }
  },
  methods: {
    // Initialise proprement le modal : charger d'abord les listes, puis pré-remplir
    async initSettingsModal() {
      this.isInitializing = true;
      try {
        await this.loadDepartments();
        await this.loadCurrentSettings();
      } finally {
        this.isInitializing = false;
      }
    },
    async loadCurrentSettings() {
      this.formData.department = getDept() || '';
      this.formData.year = getTrainProg() || '';
      this.formData.group = getGroup() || '';
      
      // Charger les données en cascade si nécessaire
      if (this.formData.department) {
        await this.loadTrainProgs(this.formData.department);
        if (this.formData.year) {
          await this.loadGroups(this.formData.department, this.formData.year);
        }
      }
    },
    
    async loadDepartments() {
      this.loading.departments = true;
      try {
        const res = await fetchDepartments();
        let list = [];
        // Normaliser la réponse au cas où elle serait un objet ou un tableau
        if (Array.isArray(res)) {
          list = res;
        } else if (res && Array.isArray(res.departments)) {
          list = res.departments;
        }
        // Nettoyer et filtrer les entrées
        this.departments = list.map(d => String(d).trim()).filter(Boolean);
        // Vérification debug

      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error);
        this.departments = [];
      } finally {
        this.loading.departments = false;
      }
    },

    
    async loadTrainProgs(dept) {
      this.loading.trainProgs = true;
      try {
        this.trainProgs = await fetchTrainProgs(dept);
      } catch (error) {
        console.error('Erreur lors du chargement des années:', error);
        this.trainProgs = [];
      } finally {
        this.loading.trainProgs = false;
      }
    },
    
    async loadGroups(dept, trainProg) {
      this.loading.groups = true;
      try {
        this.groups = await fetchGroups(dept, trainProg);
      } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error);
        this.groups = [];
      } finally {
        this.loading.groups = false;
      }
    },
    
    saveSettings() {
      if (!this.isFormValid) return;
      
      // Sauvegarder les paramètres
      setDept(this.formData.department);
      setTrainProg(this.formData.year);
      setGroup(this.formData.group);
      
      // Émettre un événement pour notifier le parent
      this.$emit('settings-saved', {
        department: this.formData.department,
        year: this.formData.year,
        group: this.formData.group
      });
      
      // Fermer le modal
      this.closeModal();
    },
    
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

.modal {
  background: var(--color-primary);
  border-radius: 12px;
  box-shadow: var(--default-shadow);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--default-border-color);
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-default);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-dim);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: var(--color-bg-hover);
}

.modal-content {
  padding: 24px;
}

.modal-description {
  color: var(--text-dim);
  margin-bottom: 24px;
  line-height: 1.5;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: var(--text-default);
  font-size: 14px;
}


.loading-text {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 4px;
  font-style: italic;
}

/* form-select, form-actions and button styles are centralized in src/assets/css/main.css */

/* Responsive */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>