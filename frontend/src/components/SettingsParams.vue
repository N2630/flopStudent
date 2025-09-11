<template>
  <div class="params-form">
    <form @submit.prevent="saveSettings">
      <div>
        <label for="dept">Departement (ex INFO):</label>
        <input type="text" id="dept" v-model="dept" />
      </div>
      <div>
        <label for="train_prog">Année (ex BUT1):</label>
        <input type="text" id="train_prog" v-model="train_prog" />
      </div>
      <div>
        <label for="group">Groupe (ex 1A):</label>
        <input type="text" id="group" v-model="group" />
      </div>
      <div>
        <label for="group_name_view">Afficher le nom du groupe:</label>
        <input type="button" id="group_name_view" :value="groupNameBtnText" @click="toggleGroupNameBtnView" :class="{ 'btn-desactive': !group_name_view, 'btn-active': group_name_view }"/>
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  </div>
</template>
  
<script>
import { connectionStore } from '../services/connectionStore';
import { getDept, setDept, getTrainProg, setTrainProg, getGroup, setGroup, getGroupNameView, setGroupNameView } from '../utils/storageUtils';

export default {
  name: 'SettingsParams',
  data() {
    return {
      dept: getDept() || '',
      train_prog: getTrainProg() || '',
      group: getGroup() || '',
      testing: false,
      group_name_view: getGroupNameView(), // booléen
      connectionStore
    };
  },
  computed: {
    /**
     * Retourne le texte à afficher sur le bouton d'activation de l'affichage du nom du groupe.
     *
     * @returns {string} - "Activé" si l'affichage est activé, "Désactivé" sinon
     */
    groupNameBtnText() {
      return this.group_name_view ? 'Activé' : 'Désactivé';
    }
  },
  methods: {
    /**
     * Enregistre les paramètres saisis (département, année, groupe, affichage du nom du groupe)
     * dans le localStorage via les fonctions utilitaires, puis affiche une alerte de succès
     * et redirige l'utilisateur vers la page d'accueil.
     *
     * @returns {void}
     */
    saveSettings() {
      setDept(this.dept.toUpperCase());
      setTrainProg(this.train_prog.toUpperCase());
      setGroup(this.group.toUpperCase());
      setGroupNameView(this.group_name_view);
      alert('Paramètres enregistrés avec succès!');
      this.$router.push('/');
    },

    /**
     * Bascule l'état d'affichage du nom du groupe (activé/désactivé) et
     * met à jour dynamiquement la classe CSS du bouton pour refléter l'état.
     *
     * @returns {void}
     */
    toggleGroupNameBtnView() {
      this.group_name_view = !this.group_name_view;

      const btn = document.getElementById('group_name_view');

      if(btn.classList.contains('btn-desactive')) {
        btn.classList.remove('btn-desactive');
        btn.classList.add('btn-active');
      } else {
        btn.classList.add('btn-desactive');
        btn.classList.remove('btn-active');
      }
    }
  }
};
</script>
  
<style scoped>
form {
  width: 100%;
}
</style>