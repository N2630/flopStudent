<template>
    <div v-if="!courseInDay" class="loader-container">
        <div class="loader"></div>
        <p>
            Chargement ...
        </p>
    </div>
    
    <div v-else class="day-schedule">
        <!-- Cours du matin -->
        <div class="morning-schedule">
            <template v-for="(course, courseIndex) in morningCourses" :key="'morning-' + course.id">
                <div v-if="shouldInsertBlank(courseIndex, 'morning')" class="blank-card" :style="{'--duree': getBlankDuration(courseIndex, 'morning') }"></div>

                <CourseCard 
                  :course="course"
                  @open-course-info="$emit('open-course-info', $event)"
                />
            </template>
        </div>

        <!-- Bloc repas si nécessaire -->
        <div v-if="shouldInsertLunch()" class="lunch-card">Repas</div>

        <!-- Cours de l'après-midi -->
        <div class="afternoon-schedule">
            <template v-for="(course, courseIndex) in afternoonCourses" :key="'afternoon-' + course.id">
                <div v-if="shouldInsertBlank(courseIndex, 'afternoon')" class="blank-card" :style="{'--duree': getBlankDuration(courseIndex, 'afternoon') }"></div>

                <CourseCard 
                  :course="course"
                  @open-course-info="$emit('open-course-info', $event)"
                />
            </template>
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
    computed: {
        // Cours du matin (avant 12h35 = 755 minutes)
        morningCourses() {
            return this.courseInDay.filter(course => course.start_time < 755);
        },
        // Cours de l'après-midi (à partir de 12h35)
        afternoonCourses() {
            return this.courseInDay.filter(course => course.start_time >= 755);
        }
    },
    data() {
        return {};
    },
    async created() {
        console.log(this.courseInDay)
    },
    methods: {
        /**
         * Décide si on insère un bloc repas entre matin et après-midi.
         */
        shouldInsertLunch() {
            const morning = this.morningCourses;
            const afternoon = this.afternoonCourses;

            if (morning.length === 0 || afternoon.length === 0) return false;

            const lastMorning = morning[morning.length - 1];
            const firstAfternoon = afternoon[0];

            const prevEnd = lastMorning.start_time + (lastMorning.duration || 90);
            const gap = firstAfternoon.start_time - prevEnd;

            if (gap < 60) return false;

            const lunchStart = 11 * 60 + 30;
            const lunchEnd = 14 * 60 + 30;

            // Le créneau de pause [prevEnd, firstAfternoon.start] chevauche la plage déjeuner ?
            const overlap = Math.max(0, Math.min(firstAfternoon.start_time, lunchEnd) - Math.max(prevEnd, lunchStart));
            return overlap >= 30; // au moins 30min dans la plage déjeuner
        },

        shouldInsertBlank(courseIndex, period) {
            const courses = period === 'morning' ? this.morningCourses : this.afternoonCourses;
            const curr = courses[courseIndex];

            // Premier cours du matin : vide si ne commence pas à 8h00
            if (courseIndex === 0 && period === 'morning') {
                return curr.start_time > 480;
            }

            // Premier cours de l'après-midi : vide si ne commence pas à 14h15 (855 min)
            if (courseIndex === 0 && period === 'afternoon') {
                return curr.start_time > 855;
            }

            // Calculer le gap avec le cours précédent
            const prev = courses[courseIndex - 1];

            if (prev === undefined || curr === undefined) {
                return false;
            }

            const prevEnd = prev.start_time + (prev.duration || 90);
            const gap = curr.start_time - prevEnd;

            return gap >= 15;
        },

        getBlankDuration(courseIndex, period) {
            const courses = period === 'morning' ? this.morningCourses : this.afternoonCourses;
            const curr = courses[courseIndex];

            // Cas 1 : Vide avant le premier cours du matin
            if (courseIndex === 0 && period === 'morning') {
                const startOfDay = 480; // 08:00 en minutes
                return curr.start_time - startOfDay;
            }

            // Cas 2 : Vide avant le premier cours de l'après-midi (reprise à 14h15)
            if (courseIndex === 0 && period === 'afternoon') {
                const startOfAfternoon = 855; // 14:15 en minutes
                return curr.start_time - startOfAfternoon;
            }

            // Cas 3 : Vide entre le cours précédent et l'actuel
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

.day-schedule {
    display: flex;
    flex-direction: column;
    height: fit-content;
    gap: 10px;
}

.morning-schedule{
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 300px;
    max-height: 350px;
}

.afternoon-schedule {
    min-height: 370px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.loader-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.loader {
  border: 8px solid #f3f3f3; /* Couleur de fond (gris clair) */
  border-top: 8px solid #3498db; /* Couleur animée (bleu) */
  border-radius: 50%; /* Rend le div circulaire */
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite; /* Applique l'animation */
  z-index: 999;
}

/* Définition de l'animation de rotation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>