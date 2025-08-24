<template>
  <header id="app-header">
    <button @click="toggleSidebar" class="menu-button">☰</button>
    <h1>Flop Student</h1>
  </header>

  <div class="app-layout">
    
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
export default {
  name: 'App',
  data() {
    return {
      isSidebarOpen: false,
      dept: localStorage.getItem('dept')
    };
    
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  },
  watch: {
    $route() {
      if (this.isSidebarOpen) {
        this.isSidebarOpen = false;
      }
    }
  }
};
</script>

<style src="./assets/css/app.css"></style>
