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
          <span class="nav-icon">📅</span>
          Emploi du temps
        </router-link>
        <router-link to="/info" @click="toggleSidebar" class="nav-item" :class="{'active': $route.path === '/info'}">
          <span class="nav-icon">ℹ️</span>
          Infos
        </router-link>
        <a @click="toggleSidebar" :href="'https://efts.univ-tlse2.fr/accueil/ent'" target="_blank" rel="noopener noreferrer" class="nav-item">
          <span class="nav-icon">🌐</span>
          ENT
        </a>
        <a @click="toggleSidebar" :href="'https://flopedt.iut-blagnac.fr/fr/edt/' + dept + '/'" target="_blank" rel="noopener noreferrer" class="nav-item">
          <span class="nav-icon">📊</span>
          Flop EDT
        </a>
        <a @click="toggleSidebar" :href="'https://scout.univ-toulouse.fr/'" target="_blank" rel="noopener noreferrer" class="nav-item">
          <span class="nav-icon">🎓</span>
          Scout
        </a>
        <a @click="toggleSidebar" :href="'https://scodocetudiant.iut-blagnac.fr/'" target="_blank" rel="noopener noreferrer" class="nav-item">
          <span class="nav-icon">📚</span>
          Scodoc
        </a>
        <a @click="toggleSidebar" :href="'https://webetud.iut-blagnac.fr/'" target="_blank" rel="noopener noreferrer" class="nav-item">
          <span class="nav-icon">💻</span>
          Web Etude
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <button @click="openSettingsModal" class="settings-btn">
          <span class="nav-icon">⚙️</span>
          Paramètres
        </button>
      </div>
    </aside>
    
    <!-- Overlay pour mobile -->
    <div :class="{'overlay': true, 'active': isSidebarOpen}" @click="toggleSidebar"></div>

    <!-- Main content -->
    <main class="main-content">
      <header class="main-header">
        <button @click="toggleSidebar" class="menu-button">☰</button>
        <div class="header-content">
          <h1>Mon Emploi du Temps</h1>
          <p v-if="groupInfo" class="group-info">{{ groupInfo }}</p>
        </div>
      </header>
      
      <router-view></router-view>
    </main>
    
    <!-- Modal de paramètres -->
    <SettingsParams 
      :show="showSettingsModal" 
      @close="closeSettingsModal"
      @settings-saved="onSettingsSaved"
    />
  </div>
</template>

<script>
import OfflineBanner from './components/OfflineBanner.vue';
import InitialSetupBanner from './components/InitialSetupBanner.vue';
import SettingsParams from './components/SettingsParams.vue';
import { getDept, getTrainProg, getGroup } from './utils/storageUtils';
import { isInitialSetupNeeded } from './services/initialSetupService';

export default {
  name: 'App',
  components: {
    OfflineBanner,
    InitialSetupBanner,
    SettingsParams
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
  background-color: #f5f5f5;
  color: #333;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #eee;
  position: relative;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.sidebar-header p {
  font-size: 14px;
  color: #666;
}

.close-sidebar {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
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
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #f8f9fa;
}

.nav-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.nav-icon {
  margin-right: 12px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #eee;
}

.settings-btn {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
}

.settings-btn:hover {
  background-color: #e9ecef;
}

/* Main content */
.main-content {
  flex: 1;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.main-header {
  background: white;
  padding: 16px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: #f0f0f0;
}

.header-content h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.group-info {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}

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