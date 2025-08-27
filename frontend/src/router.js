import { createRouter, createWebHistory } from 'vue-router';
import SettingsPage from './views/Settings.vue';
import SchedulePage from './views/Schedule.vue';
import InfoPage from './views/Info.vue'; // Importez le nouveau composant Info.vue

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
    path: '/',
    redirect: '/schedule',
    meta: { title: 'Accueil - Flop Student' } // Le redirect peut aussi avoir un titre
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
