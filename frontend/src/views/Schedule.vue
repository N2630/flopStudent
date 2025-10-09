<template>
  <div class="plantEDT">
    <div v-if="!showProfSchedule">
      <button @click="showProfSchedule = !showProfSchedule">+</button>
    </div>

    <div v-if="showProfSchedule">
      <input type="text" v-model="profDet" placeholder="Entrez les initiales du professeur" />
      <input type="submit" value="Rechercher" />
      <div @click="showProfSchedule = !showProfSchedule">
        <button @click="showProfSchedule = !showProfSchedule">X</button>
      </div>
      <div v-if="profDet">
        <ScheduleList sourceType="prof" profDet="profDet" />
      </div>
    </div>
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
  },
  data() {
    return {
      showProfSchedule: false,
      profDet: ''
    }
  }
};
</script>

<style src="../assets/css/schedule.css"></style>