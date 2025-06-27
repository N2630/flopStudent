<template>
  <div class="schedule-grid">
    <div v-for="(courses, day) in organizedSchedules" :key="day" class="day-column">
      <h3>{{ getDayName(day) }}</h3>
      <template v-for="time in timeSlots" :key="time">
        <div class="time-slot">
          <template v-for="course in [getCourseAtTime(courses, time)]" :key="course ? course.id : 'no-course'">
            <div v-if="course" class="course-item" :style="{ backgroundColor: course.display.color_bg, color: course.display.color_txt }">
              <p>{{ course.course.name }}</p>
              <p>{{ course.room }}{{ course.prof ? ' - ' + course.prof : '' }}</p>
              <p>{{ minutesToTime(course.start_time) }}</p>
            </div>

            <!--
            <div v-else-if="time === 755 && !getCourseAtTime(courses, 755)" class="time-slot">
              <div :key="time + '-break'" class="break-slot">
                PAUSE DÉJEUNER
              </div>
            </div>
            -->
            <div v-else class="empty-slot">&nbsp;</div>
          </template>
        </div>
        
      </template>
    </div>
  </div>
</template>

<script>
import { fetchSchedules } from '../services/api';
import { organizeSchedules} from '../services/scheduleService';

export default {
  data() {
    return {
      schedules: [],
      organizedSchedules: {},
      timeSlots: [480, 570, 665, 755, 855, 945, 1030] // Exemple de créneaux horaires en minutes
    };
  },
  async created() {
    this.schedules = await fetchSchedules();
    this.organizedSchedules = organizeSchedules(this.schedules);
  },
  methods: {
    getDayName(dayLetter) {
      const days = {
        "m": "Lun.",
        "tu": "Mar.",
        "w": "Mer.",
        "th": "Jeu.",
        "f": "Ven."
      };
      return days[dayLetter] || "Jour inconnu";
    },
    getCourseAtTime(courses, time) {
      return courses.find(course => course.start_time === time);
    },
    minutesToTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style>
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  width: fit-content;
}

.day-column {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.time-slot {
  border-top: 1px solid #ddd;
}

.course-item,
.empty-slot {
  padding: 3px;
  margin: 5px 0;
  height: 5em;
  box-sizing: border-box;
}

.course-item {
  border: 1px solid #ddd;
  overflow: hidden;
}

.course-item p {
  margin: 0;
}

.empty-slot {
  background-color: white;
  border: 1px solid transparent;
}

.break-slot {
  text-align: center;
  margin: 5px 0;
  padding: 10px;
  background-color: #e9e9e9;
  font-weight: bold;
  border: 1px solid #ccc;
  height: 5em;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
