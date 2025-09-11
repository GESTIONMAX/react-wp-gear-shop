export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CategoryFAQ {
  categorySlug: string;
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export const categoryFAQs: CategoryFAQ[] = [
  {
    categorySlug: 'sport',
    title: 'FAQ Sport & Performance',
    subtitle: 'Tout ce que vous devez savoir sur nos lunettes connectées pour le sport',
    items: [
      {
        id: 'sport-1',
        question: 'Les lunettes sport résistent-elles à la transpiration ?',
        answer: 'Absolument ! Toutes nos lunettes sport sont certifiées IP65 ou IP67, ce qui signifie qu\'elles résistent parfaitement à la transpiration, aux éclaboussures et même à une immersion temporaire. Les matériaux utilisés sont traités anti-corrosion pour une durabilité maximale.'
      },
      {
        id: 'sport-2',
        question: 'Quelle est l\'autonomie pendant une session d\'entraînement ?',
        answer: 'L\'autonomie varie selon le modèle : Music Shield offre jusqu\'à 8h d\'utilisation continue avec audio, Falcon jusqu\'à 12h sans audio, et Shield jusqu\'à 8h avec toutes les fonctionnalités activées. La charge rapide permet de récupérer 2h d\'autonomie en seulement 15 minutes.'
      },
      {
        id: 'sport-3',
        question: 'Peut-on utiliser l\'audio intégré en cyclisme sur route ?',
        answer: 'Oui, nos lunettes avec audio intégré sont spécialement conçues pour le cyclisme. Contrairement aux écouteurs, elles laissent les oreilles libres pour entendre la circulation, tout en délivrant un son clair par conduction osseuse. C\'est plus sûr et légal dans la plupart des pays.'
      },
      {
        id: 'sport-4',
        question: 'Les verres s\'adaptent-ils automatiquement à la luminosité ?',
        answer: 'Nos verres adaptatifs réagissent en 0,3 secondes aux changements de luminosité. Ils passent de 15% à 85% de transmittance lumineuse, s\'assombrissant automatiquement au soleil et s\'éclaircissant à l\'ombre ou en intérieur.'
      },
      {
        id: 'sport-5',
        question: 'Sont-elles compatibles avec un casque de vélo ?',
        answer: 'Parfaitement ! Nos lunettes sport ont été testées avec plus de 50 modèles de casques différents. Les branches fines et le design ergonomique garantissent un port confortable sans points de pression, même lors de sorties de plusieurs heures.'
      },
      {
        id: 'sport-6',
        question: 'Comment fonctionne le suivi de performance ?',
        answer: 'Via l\'application MyTechGear, vous pouvez suivre votre rythme cardiaque (capteur optionnel), votre vitesse, distance parcourue, et même analyser votre technique de pédalage. Les données sont synchronisées avec Strava, Garmin Connect et Apple Health.'
      }
    ]
  },
  {
    categorySlug: 'lifestyle',
    title: 'FAQ Lifestyle & Usage Quotidien',
    subtitle: 'Questions fréquentes sur l\'intégration des lunettes connectées dans votre vie quotidienne',
    items: [
      {
        id: 'lifestyle-1',
        question: 'Peut-on porter ces lunettes toute la journée au bureau ?',
        answer: 'Absolument ! Nos modèles Lifestyle sont conçus pour un port prolongé. Le filtre lumière bleue intégré réduit la fatigue oculaire des écrans, tandis que les notifications discrètes vous gardent connecté sans être intrusif. L\'autonomie de 12-16h couvre largement une journée de travail.'
      },
      {
        id: 'lifestyle-2',
        question: 'Les notifications sont-elles visibles par les autres ?',
        answer: 'Non, les notifications apparaissent uniquement dans votre champ de vision via des micro-LED invisibles de l\'extérieur. Seul vous pouvez voir les informations affichées. Le design reste élégant et professionnel en toutes circonstances.'
      },
      {
        id: 'lifestyle-3',
        question: 'Comment fonctionne la navigation GPS ?',
        answer: 'La navigation s\'affiche directement dans votre champ de vision avec des flèches directionnelles et la distance. Compatible avec Google Maps, Apple Plans et Waze. Les indications vocales sont délivrées discrètement par conduction osseuse sans gêner votre audition environnante.'
      },
      {
        id: 'lifestyle-4',
        question: 'Peut-on prescrire des verres correcteurs ?',
        answer: 'Oui ! Nous proposons un service d\'adaptation avec votre opticien partenaire. Tous nos modèles Lifestyle acceptent des verres correcteurs (myopie, hypermétropie, astigmatisme) tout en conservant leurs fonctionnalités connectées.'
      },
      {
        id: 'lifestyle-5',
        question: 'La connexion Bluetooth consomme-t-elle beaucoup ?',
        answer: 'Notre technologie Bluetooth 5.2 basse consommation est optimisée pour minimiser l\'impact sur votre smartphone. L\'usage typique représente moins de 3% de drain supplémentaire sur la batterie de votre téléphone par jour.'
      },
      {
        id: 'lifestyle-6',
        question: 'Y a-t-il une version femme spécifique ?',
        answer: 'Nos modèles Prime et Duck Classic sont disponibles en plusieurs tailles et coloris adaptés à tous. Le design unisexe s\'adapte naturellement aux différentes morphologies. Nous proposons également un service de personnalisation pour un ajustement parfait.'
      }
    ]
  },
  {
    categorySlug: 'prismatic',
    title: 'FAQ Technologie Prismatique',
    subtitle: 'Découvrez les secrets de nos verres à couleur réglable et leurs innovations',
    items: [
      {
        id: 'prismatic-1',
        question: 'Comment fonctionnent les verres à couleur réglable ?',
        answer: 'Nos verres prismatiques utilisent une technologie de cristaux liquides contrôlés électriquement. En appliquant des micro-tensions, nous modifions l\'orientation des cristaux pour décomposer la lumière et créer différents effets colorés. Le tout en conservant une clarté optique parfaite.'
      },
      {
        id: 'prismatic-2',
        question: 'Combien de couleurs peut-on afficher ?',
        answer: 'La technologie permet d\'afficher plus de 16,7 millions de nuances différentes ! Vous pouvez créer des dégradés, des effets arc-en-ciel, ou des couleurs unies. L\'application mobile offre des presets mais aussi une roue chromatique complète pour vos créations personnelles.'
      },
      {
        id: 'prismatic-3',
        question: 'Les effets sont-ils visibles de nuit ?',
        answer: 'Oui ! Les verres prismatiques fonctionnent aussi bien de jour que de nuit. En condition de faible luminosité, les effets sont même plus spectaculaires. Un mode "festival" spécial optimise les couleurs pour les événements nocturnes et concerts.'
      },
      {
        id: 'prismatic-4',
        question: 'Peut-on synchroniser avec la musique ?',
        answer: 'L\'Euphoria propose une synchronisation audio avancée ! Les couleurs pulsent et changent en rythme avec votre musique ou l\'ambiance sonore environnante. Parfait pour les festivals, soirées, ou simplement pour une expérience immersive unique.'
      },
      {
        id: 'prismatic-5',
        question: 'Quelle est la durée de vie des verres prismatiques ?',
        answer: 'Les cristaux liquides ont une durée de vie estimée à plus de 50 000 heures d\'utilisation, soit environ 15 ans d\'usage quotidien normal. La technologie est protégée par une garantie de 5 ans couvrant tous les défauts de fabrication.'
      },
      {
        id: 'prismatic-6',
        question: 'Y a-t-il des risques pour les yeux ?',
        answer: 'Aucun risque ! Nos verres respectent toutes les normes de sécurité oculaire internationales. Les LED utilisées émettent dans des fréquences sûres, et l\'intensité est automatiquement ajustée selon la luminosité ambiante pour éviter tout éblouissement.'
      }
    ]
  }
];

export const getFAQByCategory = (categorySlug: string): CategoryFAQ | undefined => {
  return categoryFAQs.find(faq => faq.categorySlug === categorySlug);
};