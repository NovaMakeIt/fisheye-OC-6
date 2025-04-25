import { getPhotographersData } from './../api/api.js';
import { displayPhotographerInfo, displayLikesAndPrice } from './../utils/photographerProfile.js';
import { displayMedia } from './../utils/mediaManager.js';
import * as lightboxModule from './../utils/lightbox.js';

// Fonction pour le menu de tri
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
      mainOption.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Ouvrir/fermer le menu quand on clique sur l'option active
  mainOption.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });
  
  // Fonction pour ouvrir/fermer le dropdown
  function toggleDropdown() {
    const isOpen = sortMenu.classList.toggle('open');
    mainOption.setAttribute('aria-expanded', isOpen.toString());
    
    // Si le menu est ouvert, donner le focus au premier élément du dropdown
    if (isOpen) {
      const firstOption = dropdownContainer.querySelector('.sort-option');
      if (firstOption) {
        firstOption.tabIndex = 0;
        firstOption.focus();
      }
    }
  }
  
  // Gestion du clavier pour l'option principale
  mainOption.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!sortMenu.classList.contains('open')) {
          toggleDropdown();
        } else {
          // Focus sur la première option du dropdown
          const firstOption = dropdownContainer.querySelector('.sort-option');
          if (firstOption) {
            firstOption.focus();
          }
        }
        break;
      case 'Escape':
        if (sortMenu.classList.contains('open')) {
          e.preventDefault();
          sortMenu.classList.remove('open');
          mainOption.setAttribute('aria-expanded', 'false');
          mainOption.focus();
        }
        break;
    }
  });
  
  // Gérer le clic et la navigation clavier sur les options du dropdown
  dropdownContainer.querySelectorAll('.sort-option').forEach((option, index) => {
    // Rendre tous les éléments focusables
    option.tabIndex = 0;
    
    // Gestion du clic
    option.addEventListener('click', (e) => {
      handleOptionSelection(option);
    });
    
    // Gestion du clavier
    option.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleOptionSelection(option);
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Focus sur l'option suivante ou revenir à la première
          const nextOption = option.nextElementSibling || dropdownContainer.firstElementChild;
          if (nextOption) {
            nextOption.focus();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Focus sur l'option précédente ou aller à la dernière
          const prevOption = option.previousElementSibling || dropdownContainer.lastElementChild;
          if (prevOption) {
            prevOption.focus();
          }
          break;
        case 'Tab':
          // Fermer le dropdown au Tab
          sortMenu.classList.remove('open');
          mainOption.setAttribute('aria-expanded', 'false');
          break;
        case 'Escape':
          e.preventDefault();
          // Fermer le dropdown et remettre le focus sur l'option principale
          sortMenu.classList.remove('open');
          mainOption.setAttribute('aria-expanded', 'false');
          mainOption.focus();
          break;
        case 'Home':
          e.preventDefault();
          // Focus sur la première option
          dropdownContainer.firstElementChild.focus();
          break;
        case 'End':
          e.preventDefault();
          // Focus sur la dernière option
          dropdownContainer.lastElementChild.focus();
          break;
      }
    });
  });
  
  // Fonction pour gérer la sélection d'une option
  function handleOptionSelection(option) {
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
    const arrow = document.createElement('img');
    arrow.className = 'sort-arrow';
    arrow.src = 'assets/icons/arrow-tri.svg';
    arrow.alt = '';
    arrow.setAttribute('aria-hidden', 'true');
    mainOption.appendChild(arrow);
    
    // Fermer le menu
    sortMenu.classList.remove('open');
    mainOption.setAttribute('aria-expanded', 'false');
    mainOption.focus(); // Remettre le focus sur l'option principale
    
    // Rafraîchir l'affichage des médias
    displayMedia(photographerMedia, currentSortBy, lightboxModule);
    
    // Mettre à jour les options du dropdown
    updateDropdownOptions(currentSortBy);
    
    // Annoncer le changement pour les lecteurs d'écran
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = `Trié par ${optionText}`;
    document.body.appendChild(liveRegion);
    
    // Supprimer l'annonce après qu'elle ait été lue
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }
  
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
        newOption.setAttribute('role', 'option');
        newOption.tabIndex = 0;
        
        newOption.addEventListener('click', function(event) {
          event.stopPropagation();
          handleOptionSelection(this);
        });
        
        // Gestion du clavier pour la nouvelle option
        newOption.addEventListener('keydown', function(event) {
          switch (event.key) {
            case 'Enter':
            case ' ':
              event.preventDefault();
              handleOptionSelection(this);
              break;
            case 'ArrowDown':
              event.preventDefault();
              const nextOption = this.nextElementSibling || dropdownContainer.firstElementChild;
              if (nextOption) {
                nextOption.focus();
              }
              break;
            case 'ArrowUp':
              event.preventDefault();
              const prevOption = this.previousElementSibling || dropdownContainer.lastElementChild;
              if (prevOption) {
                prevOption.focus();
              }
              break;
            case 'Escape':
              event.preventDefault();
              sortMenu.classList.remove('open');
              mainOption.setAttribute('aria-expanded', 'false');
              mainOption.focus();
              break;
          }
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