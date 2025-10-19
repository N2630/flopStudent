<template>
  <div class="course-card" :style="{ borderLeft: '4px solid ' + course.color }">
    <div class="subject">{{ course.subject }}</div>
    <div class="time">{{ course.time }}</div>
    <div class="duration">Durée : {{ course.duration }}</div>
    <div class="detail">{{ course.detail }}</div>
  </div>
</template>
<script setup>
defineProps({ course: Object })
</script>
<style scoped>
.course-card {
  background: #f7f7fa;
  margin-bottom: 1em;
  padding: 1em;
  border-radius: 9px;
  box-shadow: 0 1px 4px rgba(10,10,10,0.05);
}
.subject { font-weight: 600; }
.time, .duration, .detail { font-size: 0.96em; }
</style>
