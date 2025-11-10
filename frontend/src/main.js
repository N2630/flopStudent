import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// global shared styles
import './assets/css/main.css';

function setVh() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);
setVh();

createApp(App).use(router).mount('#app');
