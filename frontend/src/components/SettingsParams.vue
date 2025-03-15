<template>
    <div>
      <h2>Paramètres</h2>
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
          <label for="apiUrl">Adresse de l'API :</label>
          <input type="text" id="apiUrl" v-model="apiUrl" />
        </div>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SettingsParams',
    data() {
      return {
        dept: localStorage.getItem('dept') || '',
        train_prog: localStorage.getItem('train_prog') || '',
        group: localStorage.getItem('group') || '',
        apiUrl: localStorage.getItem('apiUrl') || 'http://localhost:3000'
      };
    },
    methods: {
      saveSettings() {
        localStorage.setItem('dept', this.dept);
        localStorage.setItem('train_prog', this.train_prog);
        localStorage.setItem('group', this.group);
        localStorage.setItem('apiUrl', this.apiUrl);
        alert('Paramètres enregistrés avec succès!');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez vos styles ici */
  </style>
  