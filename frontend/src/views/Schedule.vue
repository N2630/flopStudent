<template>
    <h1>Test</h1>
    <router-link to="/settings">Paramètres</router-link>

    <ScheduleList />
  </template>
    
<script>
    import ScheduleList from '../components/ScheduleList.vue'
    
    export default {
      name: 'SchedulePage',
      components: {
        ScheduleList
      },
    };
</script>
  