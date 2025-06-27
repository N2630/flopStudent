<template>
  <div class="plantEDT">
    <h1>Flop Student</h1>
    <router-link to="/settings" class="settings-link">
      <img src="https://cdn-icons-png.flaticon.com/128/45/45493.png" alt="Paramètres" class="settings-icon"> Paramètres
    </router-link>


      <ScheduleList />

  </div>
</template>

<script>
import ScheduleList from '../components/ScheduleList.vue'

export default {
  name: 'SchedulePage',
  components: {
    ScheduleList
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
