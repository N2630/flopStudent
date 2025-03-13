<template>
    <div>
      <h2>Paramètres</h2>
      <form @submit.prevent="saveSettings">
        <div>
          <label for="group">Groupe :</label>
          <input type="text" id="group" v-model="group" />
        </div>
        <div>
          <label for="year">Année :</label>
          <input type="number" id="year" v-model="year" />
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
        group: localStorage.getItem('group') || '',
        year: localStorage.getItem('year') || '',
        apiUrl: localStorage.getItem('apiUrl') || 'http://localhost:3000'
      };
    },
    methods: {
      saveSettings() {
        localStorage.setItem('group', this.group);
        localStorage.setItem('year', this.year);
        localStorage.setItem('apiUrl', this.apiUrl);
        alert('Paramètres enregistrés avec succès!');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez vos styles ici */
  </style>
  