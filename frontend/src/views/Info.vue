<template>
  <div class="info-page">
    
    <div class="main-info">
      <h1>À propos de FlopStudent</h1>
      <div class="main-info-texte">
        <p>
          <strong>FlopStudent</strong> est une application alternative à <a class="links" href="https://www.flopedt.org/">flop!EDT</a> qui vous permet de consulter votre emploi du temps en toute simplicité.<br>
          Comme flop!EDT, FlopStudent offre un accès gratuit et sans création de compte à votre planning, et sera prochainement open source.
        </p>


        <u>FlopStudent, c'est aussi des fonctionnalités en plus :</u>
        <ul>
          <li>Consultez votre emploi du temps de la semaine, même hors-ligne.</li>
          <li>Accédez à la liste des salles libres pour chaque créneau de la journée.</li>
          <li>Un affichage épuré : seul votre emploi du temps est affiché, pour gagner du temps lorsque vous êtes pressé.</li>
          <li>Un accès garanti même pendant les vacances, lorsque flop!EDT peut être indisponible.</li>
          <li>Une interface optimisée et plus agréable à utiliser sur mobile.</li>
        </ul>


        <p>
          Ce projet est entièrement non lucratif: <b>aucune de vos données n'est collectée à des fins commerciales</b>.<br>
          Il est possible que, dans le futur, certaines données anonymes soient utilisées à des fins d'analyse pour améliorer l'outil, mais ce n'est pas le cas actuellement.
        </p>
      </div>
      
    </div>

    <div class="separator"></div>

    <div class="faq-section">
      <h1>FAQ</h1>

      <div>
        <div class="faq-item">

          <button class="faq-question" @click="showFaq1 = !showFaq1">
            D'où viennent les données utilisées pour FlopStudent ?
            <span class="chevron" :class="{ open: showFaq1 }">▶</span>
          </button>

          <div v-if="showFaq1" class="faq-answer">
            Les données proviennent directement du site officiel flop!EDT de l'<a class="links" href="https://iut-blagnac.fr">iut</a>, via des requêtes automatisées. 
            Aucune donnée personnelle n'est stockée ou collectée par FlopStudent.
            Nous utilisons l'api officiel de flop!EDT pour récupérer les cours.
          </div>
          </div>

        <div class="faq-item">

          <button class="faq-question" @click="showFaq2 = !showFaq2">
            Est-ce que FlopStudent fonctionne sans connexion internet ?
            <span class="chevron" :class="{ open: showFaq2 }">▶</span>
          </button>

          <div v-if="showFaq2" class="faq-answer">
            Oui, votre emploi du temps de la semaine reste accessible même hors-ligne, à condition d'avoir consulté la semaine au moins une fois avec internet.
          </div>

        </div>

        <div class="faq-item">

          <button class="faq-question" @click="showFaq3 = !showFaq3">
            Mes données sont-elles utilisées à des fins commerciales ?
            <span class="chevron" :class="{ open: showFaq3 }">▶</span>
          </button>

          <div v-if="showFaq3" class="faq-answer">
            Non, tout comme flop!EDT, FlopStudent est un projet non lucratif. Aucune donnée personnelle n'est collectée ni utilisée à des fins commerciales.
            Cependant dans le futur, certaines données anonymes pourraient être utilisées à des fins d'analyse pour améliorer l'outil, mais ce n'est pas le cas actuellement.
          </div>

        </div>

        <div class="faq-item">

          <button class="faq-question" @click="showFaq4 = !showFaq4">
            Et si flop!EDT ne marche plus, puis-je toujours accéder à mon emploi du temps ?
            <span class="chevron" :class="{ open: showFaq4 }">▶</span>
          </button>

          <div v-if="showFaq4" class="faq-answer">
            Oui, afin de parer à cette éventualité, nous stockons les semaines de cours à l'avance et les mettons à jour régulièrement. 
            Ainsi, vous pouvez toujours accéder à votre emploi du temps, même si flop!EDT devient temporairement inaccessible. 
            Vous disposez d'une visibilité sur 4 semaines (semaine actuelle comprise), ce qui vous permet de consulter votre planning même lors 
            d'un retour de vacances ou en cas de panne du service principal.
          </div>

        </div>

        <div class="faq-item">

          <button class="faq-question" @click="showFaq5 = !showFaq5">
            Quand les emplois du temps sont-ils mis à jours ?
            <span class="chevron" :class="{ open: showFaq5 }">▶</span>
          </button>

          <div v-if="showFaq5" class="faq-answer">
            Les emplois du temps sont mis à jour automatiquement toutes les 10 minutes, du lundi au vendredi, entre 8h et 18h59, afin de garantir l'exactitude des informations pour la semaine en cours.<br>
            De plus, les 4 prochaines semaines sont actualisées et nettoyées toutes les heures entre 10h et 17h.<br>
            Enfin, une synchronisation complète est effectuée à chaque redémarrage du serveur.<br>
            Ainsi, dès qu'une modification est détectée sur flop!EDT, elle est rapidement prise en compte sur FlopStudent, pour vous garantir un planning toujours à jour.
          </div>

          </div>
      </div>
      

    </div>

  </div>

</template>

<script>

export default {
  name: 'InfoPage',
  data() {
    return {
      showFaq1: false,
      showFaq2: false,
      showFaq3: false,
      showFaq4: false,
      showFaq5: false,
    };
  }
};
</script>

<style scoped>
.info-page {
  padding: 20px;
  max-width: 950px;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-default);
}

.main-info {
  background: var(--color-bg-panel);
  padding: 20px;
  border-radius: var(--card-radius);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid var(--card-border-color);
}

.main-info h1 {
  margin: 0 0 6px 0;
  font-size: 1.5rem;
  color: var(--text-default);
}

.main-info-texte {
  background: var(--color-neutral);
  padding: 16px;
  border-radius: 8px;
  color: var(--text-default);
}

.main-info-texte ul {
    list-style-type: disc; 
    padding-left: 28px;
}

.links {
  color: var(--sidebar-item-selected-text);
  font-weight: 600;
}

.separator {
  margin-top: 28px;
  border-top: 1px solid var(--default-border-color);
  padding-top: 28px;
}

.faq-section {
  background: var(--color-bg-panel);
  padding: 18px;
  border-radius: var(--card-radius);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--card-border-color);
}

.faq-item { width: 100%; }

.faq-question {
  background: var(--color-bg-panel);
  border: 1px solid var(--default-border-color);
  font-weight: 600;
  font-size: 1rem;
  padding: 10px 14px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.faq-question:hover {
  background: var(--color-bg-hover);
}

.faq-answer {
  padding: 12px 14px;
  background: var(--color-neutral);
  border-radius: 0 0 6px 6px;
  margin-bottom: 6px;
  border-left: 3px solid var(--sidebar-item-selected-text);
  font-size: 0.98rem;
  color: var(--text-default);
}

.chevron {
  display: inline-block;
  width: 1.4em;
  font-size: 1.1em;
  color: var(--sidebar-item-selected-text);
  margin-left: 8px;
  transition: transform 0.2s ease;
}
.chevron.open { transform: rotate(90deg); }

@media (max-width: 720px) {
  .info-page { padding: 12px; }
  .main-info h1 { font-size: 1.25rem; }
}
</style>