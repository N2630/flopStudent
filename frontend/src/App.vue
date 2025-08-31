<template>
  <OfflineBanner />
  <InitialSetupBanner :showBanner="showInitialSetupBanner" @close-banner="hideInitialSetupBanner" />
  
  <header id="app-header">
    <button @click="toggleSidebar" class="menu-button">☰</button>
    <div id="logo-site-container">
      <img src="./assets/logo1.png" id="logo-site">
    </div>

    <h1>Flop Student</h1>
  </header>

  <div :class="{'app-layout': true, 'initial-setup-active': showInitialSetupBanner}">
    
    <aside :class="{'sidebar': true, 'is-open': isSidebarOpen}">
      <nav>
        <ul>
          <li><router-link to="/schedule">Emploi du temps</router-link></li>
          <li><router-link to="/info">Infos</router-link></li>
          <li><a @click="toggleSidebar" :href="'https://flopedt.iut-blagnac.fr/fr/edt/' + dept + '/'" target="_blank" rel="noopener noreferrer">Flop EDT</a></li>
        </ul>
      </nav>
    
    <router-link to="/settings" class="settings-link">
      <img src="https://cdn-icons-png.flaticon.com/128/45/45493.png" alt="Paramètres" class="settings-icon"> Paramètres
    </router-link>
    </aside>

    <main :class="{'content': true, 'sidebar-open': isSidebarOpen}">
  <router-view></router-view>

    </main>
  </div>
</template>

<script>
import OfflineBanner from './components/OfflineBanner.vue';
import InitialSetupBanner from './components/InitialSetupBanner.vue';

export default {
  name: 'App',
  components: {
    OfflineBanner,
    InitialSetupBanner
  },
  data() {
    return {
      isSidebarOpen: false,
      dept: localStorage.getItem('dept'),
      showInitialSetupBanner: false
    };
    
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    checkInitialSetup() {
      const dept = localStorage.getItem('dept');
      const train_prog = localStorage.getItem('train_prog');
      const group = localStorage.getItem('group');

      if (!dept || !train_prog || !group) {
        this.showInitialSetupBanner = true;
        if (this.$route.path !== '/settings') {
          this.$router.push('/settings');
        }
      } else {
        this.showInitialSetupBanner = false;
      }
    },
    hideInitialSetupBanner() {
      this.showInitialSetupBanner = false;
    }
  },
  watch: {
    $route(to) {
      if (this.isSidebarOpen) {
        this.isSidebarOpen = false;
      }
      document.title = to.meta.title || 'Flop Student'; // Mettre à jour le titre de l'onglet
      this.checkInitialSetup(); // Vérifier les paramètres à chaque changement de route
    }
  },
  created() {
    document.title = this.$route.meta.title || 'Flop Student';
    this.checkInitialSetup(); // Vérifier les paramètres au chargement initial
  }
};
</script>

<style src="./assets/css/app.css"></style>
