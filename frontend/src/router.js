import { createRouter, createWebHistory } from 'vue-router';
import SettingsPage from './views/Settings.vue';
import SchedulePage from './views/Schedule.vue';
import InfoPage from './views/Info.vue'; // Importez le nouveau composant Info.vue
import SesamePage from './views/Sesame.vue';
import ProfSearcher from './views/ProfSearcher.vue';
import ProfDetail from './views/ProfDetail.vue';
import RoomSearcher from './views/RoomSearcher.vue';
import RoomDetail from './views/RoomDetail.vue';
import FollowSchedule from './views/FollowSchedule.vue';

const routes = [
  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsPage,
    meta: { title: 'Paramètres - Flop Student' }
  },
  {
    path: '/schedule',
    name: 'SchedulePage',
    component: SchedulePage,
    meta: { title: 'Emploi du temps - Flop Student' }
  },
  {
    path: '/info',
    name: 'InfoPage',
    component: InfoPage,
    meta: { title: 'Informations - Flop Student' }
  },
  {
    path: '/sesame',
    name: 'SesamePage',
    component: SesamePage,
    meta: { title: 'Sesame - Flop Student' }
  },
  {
    path: '/profs',
    name: 'ProfSearcher',
    component: ProfSearcher,
    meta: { title: 'Professeurs - Flop Student' }
  },
  {
    path: '/rooms',
    name: 'RoomSearcher',
    component: RoomSearcher,
    meta: { title: 'Salles - Flop Student' }
  },
  {
    path: '/follow-schedule',
    name: 'FollowSchedule',
    component: FollowSchedule,
    meta: { title: 'Suivi de l\'emploi du temps - Flop Student' }
  },
  {
    path: '/profs/:username',
    name: 'ProfDetail',
    component: ProfDetail,
    meta: { title: 'Professeur - Flop Student' }
  },
  {
    path: '/rooms/:room',
    name: 'RoomDetail',
    component: RoomDetail,
    meta: { title: 'Salle - Flop Student' }
  },
  {
    path: '/',
    redirect: '/schedule',
    meta: { title: 'Accueil - Flop Student' } // Le redirect peut aussi avoir un titre
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  
});

export default router;
