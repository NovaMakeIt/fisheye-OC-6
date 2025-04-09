import { getPhotographersData } from './../api/api.js';
import { displayPhotographerInfo, displayLikesAndPrice } from './../utils/photographerProfile.js';
import { displayMedia } from './../utils/mediaManager.js';
import * as lightboxModule from './../utils/lightbox.js';

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
        
        // Ajouter l'écouteur d'événement pour le changement de tri
        const sortOptions = document.getElementById('sort-options');
        sortOptions.addEventListener('change', (e) => {
            displayMedia(photographerMedia, e.target.value, lightboxModule);
        });
        
        // Afficher le rectangle avec le total des likes et le prix du photographe
        displayLikesAndPrice(photographerMedia, photographer);
    } else {
        console.error('Photographe non trouvé');
    }
}

// Appeler la fonction quand la page est chargée
document.addEventListener('DOMContentLoaded', displayPhotographerDetails);