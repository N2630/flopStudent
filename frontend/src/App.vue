<template>
  <OfflineBanner />
  <InitialSetupBanner :showBanner="showInitialSetupBanner" @close-banner="hideInitialSetupBanner" />
  
  <div class="app-container">
    <!-- Sidebar -->
    <aside :class="{'sidebar': true, 'is-open': isSidebarOpen}">
      <div class="sidebar-header">
        <h2>Menu</h2>
        <p>Navigation</p>
        <button @click="toggleSidebar" class="close-sidebar">×</button>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/schedule" @click="toggleSidebar" class="nav-item" :class="{'active': $route.path === '/schedule'}">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
          </span>
          Emploi du temps
        </router-link>

        <router-link to="/info" @click="toggleSidebar" class="nav-item" :class="{'active': $route.path === '/info'}">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </span>
          Infos
        </router-link>

        <router-link to="/profs" @click="toggleSidebar" class="nav-item" :class="{'active': $route.path === '/profs'}">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </span>
          ProfFinder
        </router-link>

        <router-link to="/sesame" @click="toggleSidebar" class="nav-item" :class="{'active': $route.path === '/sesame'}">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
          </span>
          Sesame
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="openSettingsModal" class="settings-btn">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </span>
          Paramètres
        </button>
      </div>
    </aside>
    
    <div :class="{'overlay': true, 'active': isSidebarOpen}" @click="toggleSidebar"></div>

    <main class="main-content">
      <header class="main-header">
        <button @click="toggleSidebar" class="menu-button">☰</button>
        <div class="header-content">
          <h1>FlopStudent</h1>
          <p v-if="groupInfo" class="group-info">{{ groupInfo }}</p>
        </div>
        <img src="../src/assets/logo1.png" alt="Logo FlopStudent" class="logo" />
      </header>
      
      <router-view></router-view>
    </main>
    

    <SettingsParams 
      :show="showSettingsModal" 
      @close="closeSettingsModal"
      @settings-saved="onSettingsSaved"
    />
  </div>
</template>

<script>
import OfflineBanner from './components/banners/OfflineBanner.vue';
import InitialSetupBanner from './components/banners/InitialSetupBanner.vue';
import SettingsParams from './components/other/SettingsParams.vue';
import { getDept, getTrainProg, getGroup } from './utils/storageUtils';
import { isInitialSetupNeeded } from './services/initialSetupService';

export default {
  name: 'App',
  components: {
    OfflineBanner,
    InitialSetupBanner,
    SettingsParams,
  },
  data() {
    return {
      isSidebarOpen: false,
      dept: getDept(),
      showInitialSetupBanner: false,
      showSettingsModal: false
    };
  },
  computed: {
    groupInfo() {
      const dept = getDept();
      const trainProg = getTrainProg();
      const group = getGroup();
      if (dept && trainProg && group) {
        return `${dept} - ${trainProg} - ${group}`;
      }
      return null;
    }
  },
  methods: {
    /**
     * Ouvre ou ferme la sidebar de navigation.
     * Désactive le scroll de la page quand la sidebar est ouverte, le réactive sinon.
     *
     * @returns {void}
     */
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      if (this.isSidebarOpen) {
        document.body.style.overflow = 'hidden'; // Désactive le défilement
      } else {
        document.body.style.overflow = ''; // Réactive le défilement
      }
    },

    /**
     * Ouvre le modal de paramètres
     *
     * @returns {void}
     */
    openSettingsModal() {
      
      this.showSettingsModal = true;
      if (this.isSidebarOpen) {
        this.toggleSidebar();
      }
    },

    /**
     * Ferme le modal de paramètres
     *
     * @returns {void}
     */
    closeSettingsModal() {
      this.showSettingsModal = false;
    },

    /**
     * Vérifie si l'utilisateur doit effectuer la configuration initiale (département, année, groupe).
     * Si nécessaire, affiche la bannière d'initialisation et redirige vers la page des paramètres.
     *
     * @returns {void}
     */
    checkInitialSetup() {
      if (isInitialSetupNeeded()) {
        this.showInitialSetupBanner = true;
        this.openSettingsModal();
      } else {
        this.showInitialSetupBanner = false;
      }
    },

    /**
     * Masque la bannière d'initialisation.
     *
     * @returns {void}
     */
    hideInitialSetupBanner() {
      this.showInitialSetupBanner = false;
    },

    /**
     * Gère la sauvegarde des paramètres
     *
     * @param {Object} settings - Les paramètres sauvegardés
     * @returns {void}
     */
    onSettingsSaved(settings) {
      // Mettre à jour les données locales
      this.dept = settings.department;
      // Recharger la page pour appliquer les nouveaux paramètres
      window.location.reload();
    }
  },
  watch: {

    /**
     * Watcher sur la route : ferme la sidebar, réactive le scroll, met à jour le titre de la page
     * et vérifie la configuration initiale à chaque changement de route.
     *
     * @param {Route} to - Nouvelle route cible
     * @returns {void}
     */
    $route(to) {
      if (this.isSidebarOpen) {
        this.isSidebarOpen = false;
      }
      document.body.style.overflow = '';
      document.title = to.meta.title || 'Flop Student';
      this.checkInitialSetup();
    }
  },

  /**
   * Hook de cycle de vie appelé à la création du composant.
   * Met à jour le titre de la page et vérifie la configuration initiale.
   *
   * @returns {void}
   */
  created() {
    document.title = this.$route.meta.title || 'Flop Student';
    this.checkInitialSetup(); // Vérifier les paramètres au chargement initial
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--color-bg-main);
  color: var(--text-default);
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.logo {
  height: 50px;
  width: 80px;
  margin-left: auto;
  display: block;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: calc(var(--vh, 1vh) * 100);
  background: var(--color-bg-main);
  transition: left 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar.is-open {
  left: 0;
}

.sidebar-header {
  padding: 20px;
  border-bottom:  1px solid var(--sidebar-border-color);
  position: relative;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-default);
  margin-bottom: 4px;
}

.sidebar-header p {
  font-size: 14px;
  color: var(--text-subtitle-default);
}

.close-sidebar {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-subtitle-default);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0 120px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text-default);
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-item:hover {
  background-color: var(--sidebar-item-hover-bg);
}

.nav-item.active {
  background-color: var(--sidebar-item-selected-bg);
  color: var(--sidebar-item-selected-text);
}

.nav-icon {
  margin-right: 12px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--sidebar-border-color);
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
}

.settings-btn {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--color-bg-main);
  border: 1px solid var(--sidebar-param-border-color);
  border-radius: 8px;
  color: var(--text-default);
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
}

.settings-btn:hover {
  background-color: var(--sidebar-param-border-hover-color);
}

/* Main content */
.main-content {
  flex: 1;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.main-header {
  background: var(--color-primary);
  padding: 16px 20px;
  box-shadow: var(--default-shadow);
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: var(--color-bg-hover);
}

.header-content {
  /* prend tout l'espace disponible entre le bouton menu et le logo */
  flex: 1;
}

.header-content h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-default);
  margin-bottom: 4px;
}

.group-info {
  font-size: 14px;
  color: var(--text-subtitle-default);
  margin: 0;
}

/* overlay styles are centralized in src/assets/css/main.css */

/* Responsive */

@media (max-width: 767px) {
  .sidebar {
    left: -300px;
  }
  
  .sidebar.is-open {
    left: 0;
  }
}
</style>