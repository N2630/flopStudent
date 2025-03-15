import { createRouter, createWebHistory } from 'vue-router';
import SettingsPage from './views/Settings.vue';
import SchedulePage from './views/Schedule.vue';



const routes = [
  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsPage
  },
  {
    path: '/',
    name: 'Schedule',
    component: SchedulePage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
