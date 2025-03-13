<template>
    <div>
      <h1>Emplois du Temps</h1>
      <ul>
        <li v-for="schedule in schedules" :key="schedule._id">
          {{ schedule.course.name }} - {{ schedule.room }} - {{ schedule.prof }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { fetchSchedules } from '../services/api';
  
  export default {
    name: 'ScheduleList',
    data() {
      return {
        schedules: []
      };
    },
    async created() {
      try {
        this.schedules = await fetchSchedules();
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }
  };
  </script>
  