import { createRouter, createWebHistory } from 'vue-router';
import SettingsPage from './views/Settings.vue';
import SchedulePage from './views/Schedule.vue';
import InfoPage from './views/Info.vue'; // Importez le nouveau composant Info.vue

const routes = [
  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsPage
  },
  {
    path: '/schedule',
    name: 'SchedulePage',
    component: SchedulePage
  },
  {
    path: '/info',
    name: 'InfoPage',
    component: InfoPage
  },
  {
    path: '/',
    redirect: '/schedule' // Redirige la route racine vers /schedule
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
