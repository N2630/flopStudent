import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// global shared styles
import './assets/css/themes.css';
import './assets/css/main.css';

function setVh() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);
setVh();

function applyTheme(themeName) {
	const el = document.documentElement;
	el.classList.remove('theme--light', 'theme--dark', 'theme--high-contrast');
	if (themeName && themeName !== 'light') el.classList.add(`theme--${themeName}`);
	localStorage.setItem('fs_theme', themeName);
}

const saved = localStorage.getItem('fs_theme');
if (saved) {
	applyTheme(saved);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	applyTheme('dark');
} else {
	applyTheme('light');
}
createApp(App).use(router).mount('#app');
