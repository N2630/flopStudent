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

export default {
  name: 'SettingsParams',
  data() {
    return {
      dept: localStorage.getItem('dept') || '',
      train_prog: localStorage.getItem('train_prog') || '',
      group: localStorage.getItem('group') || '',
      testing: false,
      group_name_view: localStorage.getItem('group_name_view') === 'true', // booléen
      connectionStore
    };
  },
  computed: {
    groupNameBtnText() {
      return this.group_name_view ? 'Activé' : 'Désactivé';
    }
  },
  methods: {
    saveSettings() {
      localStorage.setItem('dept', this.dept.toUpperCase());
      localStorage.setItem('train_prog', this.train_prog.toUpperCase());
      localStorage.setItem('group', this.group.toUpperCase());
      localStorage.setItem('group_name_view', this.group_name_view);
      alert('Paramètres enregistrés avec succès!');
    },
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