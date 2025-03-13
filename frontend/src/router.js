import { createRouter, createWebHistory } from 'vue-router';
import SettingsView from './views/Settings.vue';
import App from './views/App.vue';


const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
