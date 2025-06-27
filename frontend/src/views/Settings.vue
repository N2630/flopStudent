<template>
  <h1>Test</h1>
  <router-link to="/" class="settings-link">
    <img src="https://cdn-icons-png.flaticon.com/128/15281/15281992.png" alt="Retour" class="settings-icon"> Retour
  </router-link>
  <SettingsParams />
  
</template>
  
<script>
  import SettingsParams from '../components/SettingsParams.vue';
  
  export default {
    name: 'SettingsPage',
    components: {
      SettingsParams
    }
  };
</script>
