import { getPhotographersData } from './../api/api.js';
import { displayPhotographerInfo, displayLikesAndPrice } from './../utils/photographerProfile.js';
import { displayMedia } from './../utils/mediaManager.js';
import * as lightboxModule from './../utils/lightbox.js';

// Fonction corrigée pour le menu de tri
function initSortMenu(photographerMedia, lightboxModule) {
  const sortMenu = document.querySelector('.sort-menu');
  const sortOptions = document.querySelectorAll('.sort-option');
  const mainOption = sortMenu.querySelector('.sort-option.active');
  const dropdownContainer = document.querySelector('.sort-dropdown');
  let currentSortBy = 'popularity'; // Valeur par défaut
  
  // Fonction pour fermer le menu si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!sortMenu.contains(e.target)) {
      sortMenu.classList.remove('open');
    }
  });
  
  // Ouvrir/fermer le menu quand on clique sur l'option active
  mainOption.addEventListener('click', (e) => {
    e.stopPropagation();
    sortMenu.classList.toggle('open');
  });
  
  // Gérer le clic sur les options du dropdown
  dropdownContainer.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = option.dataset.value;
      const optionText = option.textContent.trim();
      
      // Ne rien faire si on clique sur l'option déjà active
      if (value === currentSortBy) {
        return;
      }
      
      // Mettre à jour la valeur de tri
      currentSortBy = value;
      
      // Mettre à jour le texte de l'option principale
      mainOption.textContent = optionText;
      mainOption.dataset.value = value;
      
      // Ajouter la flèche après le texte
      const arrow = document.createElement('span');
      arrow.className = 'sort-arrow';
      arrow.innerHTML = '&#9650;';
      mainOption.appendChild(arrow);
      
      // Fermer le menu
      sortMenu.classList.remove('open');
      
      // Rafraîchir l'affichage des médias
      displayMedia(photographerMedia, currentSortBy, lightboxModule);
      
      // Recréer l'option dans le dropdown pour pouvoir la sélectionner à nouveau plus tard
      const originalOptions = {
        'popularity': 'Popularité',
        'date': 'Date',
        'title': 'Titre'
      };
      
      // Vider le dropdown et recréer toutes les options sauf celle qui est active
      dropdownContainer.innerHTML = '';
      
      for (const [key, text] of Object.entries(originalOptions)) {
        if (key !== value) {
          const newOption = document.createElement('div');
          newOption.className = 'sort-option';
          newOption.dataset.value = key;
          newOption.textContent = text;
          
          // Ajouter l'écouteur d'événement au nouvel élément
          newOption.addEventListener('click', function(event) {
            event.stopPropagation();
            const newValue = this.dataset.value;
            const newText = this.textContent.trim();
            
            // Mettre à jour la valeur de tri
            currentSortBy = newValue;
            
            // Mettre à jour le texte de l'option principale
            mainOption.textContent = newText;
            mainOption.dataset.value = newValue;
            
            // Ajouter la flèche après le texte
            const arrow = document.createElement('span');
            arrow.className = 'sort-arrow';
            arrow.innerHTML = '&#9650;';
            mainOption.appendChild(arrow);
            
            // Fermer le menu
            sortMenu.classList.remove('open');
            
            // Rafraîchir l'affichage des médias
            displayMedia(photographerMedia, newValue, lightboxModule);
            
            // Recréer les options du dropdown
            updateDropdownOptions(newValue);
          });
          
          dropdownContainer.appendChild(newOption);
        }
      }
    });
  });
  
  // Fonction pour mettre à jour les options du dropdown
  function updateDropdownOptions(activeValue) {
    const originalOptions = {
      'popularity': 'Popularité',
      'date': 'Date',
      'title': 'Titre'
    };
    
    dropdownContainer.innerHTML = '';
    
    for (const [key, text] of Object.entries(originalOptions)) {
      if (key !== activeValue) {
        const newOption = document.createElement('div');
        newOption.className = 'sort-option';
        newOption.dataset.value = key;
        newOption.textContent = text;
        
        newOption.addEventListener('click', function(event) {
          event.stopPropagation();
          const newValue = this.dataset.value;
          const newText = this.textContent.trim();
          
          currentSortBy = newValue;
          mainOption.textContent = newText;
          mainOption.dataset.value = newValue;
          
          const arrow = document.createElement('span');
          arrow.className = 'sort-arrow';
          arrow.innerHTML = '&#9650;';
          mainOption.appendChild(arrow);
          
          sortMenu.classList.remove('open');
          displayMedia(photographerMedia, newValue, lightboxModule);
          updateDropdownOptions(newValue);
        });
        
        dropdownContainer.appendChild(newOption);
      }
    }
  }
}

// Fonction pour afficher les détails du photographe
async function displayPhotographerDetails() {
    // Récupérer l'ID du photographe depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const photographerId = parseInt(params.get('id'));

    // Récupérer les données
    const data = await getPhotographersData();
    const photographers = data.photographers;
    const allMedia = data.media;

    // Trouver le photographe correspondant à l'ID
    const photographer = photographers.find(p => p.id === photographerId);
    // Filtrer les médias pour ce photographe
    const photographerMedia = allMedia.filter(m => m.photographerId === photographerId);

    if (photographer) {
        // Afficher les informations du photographe
        displayPhotographerInfo(photographer);
        
        // Afficher les médias par défaut (triés par popularité)
        displayMedia(photographerMedia, 'popularity', lightboxModule);
        
        // Initialiser le menu de tri personnalisé
        initSortMenu(photographerMedia, lightboxModule);
        
        // Afficher le rectangle avec le total des likes et le prix du photographe
        displayLikesAndPrice(photographerMedia, photographer);
    } else {
        console.error('Photographe non trouvé');
    }
}

// Appeler la fonction quand la page est chargée
document.addEventListener('DOMContentLoaded', displayPhotographerDetails);