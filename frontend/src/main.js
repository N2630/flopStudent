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
}

const saved = localStorage.getItem('fs_theme');

if (window.matchMedia && saved === 'sys' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	applyTheme('dark');
} else if (window.matchMedia && saved === 'sys' && window.matchMedia('(prefers-color-scheme: light)').matches) {
	applyTheme('light');
} else if (saved) {
	applyTheme(saved);
} else {
	applyTheme('dark');
}


createApp(App).use(router).mount('#app');
