<template>
  <div class="center-div">
    <div class="params-container">
      <h1>Paramètres</h1>
      <SettingsParams />
    </div>
  </div>
  
  
  
</template>
  
<script>
  import SettingsParams from '../components/other/SettingsParams.vue';
  
  export default {
    name: 'SettingsPage',
    components: {
      SettingsParams
    }
  };
</script>
<style>
.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
<style src="../assets/css/settingsParams.css"></style>
