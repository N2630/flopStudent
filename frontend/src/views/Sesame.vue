<template>
  <div class="center-div">
    <div class="container">
        <h1>Sésame</h1>
        <div class="sites-list">
          <SiteCard class="site-card"
            v-for="site in sites"
            :key="site.name"
            :site="site"
          />
        </div>
    </div>
  </div>
</template>
  
<script>
import SiteCard from '../components/other/SiteCard.vue';
import { getDept } from '../utils/storageUtils';


  export default {
    name: 'SesamePage',
    components: {
      SiteCard
    },
    data() {
      const dept = getDept();
      return {
        dept,
        sites: [
          { name: 'ENT', url: 'https://efts.univ-tlse2.fr/accueil/ent', isReachable: false, delay: 0 },
          { name: 'Flop!EDT', url: `https://flopedt.iut-blagnac.fr/fr/edt/${dept}/`, isReachable: false, delay: 0 },
          { name: 'Scout', url: 'https://scout.univ-toulouse.fr/', isReachable: false, delay: 0 },
          { name: 'Scodoc', url: 'https://scodocetudiant.iut-blagnac.fr/', isReachable: false, delay: 0 },
          { name: 'Web Etude', url: 'https://webetud.iut-blagnac.fr/', isReachable: false, delay: 0 }
        ]
      };
    },
  };
</script>
<style>
.container {
    background-color: var(--color-primary);
    width: 95%;
    padding: 20px;
    margin-top: 2%;
    border-radius: 12px;
    box-shadow: var(--default-shadow);
}
.center-div {
    display: flex;
    flex-direction: inherit;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.sites-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
}

.site-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--card-shadow-hover);

}

@media (max-width: 767px) {
  .sites-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .container {
    width: 98%;
    padding: 14px;
    margin-top: 6%;
  }
}
</style>
