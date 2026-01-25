<template>
    <div class="follow-schedule-page">
        <h2>Groupes suivis :</h2>
        <button @click="addGrpToFollow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ajouter un groupe à suivre
        </button>
    </div>

    <div v-if="followedSchedules.length === 0" class="no-followed-schedules">
        Aucun groupe suivi pour le moment.
    </div>

    <div v-else class="followed-schedules-list">
        <GroupSchedule  v-for="schedule in followedSchedules" 
            :key="schedule.id" 
            :schedule-grp="schedule" 
        />
    </div>

    <SetupFollowScheduleModal 
        :show="showSetupModal" 
        @close="closeSetupModal"
        @setup-saved="onSettingsSaved"
    />
</template>

<script>
import SetupFollowScheduleModal from '@/components/followedSchedules/SetupFollowScheduleModal.vue';
import GroupSchedule from '@/components/followedSchedules/GroupSchedule.vue';
import { getFollowedSchedules } from '../utils/storageUtils';

export default {
    name: 'FollowSchedule',
    components: {
        SetupFollowScheduleModal,
        GroupSchedule
    },
    data() {
        return {
            showSetupModal: false,
            followedSchedules: getFollowedSchedules()
        };
    },
    methods: {
        addGrpToFollow() {
            this.showSetupModal = true;
        },
        onSettingsSaved() {
            // Handle any actions needed after settings are saved
            this.showSetupModal = false;
            this.followedSchedules = getFollowedSchedules();
            window.location.reload();
        },
        closeSetupModal() {
            this.showSetupModal = false;
        },
    }
};
</script>

<style>
.follow-schedule-page {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px auto 20px auto;
    padding: 10px;
    width: 95%;
}

.no-followed-schedules {
    margin-top: 10%;
    display: flex;
    justify-content: center;
    font-size: larger;
    font-weight: bold;

}

.followed-schedules-list{
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

button {
    background-color: var(--btn-primary-bg);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    display: flex;
    flex-direction: row;
    align-items: center;
}

button svg {
    width: 20px;
    height: 20px;
}

button:hover {
    background-color: var(--btn-primary-bg-hover);
}
</style>