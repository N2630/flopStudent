<template>
    <div v-if="course" class="modal-overlay" @click="$emit('close')">
        <div class="modal" @click.stop>
            <div class="modal-header">
                <h2>{{ course.course.name }}</h2>
                <button @click="$emit('close')">X</button>
            </div>
            <div class="modal-content">
                <p><strong>Type:</strong> {{ course.course.type }}</p>
                <p><strong>Noté:</strong> {{ course.course.is_graded ? 'Oui' : 'Non' }}</p>
                <p><strong>Salle:</strong> <router-link :to="`/rooms/${encodeURIComponent(course.room)}?from=schedule`" class="link">{{ course.room }}</router-link></p>
                <p v-if="course.prof">
                    <strong>Professeur:</strong> <router-link :to="`/profs/${encodeURIComponent(course.prof)}?from=schedule`" class="link">{{ course.prof }}</router-link>
                </p>
                <p v-else>
                    <strong>Professeur:</strong> Autonomie
                </p>
                <p><strong>Heure de début:</strong> {{ minutesToTime(course.start_time) }}</p>
                <p><strong>Durée:</strong> {{ course.duration }}</p>
            </div>
            
            
        </div>
    </div>
</template>
<script>
import { minutesToTime } from '../../utils/dateUtils';
export default {
    name: 'CourseInfo',
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
        minutesToTime
    }

}
</script>

<style scoped>
    .modal-header {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
        margin-bottom: 15px;
    }

    .modal {
        min-width: 30%;
        max-width: 80%;
        min-height: 30%;
        padding: 15px;
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    button {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: var(--text-default);
    }

    button:hover {
        background-color: var(--color-bg-hover);
        color: var(--text-dim);
    }

    .link {
        color: var(--sidebar-item-selected-text);
        text-decoration: none;
        cursor: pointer;
    }

    .link:hover {
        color: var(--sidebar-param-border-color);
        opacity: 0.8;
    }
</style>
