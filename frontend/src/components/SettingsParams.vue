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
      };
    },
    methods: {
      saveSettings() {
        localStorage.setItem('dept', this.dept);
        localStorage.setItem('train_prog', this.train_prog);
        localStorage.setItem('group', this.group);
        alert('Paramètres enregistrés avec succès!');
      }
    }
  };
  </script>
  
<style scoped>
form {
  width: 100%;
}
</style>
  