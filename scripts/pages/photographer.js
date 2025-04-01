// Fonction pour récupérer les données des photographes
async function getPhotographersData() {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier JSON');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur:', error);
        return { photographers: [], media: [] };
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
        displayMedia(photographerMedia, 'popularity');
        
        // Ajouter l'écouteur d'événement pour le changement de tri
        const sortOptions = document.getElementById('sort-options');
        sortOptions.addEventListener('change', (e) => {
            displayMedia(photographerMedia, e.target.value);
        });
    } else {
        console.error('Photographe non trouvé');
    }
}

// Fonction pour afficher les informations du photographe
function displayPhotographerInfo(photographer) {
    // Sélectionner l'en-tête du photographe
    const photographHeader = document.querySelector('.photograph-header');
    
    // Créer un conteneur pour les informations textuelles
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('photographer-info');

    // Créer les éléments pour les informations du photographe
    const nameElement = document.createElement('h1');
    nameElement.textContent = photographer.name;

    const locationElement = document.createElement('h2');
    locationElement.textContent = `${photographer.city}, ${photographer.country}`;

    const taglineElement = document.createElement('p');
    taglineElement.textContent = photographer.tagline;

    // Ajouter les éléments textuels au conteneur
    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(locationElement);
    infoContainer.appendChild(taglineElement);

    // Créer la photo de profil
    const profileImg = document.createElement('img');
    profileImg.src = `assets/photographers/${photographer.portrait}`;
    profileImg.alt = photographer.name;
    profileImg.classList.add('photographer-profile-img');

    // Créer le bouton de contact
    const contactButton = document.createElement('button');
    contactButton.textContent = 'Contactez-moi';
    contactButton.classList.add('contact_button');
    contactButton.addEventListener('click', displayModal);

    // Réorganiser les éléments dans l'en-tête
    photographHeader.innerHTML = ''; // Nettoyer le contenu existant
    photographHeader.appendChild(infoContainer);
    photographHeader.appendChild(contactButton);
    photographHeader.appendChild(profileImg);
}

// Fonction pour trier les médias selon l'option choisie
function sortMedia(media, sortBy) {
    const mediaCopy = [...media]; // Créer une copie pour ne pas modifier l'original
    
    switch(sortBy) {
        case 'popularity':
            return mediaCopy.sort((a, b) => b.likes - a.likes);
        case 'date':
            return mediaCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'title':
            return mediaCopy.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return mediaCopy;
    }
}

// Fonction pour afficher les médias
function displayMedia(media, sortBy) {
    const portfolioSection = document.querySelector('.photograph-portfolio');
    portfolioSection.innerHTML = ''; // Nettoyer le contenu existant
    
    // Trier les médias
    const sortedMedia = sortMedia(media, sortBy);
    
    // Créer et ajouter chaque carte média
    sortedMedia.forEach(item => {
        const mediaCard = document.createElement('article');
        mediaCard.classList.add('media-card');
        
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');
        
        // Créer l'élément média (image ou vidéo)
        let mediaElement;
        if (item.image) {
            mediaElement = document.createElement('img');
            mediaElement.src = `assets/images/${item.image}`;
            mediaElement.alt = item.title;
        } else if (item.video) {
            mediaElement = document.createElement('video');
            mediaElement.src = `assets/videos/${item.video}`;
            mediaElement.setAttribute('controls', '');
            mediaElement.setAttribute('preload', 'metadata');
        }
        
        mediaContainer.appendChild(mediaElement);
        
        // Créer le conteneur d'informations
        const mediaInfo = document.createElement('div');
        mediaInfo.classList.add('media-info');
        
        // Ajouter le titre
        const title = document.createElement('h3');
        title.classList.add('media-title');
        title.textContent = item.title;
        
        // Ajouter les likes
        const likes = document.createElement('div');
        likes.classList.add('media-likes');
        
        const likesCount = document.createElement('span');
        likesCount.textContent = item.likes;
        
        const heartIcon = document.createElement('span');
        heartIcon.classList.add('heart-icon');
        heartIcon.innerHTML = '❤'; // Icône cœur simple
        
        // Ajouter la fonctionnalité d'ajout de like
        heartIcon.addEventListener('click', () => {
            item.likes++;
            likesCount.textContent = item.likes;
        });
        
        likes.appendChild(likesCount);
        likes.appendChild(heartIcon);
        
        // Assembler le tout
        mediaInfo.appendChild(title);
        mediaInfo.appendChild(likes);
        
        mediaCard.appendChild(mediaContainer);
        mediaCard.appendChild(mediaInfo);
        
        portfolioSection.appendChild(mediaCard);
    });
}

// Fonction pour afficher la modal de contact (à définir ailleurs)
function displayModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'block';
}

// Fonction pour fermer la modal de contact
function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'none';
}

// Appeler la fonction quand la page est chargée
document.addEventListener('DOMContentLoaded', displayPhotographerDetails);