import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// global shared styles
import './assets/css/main.css';

createApp(App).use(router).mount('#app');
