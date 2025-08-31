<template>
  <div class="plantEDT">
    

    <ScheduleList />
    <FreeRoomsList />

  </div>
</template>

<script>
import ScheduleList from '../components/ScheduleList.vue'
import FreeRoomsList from '../components/FreeRoomsList.vue';

export default {
  name: 'SchedulePage',
  components: {
    ScheduleList,
    FreeRoomsList
  }
};
</script>

<style src="../assets/css/schedule.css"></style>