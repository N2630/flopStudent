<template>
  <h1>Test</h1>
  <router-link to="/">App</router-link>
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
