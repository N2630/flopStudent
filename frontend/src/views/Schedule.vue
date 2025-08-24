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

<style>
.plantEDT {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
}

.settings-link {
  margin-bottom: 20px;
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
}
.settings-icon{
  width: 20px;
  height: 20px;
  margin-right: 1px;
  color: green;
}
</style>
