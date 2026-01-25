<template>
    <div v-for="(course, courseIndex) in courseInDay" :key="course.id">
        <div v-if="course.start_time < 755" class="morning-schedule">
            <div v-if="shouldInsertBlank(courseIndex)" class="blank-card" :style="{'--duree': getBlankDuration(courseIndex) }"></div>

            <CourseCard 
              :course="course"
              @open-course-info="$emit('open-course-info', $event)"
            />
        </div>

        <!-- Insérer un bloc repas si écart >= 60min avec le précédent et si créneau chevauche midi -->
        <div v-if="shouldInsertLunch(courseIndex)" class="lunch-card">Repas</div>

        <div v-if="course.start_time >= 755" class="afternoon-schedule">
            <div v-if="shouldInsertBlank(dayKey, courseIndex)" class="blank-card" :style="{'--duree': getBlankDuration(courseIndex) }"></div>

            <CourseCard 
              :course="course"
              @open-course-info="$emit('open-course-info', $event)"
            />
        </div>
    </div>
</template>

<script>
import CourseCard from './CourseCard.vue';

export default {
    name: 'DayCourseDisplay',
    props: {
        dayKey: {
            type: Object,
            required: true
        },
        courseInDay: {
            type: Array,
            required: true
        }
    },
    components: {
        CourseCard
    },
    data() {
        return {};
    },
    async created() {
        console.log(this.courseInDay)
    },
    methods: {
        /**
         * Décide si on insère un bloc repas avant le cours à l'index donné.
         * Règle: il existe un cours précédent et l'écart entre la fin de ce précédent
         * et le début du cours courant est >= 60 min et recouvre la tranche 11:30-14:30.
         */
        shouldInsertLunch(courseIndex) {
            const courses = this.courseInDay;

            if (courseIndex === 0) return false;

            const prev = courses[courseIndex - 1];
            const curr = courses[courseIndex];

            if (!prev || !curr) return false;

            const prevEnd = prev.start_time + 90;
            const gap = curr.start_time - prevEnd;

            if (gap < 60) return false;

            const lunchStart = 11 * 60 + 30;
            const lunchEnd = 14 * 60 + 30;

            // Le créneau de pause [prevEnd, curr.start] chevauche la plage déjeuner ?
            const overlap = Math.max(0, Math.min(curr.start_time, lunchEnd) - Math.max(prevEnd, lunchStart));
            return overlap >= 30; // au moins 30min dans la plage déjeuner
        },

        shouldInsertBlank(courseIndex) {
            const courses = this.courseInDay;

            // Premier cours : vide si ne commence pas à 8h00
            if (courseIndex === 0) {
                return courses[courseIndex].start_time > 480;
            }

            // Calculer le gap avec le cours précédent
            const prev = courses[courseIndex - 1];
            const curr = courses[courseIndex];

            if(prev === undefined || curr === undefined) {
                return false;
            }

            const prevEnd = prev.start_time + (prev.duration || 90);
            const gap = curr.start_time - prevEnd;

            return gap >= 15 && !this.shouldInsertLunch(courseIndex);
        },

        getBlankDuration(courseIndex) {
            const courses = this.courseInDay;
            const curr = courses[courseIndex];

            // Cas 1 : Vide avant le premier cours de la journée
            if (courseIndex === 0) {
                const startOfDay = 480; // 08:00 en minutes
                return curr.start_time - startOfDay;
            }

            // Cas 2 : Vide entre le cours précédent et l'actuel
            const prev = courses[courseIndex - 1];
            if (prev) {
                const prevEnd = prev.start_time + (prev.duration || 90);
                return curr.start_time - prevEnd;
            }

            return 0;
        }
    }
};
</script>

<style src="../../assets/css/scheduleCommon.css"></style>

<style scoped>
.blank-card {
  height: calc(var(--duree) * 1px);
  margin-bottom: 12px;
  padding: 12px;
}

.morning-schedule{
    max-height: 300px;
    margin-bottom: 12px;
}

.afternoon-schedule {
    margin-top: 10px;
    max-height: 370px;
}
</style>