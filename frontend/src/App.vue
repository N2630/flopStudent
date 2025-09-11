<template>
  <OfflineBanner />
  <InitialSetupBanner :showBanner="showInitialSetupBanner" @close-banner="hideInitialSetupBanner" />
  
  <header id="app-header">
    <button @click="toggleSidebar" class="menu-button">☰</button>
    <div id="logo-site-container">
      <img src="./assets/logo1.png" id="logo-site">
    </div>

    <h1>FlopStudent</h1>
  </header>

  <div :class="{'app-layout': true, 'initial-setup-active': showInitialSetupBanner}">
    
    <aside :class="{'sidebar': true, 'is-open': isSidebarOpen}">
      <nav>
        <ul>
          <li><router-link to="/schedule" @click="toggleSidebar">Emploi du temps</router-link></li>
          <li><router-link to="/info" @click="toggleSidebar">Infos</router-link></li>
          <li><a @click="toggleSidebar" :href="'https://efts.univ-tlse2.fr/accueil/ent'" target="_blank" rel="noopener noreferrer">ENT</a></li>
          <li><a @click="toggleSidebar" :href="'https://flopedt.iut-blagnac.fr/fr/edt/' + dept + '/'" target="_blank" rel="noopener noreferrer">Flop EDT</a></li>
          <li><a @click="toggleSidebar" :href="'https://scout.univ-toulouse.fr/'" target="_blank" rel="noopener noreferrer">Scout</a></li>
          <li><a @click="toggleSidebar" :href="'https://scodocetudiant.iut-blagnac.fr/'" target="_blank" rel="noopener noreferrer">Scodoc</a></li>
          <li><a @click="toggleSidebar" :href="'https://webetud.iut-blagnac.fr/'" target="_blank" rel="noopener noreferrer">Web Etude</a></li>
        </ul>
      </nav>
    
    <router-link to="/settings" class="settings-link" id="param-btn">
      <img src="https://cdn-icons-png.flaticon.com/128/45/45493.png" alt="Paramètres" class="settings-icon"> Paramètres
    </router-link>
    </aside>
    <div :class="{'overlay': true, 'active': isSidebarOpen}" @click="toggleSidebar"></div>

    <main :class="{'content': true, 'sidebar-open': isSidebarOpen}">
  <router-view></router-view>

    </main>
  </div>
</template>

<script>
import OfflineBanner from './components/OfflineBanner.vue';
import InitialSetupBanner from './components/InitialSetupBanner.vue';
import { getDept } from './utils/storageUtils';
import { isInitialSetupNeeded } from './services/initialSetupService';

export default {
  name: 'App',
  components: {
    OfflineBanner,
    InitialSetupBanner
  },
  data() {
    return {
      isSidebarOpen: false,
      dept: getDept(),
      showInitialSetupBanner: false
    };
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
     * Vérifie si l'utilisateur doit effectuer la configuration initiale (département, année, groupe).
     * Si nécessaire, affiche la bannière d'initialisation et redirige vers la page des paramètres.
     *
     * @returns {void}
     */
    checkInitialSetup() {
      if (isInitialSetupNeeded()) {
        this.showInitialSetupBanner = true;
        if (this.$route.path !== '/settings') {
          this.$router.push('/settings');
        }
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

<style src="./assets/css/app.css"></style>
