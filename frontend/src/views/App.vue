<template>
  <img alt="Vue logo" src="../assets/logo.png">
  
  <!-- Modifiez la cible du lien en /settings -->
  <router-link to="/Settings">Paramètres</router-link>
  
  <ScheduleList />

  <router-view></router-view>
  
</template>


<script>
import ScheduleList from '../components/ScheduleList.vue'

export default {
  name: 'App',
  components: {
    ScheduleList,
  },
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
