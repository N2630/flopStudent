<template>
  <div class="course-card" :style="{ borderLeftColor: course.display.color_bg, '--duree': getMinutesDuration(course.course.type) }">
    <div class="course-header">
      <div class="course-title" :style="{ fontWeight: course.course.is_graded ? 'bold' : 'normal' }">
        {{ course.course.name }}
      </div>
      <div v-if="course.course.is_graded" class="graded-course">DS</div>
    </div>
    <div class="course-time">{{ formatTime(course.start_time) }} - {{ formatTime(course.start_time +getMinutesDuration(course.course.type)) }}</div>
    <div class="course-duration">Durée: {{ getDuration(course.start_time, course.start_time + getMinutesDuration(course.course.type)) }}</div>
    <div class="course-detail">{{ course.course.type }} - {{ course.room }}{{ course.prof ? ' - ' + course.prof : '' }}</div>
  </div>
</template>
<script>
  export default {
    name: 'CourseCard',
    props: {
      course: {
        type: Object,
        required: true
      }
    },
    setup() {
      return {};
    },
    methods: {
      formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      },

      getDuration(startMinutes, endMinutes) {
        const duration = endMinutes - startMinutes;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (hours > 0 && minutes > 0) {
          return `${hours}h${minutes}`;
        } else if (hours > 0) {
          return `${hours}h`;
        } else {
          return `${minutes}min`;
        }
      },

      getMinutesDuration(courseType) {
        const duration = parseInt(courseType.split(/[A-Za-z]{2,}/)[1]) || 90;
        return duration;
      }
    }
  }
</script>

<style scoped>
.course-card {
  min-height: calc(var(--duree) * 1px);
  max-height: fit-content;
  background: var(--color-course-card-bg);
  border-radius: 8px;
  padding: 12px;
  box-shadow: var(--card-shadow);
  border-left: 4px solid var(--card-border-color);
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 12px;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--card-shadow-hover);
}

.course-header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.course-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-default);
  margin-bottom: 4px;
}

.course-time {
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 2px;
}

.course-duration {
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 4px;
}

.course-detail {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.3;
}

.graded-course {
  background-color: var(--color-graded);
  border-radius: 10px;
  padding: 4px;
  font-size: 12px;
  color: var(--text-on-graded);
  text-align: center;
  align-items: center;
  width: 30px;
  height: 25px;
  right: 0;
  top: 0;
}
</style>
