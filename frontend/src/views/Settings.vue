<template>
  <h1>Test</h1>
  <SettingsParams />
  <router-link to="/">App</router-link>
  <router-view></router-view>
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
